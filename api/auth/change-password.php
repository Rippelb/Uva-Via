<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../config/helpers.php';

// AUTH_ALLOW_PASSWORD_CHANGE permite que usuarios com must_change_password=1
// passem por require_login(). Sem isso, eles ficariam travados num loop.
define('AUTH_ALLOW_PASSWORD_CHANGE', true);

require __DIR__ . '/../config/auth.php';

require_method('POST');
require_csrf();

try {
    $u = require_login();
    $body = read_json_body();
    $atual = (string) ($body['senha_atual'] ?? '');
    $nova = (string) ($body['senha_nova'] ?? '');

    if ($atual === '' || $nova === '') {
        json_error('senha_atual e senha_nova sao obrigatorios', 422);
    }
    if (strlen($nova) < 8) {
        json_error('senha_nova deve ter ao menos 8 caracteres', 422);
    }
    if ($atual === $nova) {
        json_error('senha_nova deve ser diferente da atual', 422);
    }

    $pdo = getDb();
    $stmt = $pdo->prepare('SELECT senha_hash FROM usuarios WHERE id = ?');
    $stmt->execute([(int) $u['id']]);
    $row = $stmt->fetch();
    if (!$row || !password_verify($atual, $row['senha_hash'])) {
        json_error('senha_atual incorreta', 401);
    }

    $novoHash = password_hash($nova, PASSWORD_BCRYPT);
    $upd = $pdo->prepare('UPDATE usuarios SET senha_hash = ?, must_change_password = 0 WHERE id = ?');
    $upd->execute([$novoHash, (int) $u['id']]);

    json_response(['ok' => true]);
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
