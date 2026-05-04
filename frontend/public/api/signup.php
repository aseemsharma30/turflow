<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/resend.php';
require_once __DIR__ . '/email-templates.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

$input     = getJsonInput();
$firstName = trim($input['firstName'] ?? '');
$lastName  = trim($input['lastName']  ?? '');
$email     = trim($input['email']     ?? '');
$phone     = trim($input['phone']     ?? '');
$password  = $input['password']       ?? '';

if ($firstName === '' || $phone === '' || $password === '') {
    sendJson(['error' => 'First name, phone, and password are required'], 400);
}

// Email is now mandatory
if ($email === '') {
    sendJson(['error' => 'Email is required'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJson(['error' => 'Please enter a valid email address'], 400);
}

try {
    $db = getDb();

    // Check if phone or email already exists
    $stmt = $db->prepare('SELECT id FROM users WHERE customer_phone = ? OR email = ? LIMIT 1');
    $stmt->execute([$phone, $email]);
    $existing = $stmt->fetch();

    if ($existing) {
        sendJson(['error' => 'Phone or email already exists'], 409);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare(
        'INSERT INTO users (first_name, last_name, email, customer_phone, password_hash, email_verified)
         VALUES (?, ?, ?, ?, ?, 0)'
    );
    $stmt->execute([$firstName, $lastName ?: null, $email, $phone, $passwordHash]);

    $userId = $db->lastInsertId();

    // Send welcome email (non-blocking — failure doesn't prevent signup)
    sendEmail($email, 'Welcome to TurFlow!', emailWelcome($firstName));

    startSession();
    $_SESSION['turflow_user'] = [
        'id'            => $userId,
        'firstName'     => $firstName,
        'lastName'      => $lastName,
        'email'         => $email,
        'phone'         => $phone,
        'emailVerified' => false,
    ];

    sendJson([
        'success' => true,
        'user'    => [
            'id'            => $userId,
            'firstName'     => $firstName,
            'lastName'      => $lastName,
            'email'         => $email,
            'phone'         => $phone,
            'emailVerified' => false,
        ]
    ]);
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}