<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';

require_method('GET', 'POST', 'DELETE');

try {
    $pdo = getDb();

    if (method() === 'GET') {
        $where = [];
        $params = [];

        if (isset($_GET['email']) && $_GET['email'] !== '') {
            $where[] = 'vis.email = ?';
            $params[] = trim($_GET['email']);
        }
        if (isset($_GET['visitante_id'])) {
            $where[] = 'r.visitante_id = ?';
            $params[] = (int) $_GET['visitante_id'];
        }
        if (isset($_GET['status']) && $_GET['status'] !== '') {
            $where[] = 'r.status = ?';
            $params[] = $_GET['status'];
        }

        $sql = '
            SELECT r.id, r.visitante_id, r.vinicola_id, r.experiencia_id, r.horario_id,
                   r.data_reserva, r.horario, r.num_pessoas, r.preco_total, r.status,
                   r.criado_em,
                   v.nome AS vinicola_nome, v.cidade,
                   e.nome AS experiencia_nome, e.duracao_minutos,
                   vis.nome_completo, vis.email
            FROM reservas r
            JOIN vinicolas v ON v.id = r.vinicola_id
            JOIN experiencias e ON e.id = r.experiencia_id
            JOIN visitantes vis ON vis.id = r.visitante_id
        ';
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY r.data_reserva, r.horario';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        json_response($stmt->fetchAll());
    }

    if (method() === 'POST') {
        $body = read_json_body();

        $horarioId = (int) ($body['horario_id'] ?? 0);
        $numPessoas = (int) ($body['num_pessoas'] ?? 1);

        if ($horarioId <= 0 || $numPessoas <= 0) {
            json_error('horario_id e num_pessoas sao obrigatorios', 422);
        }

        // Visitante: aceita visitante_id direto ou bloco "visitante" com nome+email.
        $visitanteId = isset($body['visitante_id']) ? (int) $body['visitante_id'] : 0;
        $vis = $body['visitante'] ?? null;

        $pdo->beginTransaction();

        if ($visitanteId === 0) {
            if (!is_array($vis) || empty($vis['email']) || empty($vis['nome_completo'] ?? $vis['nome'] ?? '')) {
                $pdo->rollBack();
                json_error('visitante.nome_completo e visitante.email sao obrigatorios', 422);
            }
            $email = trim((string) $vis['email']);
            $nome = trim((string) ($vis['nome_completo'] ?? $vis['nome']));
            $tel = trim((string) ($vis['telefone'] ?? '')) ?: null;

            $sel = $pdo->prepare('SELECT id FROM visitantes WHERE email = ? FOR UPDATE');
            $sel->execute([$email]);
            $row = $sel->fetch();
            if ($row) {
                $visitanteId = (int) $row['id'];
                $upd = $pdo->prepare('UPDATE visitantes SET nome_completo = ?, telefone = ? WHERE id = ?');
                $upd->execute([$nome, $tel, $visitanteId]);
            } else {
                $ins = $pdo->prepare('INSERT INTO visitantes (nome_completo, email, telefone) VALUES (?, ?, ?)');
                $ins->execute([$nome, $email, $tel]);
                $visitanteId = (int) $pdo->lastInsertId();
            }
        }

        // Trava o horario para impedir overbooking concorrente.
        $sel = $pdo->prepare('
            SELECT h.id, h.vinicola_id, h.experiencia_id, h.data, h.horario,
                   h.capacidade_maxima, h.vagas_disponiveis, e.preco_por_pessoa
            FROM horarios h
            JOIN experiencias e ON e.id = h.experiencia_id
            WHERE h.id = ?
            FOR UPDATE
        ');
        $sel->execute([$horarioId]);
        $h = $sel->fetch();
        if (!$h) {
            $pdo->rollBack();
            json_error('Horario nao encontrado', 404);
        }
        if ((int) $h['vagas_disponiveis'] < $numPessoas) {
            $pdo->rollBack();
            json_error('Vagas insuficientes', 409, ['vagas_disponiveis' => (int) $h['vagas_disponiveis']]);
        }

        $upd = $pdo->prepare('UPDATE horarios SET vagas_disponiveis = vagas_disponiveis - ? WHERE id = ?');
        $upd->execute([$numPessoas, $horarioId]);

        $precoTotal = (float) $h['preco_por_pessoa'] * $numPessoas;

        $ins = $pdo->prepare('
            INSERT INTO reservas (visitante_id, vinicola_id, experiencia_id, horario_id,
                                  data_reserva, horario, num_pessoas, preco_total, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $ins->execute([
            $visitanteId,
            (int) $h['vinicola_id'],
            (int) $h['experiencia_id'],
            (int) $h['id'],
            $h['data'],
            $h['horario'],
            $numPessoas,
            $precoTotal,
            'confirmada',
        ]);
        $reservaId = (int) $pdo->lastInsertId();

        $pdo->commit();

        $stmt = $pdo->prepare('
            SELECT r.id, r.visitante_id, r.vinicola_id, r.experiencia_id, r.horario_id,
                   r.data_reserva, r.horario, r.num_pessoas, r.preco_total, r.status,
                   v.nome AS vinicola_nome, e.nome AS experiencia_nome
            FROM reservas r
            JOIN vinicolas v ON v.id = r.vinicola_id
            JOIN experiencias e ON e.id = r.experiencia_id
            WHERE r.id = ?
        ');
        $stmt->execute([$reservaId]);
        json_response($stmt->fetch(), 201);
    }

    if (method() === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) {
            $body = read_json_body();
            $id = (int) ($body['id'] ?? 0);
        }
        if ($id <= 0) json_error('id obrigatorio', 422);

        $pdo->beginTransaction();

        $sel = $pdo->prepare('SELECT horario_id, num_pessoas, status FROM reservas WHERE id = ? FOR UPDATE');
        $sel->execute([$id]);
        $r = $sel->fetch();
        if (!$r) {
            $pdo->rollBack();
            json_error('Reserva nao encontrada', 404);
        }
        if ($r['status'] === 'cancelada') {
            $pdo->rollBack();
            json_error('Reserva ja cancelada', 409);
        }

        $upd = $pdo->prepare('UPDATE reservas SET status = ? WHERE id = ?');
        $upd->execute(['cancelada', $id]);

        $devolveVagas = $pdo->prepare('UPDATE horarios SET vagas_disponiveis = vagas_disponiveis + ? WHERE id = ?');
        $devolveVagas->execute([(int) $r['num_pessoas'], (int) $r['horario_id']]);

        $pdo->commit();
        json_response(['id' => $id, 'status' => 'cancelada']);
    }
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    json_error($e->getMessage(), 500);
}
