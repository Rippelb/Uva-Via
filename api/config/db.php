<?php
// Conexao PDO com MySQL/MariaDB do XAMPP.
// Defaults do XAMPP: host 127.0.0.1, porta 3306, usuario root, senha vazia.

function getDb(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $host = '127.0.0.1';
    $port = 3306;
    $db   = 'uva&via';
    $user = 'root';
    $pass = '';

    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    return $pdo;
}
