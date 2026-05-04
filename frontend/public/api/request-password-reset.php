<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/resend.php';
require_once __DIR__ . '/email-templates.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

$input = getJsonInput();
$phone = trim($input['phone'] ?? '');

if ($phone === '') {
    sendJson(['error' => 'Phone is required'], 400);
}

try {
    $db = getDb();

    // Verify the user exists before sending any OTP
    $stmt = $db->prepare('SELECT id, first_name, email FROM users WHERE customer_phone = ? LIMIT 1');
    $stmt->execute([$phone]);
    $user = $stmt->fetch();

    if (!$user) {
        // Generic message to avoid user enumeration
        sendJson(['success' => true, 'message' => 'If this number is registered, an OTP has been sent to the associated email.']);
    }

    if (empty($user['email'])) {
        sendJson(['error' => 'No email address is associated with this account. Please contact support.'], 400);
    }

    $otp       = strval(rand(100000, 999999));
    $expiresAt = date('Y-m-d H:i:s', time() + 600); // 10 minutes

    $stmt = $db->prepare('UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?');
    $stmt->execute([$otp, $expiresAt, $user['id']]);

    // Send OTP email
    sendEmail(
        $user['email'],
        'Your TurFlow Password Reset OTP',
        emailOtp($user['first_name'], $otp, 'password reset')
    );

    sendJson([
        'success' => true,
        'message' => 'OTP sent to the email address linked to your account.'
    ]);
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}