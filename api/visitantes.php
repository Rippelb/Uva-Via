<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';

require_method('GET', 'POST');

try {
    $pdo = getDb();

    if (method() === 'GET') {
        if (!isset($_GET['email'])) json_error('email obrigatorio', 400);
        $stmt = $pdo->prepare('SELECT id, nome_completo, email, telefone FROM visitantes WHERE email = ?');
        $stmt->execute([trim($_GET['email'])]);
        $v = $stmt->fetch();
        if (!$v) json_error('Visitante nao encontrado', 404);
        json_response($v);
    }

    $body = read_json_body();
    $nome = trim((string) ($body['nome_completo'] ?? $body['nome'] ?? ''));
    $email = trim((string) ($body['email'] ?? ''));
    $tel = trim((string) ($body['telefone'] ?? ''));

    if ($nome === '' || $email === '') {
        json_error('nome_completo e email sao obrigatorios', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_error('email invalido', 422);
    }

    $stmt = $pdo->prepare('SELECT id FROM visitantes WHERE email = ?');
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        $stmt = $pdo->prepare('UPDATE visitantes SET nome_completo = ?, telefone = ? WHERE id = ?');
        $stmt->execute([$nome, $tel ?: null, (int) $existing['id']]);
        $id = (int) $existing['id'];
        $status = 200;
    } else {
        $stmt = $pdo->prepare('INSERT INTO visitantes (nome_completo, email, telefone) VALUES (?, ?, ?)');
        $stmt->execute([$nome, $email, $tel ?: null]);
        $id = (int) $pdo->lastInsertId();
        $status = 201;
    }

    json_response([
        'id' => $id,
        'nome_completo' => $nome,
        'email' => $email,
        'telefone' => $tel ?: null,
    ], $status);
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
