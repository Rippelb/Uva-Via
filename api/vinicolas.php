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
            $stmt = $pdo->prepare('SELECT * FROM vinicolas WHERE id = ?');
            $stmt->execute([(int) $_GET['id']]);
            $vinicola = $stmt->fetch();
            if (!$vinicola) json_error('Vinicola nao encontrada', 404);

            $stmt = $pdo->prepare('SELECT * FROM experiencias WHERE vinicola_id = ? ORDER BY nome');
            $stmt->execute([(int) $vinicola['id']]);
            $vinicola['experiencias'] = $stmt->fetchAll();
            json_response($vinicola);
        }

        $stmt = $pdo->query('SELECT id, nome, cidade, descricao, foto_url, duracao_media_min, preco_min, preco_max FROM vinicolas ORDER BY nome');
        json_response($stmt->fetchAll());
    }

    // Apenas adm_supremo gerencia vinicolas.
    require_role('adm_supremo');

    if (method() === 'POST') {
        $body = read_json_body();
        $campos = validar_vinicola($body, true);

        $ins = $pdo->prepare('
            INSERT INTO vinicolas (nome, descricao, foto_url, latitude, longitude, cidade,
                                   duracao_media_min, preco_min, preco_max)
            VALUES (:nome, :descricao, :foto_url, :latitude, :longitude, :cidade,
                    :duracao_media_min, :preco_min, :preco_max)
        ');
        $ins->execute($campos);

        $id = (int) $pdo->lastInsertId();
        $sel = $pdo->prepare('SELECT * FROM vinicolas WHERE id = ?');
        $sel->execute([$id]);
        json_response($sel->fetch(), 201);
    }

    if (method() === 'PUT') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) {
            $body = read_json_body();
            $id = (int) ($body['id'] ?? 0);
        } else {
            $body = read_json_body();
        }
        if ($id <= 0) json_error('id obrigatorio', 422);

        $campos = validar_vinicola($body, false);
        if (!$campos) json_error('Nenhum campo para atualizar', 422);

        $set = implode(', ', array_map(fn($k) => "$k = :$k", array_keys($campos)));
        $campos['id'] = $id;
        $upd = $pdo->prepare("UPDATE vinicolas SET $set WHERE id = :id");
        $upd->execute($campos);

        $sel = $pdo->prepare('SELECT * FROM vinicolas WHERE id = ?');
        $sel->execute([$id]);
        $v = $sel->fetch();
        if (!$v) json_error('Vinicola nao encontrada', 404);
        json_response($v);
    }

    if (method() === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) json_error('id obrigatorio', 422);

        // Conta dependencias para erro amigavel.
        $dep = $pdo->prepare('SELECT COUNT(*) FROM experiencias WHERE vinicola_id = ?');
        $dep->execute([$id]);
        if ((int) $dep->fetchColumn() > 0) {
            json_error('Remova as experiencias da vinicola antes de excluir', 409);
        }

        $del = $pdo->prepare('DELETE FROM vinicolas WHERE id = ?');
        $del->execute([$id]);
        if ($del->rowCount() === 0) json_error('Vinicola nao encontrada', 404);
        json_response(['id' => $id, 'removida' => true]);
    }
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}

function validar_vinicola(array $body, bool $obrigatorio): array {
    $regras = [
        'nome'              => ['string',  160],
        'descricao'         => ['string',  null],
        'foto_url'          => ['string',  255],
        'cidade'            => ['string',  80],
        'latitude'          => ['float',   null],
        'longitude'         => ['float',   null],
        'duracao_media_min' => ['int',     null],
        'preco_min'         => ['float',   null],
        'preco_max'         => ['float',   null],
    ];
    $exigidos = $obrigatorio
        ? ['nome', 'latitude', 'longitude', 'duracao_media_min', 'preco_min', 'preco_max']
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
