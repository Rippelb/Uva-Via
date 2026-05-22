<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';
require __DIR__ . '/config/auth.php';

require_method('GET', 'POST', 'PUT', 'DELETE');
require_csrf();

try {
    $pdo = getDb();

    if (method() === 'GET') {
        $where = [];
        $params = [];

        if (isset($_GET['vinicola_id'])) {
            $where[] = 'h.vinicola_id = ?';
            $params[] = (int) $_GET['vinicola_id'];
        }
        if (isset($_GET['experiencia_id'])) {
            $where[] = 'h.experiencia_id = ?';
            $params[] = (int) $_GET['experiencia_id'];
        }
        if (isset($_GET['data'])) {
            $where[] = 'h.data = ?';
            $params[] = $_GET['data'];
        }
        if (isset($_GET['data_inicio'])) {
            $where[] = 'h.data >= ?';
            $params[] = $_GET['data_inicio'];
        }
        if (isset($_GET['data_fim'])) {
            $where[] = 'h.data <= ?';
            $params[] = $_GET['data_fim'];
        }
        if (!isset($_GET['incluir_lotados']) || $_GET['incluir_lotados'] === '0') {
            $where[] = 'h.vagas_disponiveis > 0';
        }

        $sql = '
            SELECT h.id, h.vinicola_id, h.experiencia_id, h.data, h.horario,
                   h.capacidade_maxima, h.vagas_disponiveis,
                   v.nome AS vinicola_nome, e.nome AS experiencia_nome,
                   e.duracao_minutos, e.preco_por_pessoa
            FROM horarios h
            JOIN vinicolas v ON v.id = h.vinicola_id
            JOIN experiencias e ON e.id = h.experiencia_id
        ';
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY h.data, h.horario';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        foreach ($rows as &$r) {
            $r['status'] = status_vagas((int) $r['vagas_disponiveis'], (int) $r['capacidade_maxima']);
        }

        json_response($rows);
    }

    // Mutacoes: adm_supremo OU adm_vinicola na propria vinicola.

    if (method() === 'POST') {
        $body = read_json_body();
        $campos = validar_horario($body, true);

        require_vinicola_admin((int) $campos['vinicola_id']);

        // Garante que a experiencia pertence a vinicola informada.
        $check = $pdo->prepare('SELECT vinicola_id FROM experiencias WHERE id = ?');
        $check->execute([(int) $campos['experiencia_id']]);
        $exp = $check->fetch();
        if (!$exp) json_error('Experiencia nao encontrada', 404);
        if ((int) $exp['vinicola_id'] !== (int) $campos['vinicola_id']) {
            json_error('Experiencia nao pertence a vinicola informada', 422);
        }

        // Inicializa vagas_disponiveis = capacidade_maxima.
        $campos['vagas_disponiveis'] = $campos['capacidade_maxima'];

        $ins = $pdo->prepare('
            INSERT INTO horarios (vinicola_id, experiencia_id, data, horario,
                                  capacidade_maxima, vagas_disponiveis)
            VALUES (:vinicola_id, :experiencia_id, :data, :horario,
                    :capacidade_maxima, :vagas_disponiveis)
        ');
        $ins->execute($campos);

        $id = (int) $pdo->lastInsertId();
        $sel = $pdo->prepare('SELECT * FROM horarios WHERE id = ?');
        $sel->execute([$id]);
        json_response($sel->fetch(), 201);
    }

    if (method() === 'PUT') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        $body = read_json_body();
        if ($id <= 0) $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) json_error('id obrigatorio', 422);

        $sel = $pdo->prepare('SELECT * FROM horarios WHERE id = ?');
        $sel->execute([$id]);
        $h = $sel->fetch();
        if (!$h) json_error('Horario nao encontrado', 404);

        require_vinicola_admin((int) $h['vinicola_id']);

        // PUT permite atualizar capacidade, data, horario. NUNCA mexer em vagas_disponiveis manualmente
        // (gerenciado pelas reservas). Se capacidade aumentar, propaga delta para vagas.
        $campos = [];
        if (isset($body['data']))             $campos['data'] = (string) $body['data'];
        if (isset($body['horario']))          $campos['horario'] = (string) $body['horario'];
        if (isset($body['capacidade_maxima'])) {
            $novaCap = (int) $body['capacidade_maxima'];
            if ($novaCap < ($h['capacidade_maxima'] - $h['vagas_disponiveis'])) {
                json_error('Capacidade nao pode ser menor que reservas ja confirmadas', 409);
            }
            $delta = $novaCap - (int) $h['capacidade_maxima'];
            $campos['capacidade_maxima'] = $novaCap;
            $campos['vagas_disponiveis'] = (int) $h['vagas_disponiveis'] + $delta;
        }

        if (!$campos) json_error('Nenhum campo para atualizar', 422);

        $set = implode(', ', array_map(fn($k) => "$k = :$k", array_keys($campos)));
        $campos['id'] = $id;
        $upd = $pdo->prepare("UPDATE horarios SET $set WHERE id = :id");
        $upd->execute($campos);

        $sel = $pdo->prepare('SELECT * FROM horarios WHERE id = ?');
        $sel->execute([$id]);
        json_response($sel->fetch());
    }

    if (method() === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) json_error('id obrigatorio', 422);

        $sel = $pdo->prepare('SELECT vinicola_id, capacidade_maxima, vagas_disponiveis FROM horarios WHERE id = ?');
        $sel->execute([$id]);
        $h = $sel->fetch();
        if (!$h) json_error('Horario nao encontrado', 404);

        require_vinicola_admin((int) $h['vinicola_id']);

        if ((int) $h['vagas_disponiveis'] < (int) $h['capacidade_maxima']) {
            json_error('Existem reservas ativas para esse horario', 409);
        }

        $del = $pdo->prepare('DELETE FROM horarios WHERE id = ?');
        $del->execute([$id]);
        json_response(['id' => $id, 'removido' => true]);
    }
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}

function validar_horario(array $body, bool $obrigatorio): array {
    $regras = [
        'vinicola_id'       => 'int',
        'experiencia_id'    => 'int',
        'data'              => 'string',
        'horario'           => 'string',
        'capacidade_maxima' => 'int',
    ];
    $exigidos = $obrigatorio ? array_keys($regras) : [];

    $out = [];
    foreach ($regras as $campo => $tipo) {
        if (!array_key_exists($campo, $body)) continue;
        $valor = $body[$campo];
        if ($valor === null || $valor === '') continue;
        $out[$campo] = $tipo === 'int' ? (int) $valor : (string) $valor;
    }
    foreach ($exigidos as $campo) {
        if (!isset($out[$campo])) json_error("Campo $campo obrigatorio", 422);
    }
    return $out;
}
