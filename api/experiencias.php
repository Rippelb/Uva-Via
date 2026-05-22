<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';
require __DIR__ . '/config/auth.php';

require_method('GET', 'POST', 'PUT', 'DELETE');
require_csrf();

try {
    $pdo = getDb();

    if (method() === 'GET') {
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
    }

    // Para POST/PUT/DELETE: adm_supremo OU adm_vinicola na propria vinicola.

    if (method() === 'POST') {
        $body = read_json_body();
        $campos = validar_experiencia($body, true);

        require_vinicola_admin((int) $campos['vinicola_id']);

        $pdo->beginTransaction();

        $ins = $pdo->prepare('
            INSERT INTO experiencias (vinicola_id, categoria_id, nome, descricao,
                                      duracao_minutos, preco_por_pessoa)
            VALUES (:vinicola_id, :categoria_id, :nome, :descricao,
                    :duracao_minutos, :preco_por_pessoa)
        ');
        $ins->execute($campos);
        $id = (int) $pdo->lastInsertId();

        $tagIds = $body['tag_ids'] ?? null;
        if (is_array($tagIds)) sync_tags($pdo, $id, $tagIds);

        $pdo->commit();
        json_response(carregar_experiencia($pdo, $id), 201);
    }

    if (method() === 'PUT') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        $body = read_json_body();
        if ($id <= 0) $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) json_error('id obrigatorio', 422);

        $existing = $pdo->prepare('SELECT vinicola_id FROM experiencias WHERE id = ?');
        $existing->execute([$id]);
        $exp = $existing->fetch();
        if (!$exp) json_error('Experiencia nao encontrada', 404);

        require_vinicola_admin((int) $exp['vinicola_id']);

        $campos = validar_experiencia($body, false);
        // Se o adm_vinicola tentar mover a experiencia para outra vinicola, bloqueia.
        if (isset($campos['vinicola_id'])) {
            require_vinicola_admin((int) $campos['vinicola_id']);
        }

        $pdo->beginTransaction();

        if ($campos) {
            $set = implode(', ', array_map(fn($k) => "$k = :$k", array_keys($campos)));
            $campos['id'] = $id;
            $upd = $pdo->prepare("UPDATE experiencias SET $set WHERE id = :id");
            $upd->execute($campos);
        }

        if (array_key_exists('tag_ids', $body) && is_array($body['tag_ids'])) {
            sync_tags($pdo, $id, $body['tag_ids']);
        }

        $pdo->commit();
        json_response(carregar_experiencia($pdo, $id));
    }

    if (method() === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) json_error('id obrigatorio', 422);

        $existing = $pdo->prepare('SELECT vinicola_id FROM experiencias WHERE id = ?');
        $existing->execute([$id]);
        $exp = $existing->fetch();
        if (!$exp) json_error('Experiencia nao encontrada', 404);

        require_vinicola_admin((int) $exp['vinicola_id']);

        // Bloqueia delete se houver horarios futuros com vagas reservadas.
        $dep = $pdo->prepare('
            SELECT COUNT(*) FROM horarios
            WHERE experiencia_id = ? AND vagas_disponiveis < capacidade_maxima
        ');
        $dep->execute([$id]);
        if ((int) $dep->fetchColumn() > 0) {
            json_error('Existem reservas ativas vinculadas a essa experiencia', 409);
        }

        $pdo->beginTransaction();
        $pdo->prepare('DELETE FROM experiencias_tags WHERE experiencia_id = ?')->execute([$id]);
        $pdo->prepare('DELETE FROM horarios WHERE experiencia_id = ?')->execute([$id]);
        $del = $pdo->prepare('DELETE FROM experiencias WHERE id = ?');
        $del->execute([$id]);
        $pdo->commit();

        json_response(['id' => $id, 'removida' => true]);
    }
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    json_error($e->getMessage(), 500);
}

function carregar_experiencia(PDO $pdo, int $id): array {
    $stmt = $pdo->prepare('
        SELECT e.*, c.nome AS categoria, v.nome AS vinicola_nome, v.cidade
        FROM experiencias e
        JOIN categorias_experiencia c ON c.id = e.categoria_id
        JOIN vinicolas v ON v.id = e.vinicola_id
        WHERE e.id = ?
    ');
    $stmt->execute([$id]);
    $exp = $stmt->fetch() ?: [];
    if ($exp) {
        $tagsStmt = $pdo->prepare('
            SELECT t.id, t.nome
            FROM experiencias_tags et
            JOIN tags_interesse t ON t.id = et.tag_id
            WHERE et.experiencia_id = ? ORDER BY t.nome
        ');
        $tagsStmt->execute([$id]);
        $exp['tags'] = $tagsStmt->fetchAll();
    }
    return $exp;
}

function sync_tags(PDO $pdo, int $expId, array $tagIds): void {
    $tagIds = array_values(array_unique(array_filter(array_map('intval', $tagIds))));
    $pdo->prepare('DELETE FROM experiencias_tags WHERE experiencia_id = ?')->execute([$expId]);
    if (!$tagIds) return;
    $ins = $pdo->prepare('INSERT INTO experiencias_tags (experiencia_id, tag_id) VALUES (?, ?)');
    foreach ($tagIds as $tid) $ins->execute([$expId, $tid]);
}

function validar_experiencia(array $body, bool $obrigatorio): array {
    $regras = [
        'vinicola_id'       => ['int',    null],
        'categoria_id'      => ['int',    null],
        'nome'              => ['string', 160],
        'descricao'         => ['string', null],
        'duracao_minutos'   => ['int',    null],
        'preco_por_pessoa'  => ['float',  null],
    ];
    $exigidos = $obrigatorio
        ? ['vinicola_id', 'categoria_id', 'nome', 'duracao_minutos', 'preco_por_pessoa']
        : [];

    $out = [];
    foreach ($regras as $campo => [$tipo, $max]) {
        if (!array_key_exists($campo, $body)) continue;
        $valor = $body[$campo];
        if ($valor === null || $valor === '') {
            $out[$campo] = null;
            continue;
        }
        $out[$campo] = match ($tipo) {
            'int' => (int) $valor,
            'float' => (float) $valor,
            default => (string) $valor,
        };
        if ($tipo === 'string' && $max && mb_strlen($out[$campo]) > $max) {
            json_error("Campo $campo excede $max caracteres", 422);
        }
    }
    foreach ($exigidos as $campo) {
        if (!isset($out[$campo]) || $out[$campo] === null || $out[$campo] === '') {
            json_error("Campo $campo obrigatorio", 422);
        }
    }
    return $out;
}
