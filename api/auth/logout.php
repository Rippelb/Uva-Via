<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../config/helpers.php';
require __DIR__ . '/../config/auth.php';

require_method('POST');
require_csrf();

logout_user();
json_response(['ok' => true]);
