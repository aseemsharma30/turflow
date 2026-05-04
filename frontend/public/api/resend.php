<?php
// -----------------------------------------------------------
// Resend email helper
// Replace the API key below with your real Resend API key.
// -----------------------------------------------------------
define('RESEND_API_KEY', 're_KDSM3XDx_9uN3jjrPy7zapvZCkvJ2nwUN'); // <-- Replace with your real Resend API key
define('RESEND_FROM',    'TurFlow <noreply@yourdomain.com>'); // <-- Replace with an email from your verified Resend domain

/**
 * Send an email via the Resend API.
 *
 * @param string $to      Recipient email address
 * @param string $subject Email subject
 * @param string $html    HTML body
 * @return bool           true on success, false on failure
 */
function sendEmail(string $to, string $subject, string $html): bool {
    $payload = json_encode([
        'from'    => RESEND_FROM,
        'to'      => [$to],
        'subject' => $subject,
        'html'    => $html,
    ]);

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . RESEND_API_KEY,
            'Content-Type: application/json',
        ],
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 200 || $httpCode === 201;
}