<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/resend.php';
require_once __DIR__ . '/email-templates.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

requireUser();

$sessionUser = $_SESSION['turflow_user'];
$userId      = $sessionUser['id'];

try {
    $db = getDb();

    $stmt = $db->prepare(
        'SELECT id, first_name, email, email_verified FROM users WHERE id = ? LIMIT 1'
    );
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        sendJson(['error' => 'User not found'], 404);
    }

    if (!empty($user['email_verified'])) {
        sendJson(['error' => 'Email is already verified'], 400);
    }

    if (empty($user['email'])) {
        sendJson(['error' => 'No email address on file'], 400);
    }

    $otp       = strval(rand(100000, 999999));
    $expiresAt = date('Y-m-d H:i:s', time() + 600); // 10 minutes

    $stmt = $db->prepare(
        'UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?'
    );
    $stmt->execute([$otp, $expiresAt, $userId]);

    sendEmail(
        $user['email'],
        'Verify your TurFlow email',
        emailOtp($user['first_name'], $otp, 'verify')
    );

    sendJson([
        'success' => true,
        'message' => 'Verification OTP sent to ' . $user['email']
    ]);
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}