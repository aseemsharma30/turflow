<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

$input = getJsonInput();
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if ($username === '' || $password === '') {
    sendJson(['error' => 'Username and password are required'], 400);
}

$stmt = getDb()->prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    sendJson(['error' => 'Invalid admin username or password'], 401);
}

session_start();
$_SESSION['turflow_admin'] = [
    'id' => $admin['id'],
    'username' => $admin['username']
];

sendJson([
    'success' => true,
    'username' => $admin['username']
]);
