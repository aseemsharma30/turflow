<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJson(['error' => 'Method not allowed'], 405);
}

startSession();
$user = $_SESSION['turflow_user'] ?? null;

sendJson([
    'authenticated' => !empty($user),
    'user' => $user
]);
