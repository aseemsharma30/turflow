<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

requireUser();

$sessionUser = $_SESSION['turflow_user'];
$userId      = $sessionUser['id'];

$input = getJsonInput();
$otp   = trim($input['otp'] ?? '');

if ($otp === '') {
    sendJson(['error' => 'OTP is required'], 400);
}

try {
    $db = getDb();

    $stmt = $db->prepare(
        'SELECT id, otp_code, otp_expires_at, email_verified FROM users WHERE id = ? LIMIT 1'
    );
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        sendJson(['error' => 'User not found'], 404);
    }

    if (!empty($user['email_verified'])) {
        sendJson(['error' => 'Email is already verified'], 400);
    }

    if ($user['otp_code'] !== $otp) {
        sendJson(['error' => 'Invalid OTP. Please try again.'], 400);
    }

    if (strtotime($user['otp_expires_at']) < time()) {
        sendJson(['error' => 'OTP has expired. Please request a new one.'], 400);
    }

    $stmt = $db->prepare(
        'UPDATE users SET email_verified = 1, otp_code = NULL, otp_expires_at = NULL WHERE id = ?'
    );
    $stmt->execute([$userId]);

    // Update session so UI reflects verified status immediately
    $_SESSION['turflow_user']['emailVerified'] = true;

    sendJson([
        'success' => true,
        'message' => 'Email verified successfully!'
    ]);
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}