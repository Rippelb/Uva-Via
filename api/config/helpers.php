<?php
// Utilitarios comuns aos endpoints da API.

function json_response($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $mensagem, int $status = 400, array $extra = []): void {
    json_response(array_merge(['erro' => $mensagem], $extra), $status);
}

function read_json_body(): array {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('JSON invalido no corpo da requisicao', 400);
    }
    return $data;
}

function method(): string {
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

function require_method(string ...$allowed): void {
    if (!in_array(method(), $allowed, true)) {
        header('Allow: ' . implode(', ', $allowed));
        json_error('Metodo nao permitido', 405);
    }
}

function int_param(string $key, ?int $default = null): ?int {
    if (!isset($_GET[$key]) || $_GET[$key] === '') return $default;
    return (int) $_GET[$key];
}

function str_param(string $key, ?string $default = null): ?string {
    if (!isset($_GET[$key]) || $_GET[$key] === '') return $default;
    return (string) $_GET[$key];
}

// Status de disponibilidade conforme item 13 (verde/amarelo/vermelho).
function status_vagas(int $vagas, int $capacidade): string {
    if ($vagas <= 0) return 'lotado';
    $pct = $vagas / max(1, $capacidade);
    if ($pct <= 0.25) return 'quase_cheio';
    return 'disponivel';
}
