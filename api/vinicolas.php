<?php
require __DIR__ . '/config/db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = getDb();

    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT * FROM vinicolas WHERE id = ?');
        $stmt->execute([(int) $_GET['id']]);
        $vinicola = $stmt->fetch();

        if (!$vinicola) {
            http_response_code(404);
            echo json_encode(['erro' => 'Vinicola nao encontrada']);
            exit;
        }

        $stmt = $pdo->prepare('SELECT * FROM experiencias WHERE vinicola_id = ? ORDER BY nome');
        $stmt->execute([(int) $vinicola['id']]);
        $vinicola['experiencias'] = $stmt->fetchAll();

        echo json_encode($vinicola);
        exit;
    }

    $stmt = $pdo->query('SELECT id, nome, cidade, descricao, foto_url, duracao_media_min, preco_min, preco_max FROM vinicolas ORDER BY nome');
    echo json_encode($stmt->fetchAll());
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['erro' => $e->getMessage()]);
}
