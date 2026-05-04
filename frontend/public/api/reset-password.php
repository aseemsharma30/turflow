<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

$input       = getJsonInput();
$phone       = trim($input['phone']       ?? '');
$otp         = trim($input['otp']         ?? '');
$newPassword = $input['newPassword']      ?? '';

if ($phone === '' || $otp === '' || $newPassword === '') {
    sendJson(['error' => 'Phone, OTP, and new password are required'], 400);
}

try {
    $db = getDb();

    $stmt = $db->prepare(
        'SELECT id, otp_code, otp_expires_at FROM users WHERE customer_phone = ? LIMIT 1'
    );
    $stmt->execute([$phone]);
    $user = $stmt->fetch();

    if (!$user) {
        sendJson(['error' => 'Invalid request'], 400);
    }

    if ($user['otp_code'] !== $otp) {
        sendJson(['error' => 'Invalid OTP. Please check and try again.'], 400);
    }

    if (strtotime($user['otp_expires_at']) < time()) {
        sendJson(['error' => 'OTP has expired. Please request a new one.'], 400);
    }

    $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    $stmt = $db->prepare(
        'UPDATE users SET password_hash = ?, otp_code = NULL, otp_expires_at = NULL WHERE id = ?'
    );
    $stmt->execute([$passwordHash, $user['id']]);

    sendJson([
        'success' => true,
        'message' => 'Password reset successfully. You can now sign in.'
    ]);
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}