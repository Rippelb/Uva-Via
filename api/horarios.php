<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';

require_method('GET');

try {
    $pdo = getDb();

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
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
