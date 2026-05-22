<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';
require __DIR__ . '/config/auth.php';

require_method('GET', 'POST', 'DELETE');
require_csrf();

try {
    $pdo = getDb();
    $me = require_login();

    if (method() === 'GET') {
        $where = [];
        $params = [];

        // Escopo por papel.
        if ($me['role'] === 'usuario') {
            $where[] = 'r.usuario_id = ?';
            $params[] = (int) $me['id'];
        } elseif ($me['role'] === 'adm_vinicola') {
            $where[] = 'r.vinicola_id = ?';
            $params[] = (int) $me['vinicola_id'];
        }
        // adm_supremo: sem filtro de escopo.

        if (isset($_GET['status']) && $_GET['status'] !== '') {
            $where[] = 'r.status = ?';
            $params[] = $_GET['status'];
        }

        $sql = '
            SELECT r.id, r.usuario_id, r.vinicola_id, r.experiencia_id, r.horario_id,
                   r.data_reserva, r.horario, r.num_pessoas, r.preco_total, r.status,
                   r.criado_em,
                   v.nome AS vinicola_nome, v.cidade,
                   e.nome AS experiencia_nome, e.duracao_minutos,
                   u.nome_completo, u.email
            FROM reservas r
            JOIN vinicolas v ON v.id = r.vinicola_id
            JOIN experiencias e ON e.id = r.experiencia_id
            JOIN usuarios u ON u.id = r.usuario_id
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

        $pdo->beginTransaction();

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
            INSERT INTO reservas (usuario_id, vinicola_id, experiencia_id, horario_id,
                                  data_reserva, horario, num_pessoas, preco_total, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $ins->execute([
            (int) $me['id'],
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
            SELECT r.id, r.usuario_id, r.vinicola_id, r.experiencia_id, r.horario_id,
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

        $sel = $pdo->prepare('SELECT usuario_id, vinicola_id, horario_id, num_pessoas, status FROM reservas WHERE id = ? FOR UPDATE');
        $sel->execute([$id]);
        $r = $sel->fetch();
        if (!$r) {
            $pdo->rollBack();
            json_error('Reserva nao encontrada', 404);
        }

        // Escopo de cancelamento.
        $podeCancel = $me['role'] === 'adm_supremo'
            || ($me['role'] === 'adm_vinicola' && (int) $r['vinicola_id'] === (int) $me['vinicola_id'])
            || ($me['role'] === 'usuario' && (int) $r['usuario_id'] === (int) $me['id']);
        if (!$podeCancel) {
            $pdo->rollBack();
            json_error('Voce nao tem permissao para cancelar essa reserva', 403);
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
