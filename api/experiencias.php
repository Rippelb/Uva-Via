<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';

require_method('GET');

try {
    $pdo = getDb();

    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare('
            SELECT e.*, c.nome AS categoria, v.nome AS vinicola_nome, v.cidade
            FROM experiencias e
            JOIN categorias_experiencia c ON c.id = e.categoria_id
            JOIN vinicolas v ON v.id = e.vinicola_id
            WHERE e.id = ?
        ');
        $stmt->execute([(int) $_GET['id']]);
        $exp = $stmt->fetch();
        if (!$exp) json_error('Experiencia nao encontrada', 404);

        $tagsStmt = $pdo->prepare('
            SELECT t.id, t.nome
            FROM experiencias_tags et
            JOIN tags_interesse t ON t.id = et.tag_id
            WHERE et.experiencia_id = ?
            ORDER BY t.nome
        ');
        $tagsStmt->execute([(int) $exp['id']]);
        $exp['tags'] = $tagsStmt->fetchAll();
        json_response($exp);
    }

    $where = [];
    $params = [];

    if (isset($_GET['vinicola_id'])) {
        $where[] = 'e.vinicola_id = ?';
        $params[] = (int) $_GET['vinicola_id'];
    }

    if (isset($_GET['categoria_id'])) {
        $where[] = 'e.categoria_id = ?';
        $params[] = (int) $_GET['categoria_id'];
    }

    if (isset($_GET['preco_max'])) {
        $where[] = 'e.preco_por_pessoa <= ?';
        $params[] = (float) $_GET['preco_max'];
    }

    // tags=2,3,9 -> experiencias com PELO MENOS uma das tags
    if (isset($_GET['tags']) && $_GET['tags'] !== '') {
        $ids = array_filter(array_map('intval', explode(',', $_GET['tags'])));
        if ($ids) {
            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            $where[] = "e.id IN (SELECT experiencia_id FROM experiencias_tags WHERE tag_id IN ($placeholders))";
            $params = array_merge($params, $ids);
        }
    }

    if (isset($_GET['busca']) && $_GET['busca'] !== '') {
        $where[] = '(e.nome LIKE ? OR v.nome LIKE ?)';
        $like = '%' . $_GET['busca'] . '%';
        $params[] = $like;
        $params[] = $like;
    }

    $sql = '
        SELECT e.id, e.vinicola_id, e.categoria_id, e.nome, e.descricao,
               e.duracao_minutos, e.preco_por_pessoa,
               c.nome AS categoria, v.nome AS vinicola_nome, v.cidade
        FROM experiencias e
        JOIN categorias_experiencia c ON c.id = e.categoria_id
        JOIN vinicolas v ON v.id = e.vinicola_id
    ';
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY v.nome, e.nome';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    if ($rows) {
        $expIds = array_column($rows, 'id');
        $placeholders = implode(',', array_fill(0, count($expIds), '?'));
        $tagsStmt = $pdo->prepare("
            SELECT et.experiencia_id, t.id, t.nome
            FROM experiencias_tags et
            JOIN tags_interesse t ON t.id = et.tag_id
            WHERE et.experiencia_id IN ($placeholders)
            ORDER BY t.nome
        ");
        $tagsStmt->execute($expIds);

        $byExp = [];
        foreach ($tagsStmt->fetchAll() as $t) {
            $byExp[(int) $t['experiencia_id']][] = ['id' => (int) $t['id'], 'nome' => $t['nome']];
        }
        foreach ($rows as &$r) {
            $r['tags'] = $byExp[(int) $r['id']] ?? [];
        }
    }

    json_response($rows);
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
