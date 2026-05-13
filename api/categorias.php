<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';

require_method('GET');

try {
    $stmt = getDb()->query('SELECT id, nome FROM categorias_experiencia ORDER BY nome');
    json_response($stmt->fetchAll());
} catch (Throwable $e) {
    json_error($e->getMessage(), 500);
}
