<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';
require __DIR__ . '/config/auth.php';

require_method('GET', 'POST', 'PUT', 'DELETE');
require_csrf();

try {
    $pdo = getDb();
    $me = require_login();

    if (method() === 'GET') {
        if (isset($_GET['id'])) {
            $id = (int) $_GET['id'];
            // Adm supremo ve qualquer um; outros so o proprio.
            if ($me['role'] !== 'adm_supremo' && $id !== (int) $me['id']) {
                json_error('Sem permissao', 403);
            }
            $stmt = $pdo->prepare('
                SELECT id, nome_completo, email, telefone, role, vinicola_id, ultimo_login, criado_em
                FROM usuarios WHERE id = ?
            ');
            $stmt->execute([$id]);
            $u = $stmt->fetch();
            if (!$u) json_error('Usuario nao encontrado', 404);
            json_response($u);
        }

        // Lista: somente adm_supremo.
        require_role('adm_supremo');

        $where = [];
        $params = [];
        if (isset($_GET['role'])) {
            $where[] = 'role = ?';
            $params[] = $_GET['role'];
        }
        if (isset($_GET['vinicola_id'])) {
            $where[] = 'vinicola_id = ?';
            $params[] = (int) $_GET['vinicola_id'];
        }

        $sql = 'SELECT id, nome_completo, email, telefone, role, vinicola_id, ultimo_login, criado_em FROM usuarios';
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY nome_completo';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        json_response($stmt->fetchAll());
    }

    if (method() === 'POST') {
        // Criacao com papel definido: adm_supremo apenas. Auto-registro usa /api/auth/register.php.
        require_role('adm_supremo');
        $body = read_json_body();

        $nome = trim((string) ($body['nome_completo'] ?? ''));
        $email = trim((string) ($body['email'] ?? ''));
        $senha = (string) ($body['senha'] ?? '');
        $role = (string) ($body['role'] ?? 'usuario');
        $vinicolaId = isset($body['vinicola_id']) ? (int) $body['vinicola_id'] : null;
        $telefone = trim((string) ($body['telefone'] ?? '')) ?: null;

        if ($nome === '' || $email === '' || $senha === '') {
            json_error('nome_completo, email e senha sao obrigatorios', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('email invalido', 422);
        if (strlen($senha) < 8) json_error('senha deve ter ao menos 8 caracteres', 422);
        if (!in_array($role, ['adm_supremo', 'adm_vinicola', 'usuario'], true)) {
            json_error('role invalido', 422);
        }
        if ($role === 'adm_vinicola' && !$vinicolaId) {
            json_error('adm_vinicola exige vinicola_id', 422);
        }
        if ($role !== 'adm_vinicola') $vinicolaId = null;

        $ex = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
        $ex->execute([$email]);
        if ($ex->fetch()) json_error('Email ja cadastrado', 409);

        $hash = password_hash($senha, PASSWORD_BCRYPT);
        $ins = $pdo->prepare('
            INSERT INTO usuarios (nome_completo, email, telefone, senha_hash, role, vinicola_id, must_change_password)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        ');
        $ins->execute([$nome, $email, $telefone, $hash, $role, $vinicolaId]);
        $id = (int) $pdo->lastInsertId();

        $sel = $pdo->prepare('SELECT id, nome_completo, email, telefone, role, vinicola_id, must_change_password FROM usuarios WHERE id = ?');
        $sel->execute([$id]);
        json_response($sel->fetch(), 201);
    }

    if (method() === 'PUT') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        $body = read_json_body();
        if ($id <= 0) $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) json_error('id obrigatorio', 422);

        // Adm supremo edita qualquer um (inclusive role/vinicola_id).
        // Demais: somente o proprio nome/telefone.
        $isAdm = $me['role'] === 'adm_supremo';
        if (!$isAdm && $id !== (int) $me['id']) json_error('Sem permissao', 403);

        $sel = $pdo->prepare('SELECT * FROM usuarios WHERE id = ?');
        $sel->execute([$id]);
        $alvo = $sel->fetch();
        if (!$alvo) json_error('Usuario nao encontrado', 404);

        $campos = [];
        if (isset($body['nome_completo'])) $campos['nome_completo'] = trim((string) $body['nome_completo']);
        if (isset($body['telefone']))      $campos['telefone'] = trim((string) $body['telefone']) ?: null;

        if ($isAdm) {
            if (isset($body['role'])) {
                $role = (string) $body['role'];
                if (!in_array($role, ['adm_supremo', 'adm_vinicola', 'usuario'], true)) {
                    json_error('role invalido', 422);
                }
                $campos['role'] = $role;
                if ($role !== 'adm_vinicola') {
                    $campos['vinicola_id'] = null;
                }
            }
            if (array_key_exists('vinicola_id', $body)) {
                $vid = $body['vinicola_id'];
                $campos['vinicola_id'] = $vid === null || $vid === '' ? null : (int) $vid;
            }
            // Coerencia: se role final for adm_vinicola, exige vinicola_id.
            $roleFinal = $campos['role'] ?? $alvo['role'];
            $vinFinal = array_key_exists('vinicola_id', $campos) ? $campos['vinicola_id'] : $alvo['vinicola_id'];
            if ($roleFinal === 'adm_vinicola' && !$vinFinal) {
                json_error('adm_vinicola exige vinicola_id', 422);
            }
        }

        if (!$campos) json_error('Nenhum campo para atualizar', 422);

        $set = implode(', ', array_map(fn($k) => "$k = :$k", array_keys($campos)));
        $campos['id'] = $id;
        $upd = $pdo->prepare("UPDATE usuarios SET $set WHERE id = :id");
        $upd->execute($campos);

        $sel = $pdo->prepare('SELECT id, nome_completo, email, telefone, role, vinicola_id FROM usuarios WHERE id = ?');
        $sel->execute([$id]);
        json_response($sel->fetch());
    }

    if (method() === 'DELETE') {
        require_role('adm_supremo');
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) json_error('id obrigatorio', 422);
        if ($id === (int) $me['id']) json_error('Voce nao pode excluir a si mesmo', 409);

        // Bloqueia delete se tiver reservas/roteiros vinculados (preserva integridade).
        $dep = $pdo->prepare('SELECT COUNT(*) FROM reservas WHERE usuario_id = ?');
        $dep->execute([$id]);
        if ((int) $dep->fetchColumn() > 0) {
            json_error('Usuario possui reservas; desative manualmente o role em vez de excluir', 409);
        }

        $del = $pdo->prepare('DELETE FROM usuarios WHERE id = ?');
        $del->execute([$id]);
        if ($del->rowCount() === 0) json_error('Usuario nao encontrado', 404);
        json_response(['id' => $id, 'removido' => true]);
    }
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
