<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../config/helpers.php';
require __DIR__ . '/../config/auth.php';

require_method('POST');
auth_start_session();

try {
    $body = read_json_body();
    $email = trim((string) ($body['email'] ?? ''));
    if ($email === '') json_error('email obrigatorio', 422);

    $pdo = getDb();
    $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    $u = $stmt->fetch();

    // Resposta neutra quando email nao existe (evita enumeration). Em dev
    // local retornamos token=null pra UI nao fingir sucesso.
    if (!$u) {
        json_response([
            'ok' => true,
            'mensagem' => 'Se o email existir, um token de recuperacao foi gerado.',
            'token' => null,
        ]);
    }

    // Invalida tokens pendentes anteriores deste usuario.
    $pdo->prepare('UPDATE password_resets SET usado_em = NOW() WHERE usuario_id = ? AND usado_em IS NULL')
        ->execute([(int) $u['id']]);

    // Token raw vai pro usuario; salvamos so o SHA-256 no banco.
    $token = bin2hex(random_bytes(32));
    $tokenHash = hash('sha256', $token);

    $ins = $pdo->prepare('
        INSERT INTO password_resets (usuario_id, token_hash, expira_em)
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))
    ');
    $ins->execute([(int) $u['id'], $tokenHash]);

    // Em producao real, o token sairia por email. Em dev local devolvemos
    // direto na resposta com aviso explicito.
    json_response([
        'ok' => true,
        'mensagem' => 'Token de recuperacao gerado. Em producao seria enviado por email.',
        'token' => $token,
        'expira_em' => date('Y-m-d H:i:s', time() + 3600),
        'ttl_minutos' => 60,
    ]);
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
