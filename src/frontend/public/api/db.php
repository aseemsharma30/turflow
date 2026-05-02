<?php
require_once __DIR__ . '/config.php';

function getDb() {
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function sendJson($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function getJsonInput() {
    $input = json_decode(file_get_contents('php://input'), true);
    return is_array($input) ? $input : [];
}

function requireAdmin() {
    session_start();
    if (empty($_SESSION['turflow_admin'])) {
        sendJson(['error' => 'Unauthorized'], 401);
    }
}
