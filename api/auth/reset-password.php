<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../config/helpers.php';
require __DIR__ . '/../config/auth.php';

require_method('POST');
auth_start_session();

try {
    $body = read_json_body();
    $token = trim((string) ($body['token'] ?? ''));
    $novaSenha = (string) ($body['senha_nova'] ?? '');

    if ($token === '' || $novaSenha === '') {
        json_error('token e senha_nova sao obrigatorios', 422);
    }
    if (strlen($novaSenha) < 8) {
        json_error('senha_nova deve ter ao menos 8 caracteres', 422);
    }

    $tokenHash = hash('sha256', $token);
    $pdo = getDb();
    $pdo->beginTransaction();

    $stmt = $pdo->prepare('
        SELECT id, usuario_id
        FROM password_resets
        WHERE token_hash = ? AND usado_em IS NULL AND expira_em > NOW()
        FOR UPDATE
    ');
    $stmt->execute([$tokenHash]);
    $r = $stmt->fetch();
    if (!$r) {
        $pdo->rollBack();
        json_error('Token invalido ou expirado', 401);
    }

    // Troca senha + limpa flag de "trocar no proximo login" + marca token como usado.
    $hash = password_hash($novaSenha, PASSWORD_BCRYPT);
    $pdo->prepare('UPDATE usuarios SET senha_hash = ?, must_change_password = 0 WHERE id = ?')
        ->execute([$hash, (int) $r['usuario_id']]);
    $pdo->prepare('UPDATE password_resets SET usado_em = NOW() WHERE id = ?')
        ->execute([(int) $r['id']]);

    // Por seguranca, invalida QUALQUER outro token pendente desse usuario tambem.
    $pdo->prepare('UPDATE password_resets SET usado_em = NOW()
                   WHERE usuario_id = ? AND usado_em IS NULL')
        ->execute([(int) $r['usuario_id']]);

    $pdo->commit();
    json_response(['ok' => true, 'mensagem' => 'Senha redefinida com sucesso.']);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    json_error($e->getMessage(), 500);
}
