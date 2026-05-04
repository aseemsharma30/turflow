<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

$input = getJsonInput();
$phone = trim($input['phone'] ?? '');
$password = $input['password'] ?? '';

if ($phone === '' || $password === '') {
    sendJson(['error' => 'Phone and password are required'], 400);
}

try {
    $db = getDb();

    $stmt = $db->prepare('SELECT id, first_name, last_name, email, customer_phone, password_hash FROM users WHERE customer_phone = ? LIMIT 1');
    $stmt->execute([$phone]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendJson(['error' => 'Invalid phone or password'], 401);
    }

    startSession();
    $_SESSION['turflow_user'] = [
        'id' => $user['id'],
        'firstName' => $user['first_name'],
        'lastName' => $user['last_name'],
        'email' => $user['email'],
        'phone' => $user['customer_phone']
    ];

    sendJson([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'email' => $user['email'],
            'phone' => $user['customer_phone']
        ]
    ]);
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
