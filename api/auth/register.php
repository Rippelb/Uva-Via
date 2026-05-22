<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../config/helpers.php';
require __DIR__ . '/../config/auth.php';

require_method('POST');
auth_start_session();

try {
    $body = read_json_body();
    $nome = trim((string) ($body['nome_completo'] ?? $body['nome'] ?? ''));
    $email = trim((string) ($body['email'] ?? ''));
    $senha = (string) ($body['senha'] ?? '');
    $telefone = trim((string) ($body['telefone'] ?? '')) ?: null;

    if ($nome === '' || $email === '' || $senha === '') {
        json_error('nome_completo, email e senha sao obrigatorios', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_error('email invalido', 422);
    }
    if (strlen($senha) < 8) {
        json_error('senha deve ter ao menos 8 caracteres', 422);
    }

    $pdo = getDb();
    $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        json_error('Email ja cadastrado', 409);
    }

    // Auto-registro publico cria sempre role=usuario. Promocao p/ adm_vinicola
    // ou adm_supremo so via endpoint /api/usuarios.php (adm_supremo).
    $hash = password_hash($senha, PASSWORD_BCRYPT);
    $ins = $pdo->prepare('
        INSERT INTO usuarios (nome_completo, email, telefone, senha_hash, role, must_change_password)
        VALUES (?, ?, ?, ?, ?, 0)
    ');
    $ins->execute([$nome, $email, $telefone, $hash, 'usuario']);
    $userId = (int) $pdo->lastInsertId();

    login_user($userId);

    json_response([
        'user' => current_user(),
        'csrf' => csrf_token(),
    ], 201);
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
