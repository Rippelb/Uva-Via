<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../config/helpers.php';
require __DIR__ . '/../config/auth.php';

require_method('GET');
auth_start_session();

$u = current_user();
if (!$u) {
    json_response(['user' => null, 'csrf' => csrf_token()]);
}

json_response([
    'user' => $u,
    'csrf' => csrf_token(),
]);
