<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';

require_method('GET');

try {
    $stmt = getDb()->query('SELECT id, nome FROM perfis_viagem ORDER BY id');
    json_response($stmt->fetchAll());
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
