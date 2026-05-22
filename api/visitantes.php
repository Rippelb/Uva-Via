<?php
// Endpoint legado. A tabela visitantes foi renomeada para usuarios e este endpoint
// foi substituido por /api/usuarios.php. Mantido apenas para sinalizar a migracao.
require __DIR__ . '/config/helpers.php';
json_error('Endpoint movido para /api/usuarios.php', 410, ['ver' => '/api/usuarios.php']);
