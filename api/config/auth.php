<?php
// Autenticacao via sessao PHP + CSRF token por cabecalho X-CSRF-Token.
// Inclua antes de declarar require_method() ou enviar saida.

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

function auth_start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;

    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        'secure'   => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_name('UVAVIA_SID');
    session_start();

    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
}

function current_user(): ?array {
    auth_start_session();
    if (empty($_SESSION['user_id'])) return null;

    static $cache = null;
    if ($cache && $cache['id'] === $_SESSION['user_id']) return $cache;

    $stmt = getDb()->prepare('
        SELECT id, nome_completo, email, telefone, role, vinicola_id, must_change_password, ultimo_login
        FROM usuarios WHERE id = ?
    ');
    $stmt->execute([(int) $_SESSION['user_id']]);
    $u = $stmt->fetch();
    if (!$u) {
        session_unset();
        session_destroy();
        return null;
    }
    $u['id'] = (int) $u['id'];
    $u['vinicola_id'] = $u['vinicola_id'] !== null ? (int) $u['vinicola_id'] : null;
    $u['must_change_password'] = (int) $u['must_change_password'] === 1;
    $cache = $u;
    return $u;
}

function require_login(): array {
    $u = current_user();
    if (!$u) json_error('Autenticacao requerida', 401);
    if ($u['must_change_password'] && !defined('AUTH_ALLOW_PASSWORD_CHANGE')) {
        json_error('Troca de senha obrigatoria antes de continuar', 403, ['must_change_password' => true]);
    }
    return $u;
}

function require_role(string ...$roles): array {
    $u = require_login();
    if (!in_array($u['role'], $roles, true)) {
        json_error('Acesso negado para o seu papel', 403, ['role' => $u['role']]);
    }
    return $u;
}

// adm_supremo pode tudo; adm_vinicola so na propria vinicola.
function require_vinicola_admin(int $vinicolaId): array {
    $u = require_role('adm_supremo', 'adm_vinicola');
    if ($u['role'] === 'adm_vinicola' && (int) $u['vinicola_id'] !== $vinicolaId) {
        json_error('Voce so pode gerenciar a propria vinicola', 403);
    }
    return $u;
}

// CSRF: exija em qualquer requisicao que mute estado.
function require_csrf(): void {
    auth_start_session();
    if (in_array(method(), ['GET', 'HEAD', 'OPTIONS'], true)) return;
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$token || !hash_equals($_SESSION['csrf'] ?? '', $token)) {
        json_error('CSRF token invalido ou ausente', 419);
    }
}

function csrf_token(): string {
    auth_start_session();
    return $_SESSION['csrf'] ?? '';
}

function login_user(int $userId): void {
    auth_start_session();
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;
    $_SESSION['csrf'] = bin2hex(random_bytes(32));

    $stmt = getDb()->prepare('UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?');
    $stmt->execute([$userId]);
}

function logout_user(): void {
    auth_start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}
