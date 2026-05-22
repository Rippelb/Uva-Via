<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../config/helpers.php';
require __DIR__ . '/../config/auth.php';

require_method('POST');
auth_start_session();

try {
    $body = read_json_body();
    $email = trim((string) ($body['email'] ?? ''));
    $senha = (string) ($body['senha'] ?? '');

    if ($email === '' || $senha === '') {
        json_error('email e senha sao obrigatorios', 422);
    }

    $stmt = getDb()->prepare('SELECT id, senha_hash, role, must_change_password FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    $u = $stmt->fetch();

    if (!$u || !$u['senha_hash'] || !password_verify($senha, $u['senha_hash'])) {
        // Mesma mensagem para email inexistente OU senha errada: evita user enumeration.
        json_error('Credenciais invalidas', 401);
    }

    login_user((int) $u['id']);

    json_response([
        'user' => current_user(),
        'csrf' => csrf_token(),
    ]);
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
