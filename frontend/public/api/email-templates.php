<?php
/**
 * TurFlow email templates
 * All emails share the same dark-green TurFlow brand theme.
 */

function emailWelcome(string $firstName): string {
    return '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Welcome to TurFlow</title>
</head>
<body style="margin:0;padding:0;background:#0a1a0f;font-family:\'Segoe UI\',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1a0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#1a2e1f;border:1px solid #2a4a2f;border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#22c55e;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#0a1a0f;font-size:28px;font-weight:800;letter-spacing:-0.5px;">TurFlow</h1>
              <p style="margin:6px 0 0;color:#0a1a0f;font-size:13px;opacity:0.75;">Book sports venues instantly</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 12px;color:#ffffff;font-size:22px;font-weight:700;">
                Welcome, ' . htmlspecialchars($firstName) . '! 🎉
              </h2>
              <p style="margin:0 0 20px;color:#a8d5b5;font-size:15px;line-height:1.6;">
                You\'re now part of TurFlow — your go-to platform for booking the best sports turfs near you. Whether it\'s football, cricket, or pickleball, we\'ve got your game covered.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#0a1a0f;border:1px solid #2a4a2f;border-radius:8px;padding:20px;">
                    <p style="margin:0 0 10px;color:#22c55e;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">What you can do now</p>
                    <p style="margin:0 0 8px;color:#d1fae5;font-size:14px;">⚽&nbsp; Browse and book turfs instantly</p>
                    <p style="margin:0 0 8px;color:#d1fae5;font-size:14px;">📅&nbsp; View and manage your bookings</p>
                    <p style="margin:0;color:#d1fae5;font-size:14px;">✅&nbsp; Verify your email for a trusted profile</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;color:#a8d5b5;font-size:14px;line-height:1.6;">
                Please verify your email address to unlock all features and secure your account.
              </p>

              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="#" style="display:inline-block;background:#22c55e;color:#0a1a0f;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;">
                      Go to TurFlow →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #2a4a2f;text-align:center;">
              <p style="margin:0;color:#4a7a5a;font-size:12px;">
                © ' . date('Y') . ' TurFlow. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
}

function emailOtp(string $firstName, string $otp, string $purpose = 'password reset'): string {
    $title   = $purpose === 'verify' ? 'Verify Your Email' : 'Password Reset OTP';
    $heading = $purpose === 'verify' ? 'Verify your email address' : 'Reset your password';
    $desc    = $purpose === 'verify'
        ? 'Use the OTP below to verify your email address on TurFlow.'
        : 'Use the OTP below to reset your TurFlow account password.';

    return '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>' . $title . '</title>
</head>
<body style="margin:0;padding:0;background:#0a1a0f;font-family:\'Segoe UI\',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1a0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#1a2e1f;border:1px solid #2a4a2f;border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#22c55e;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#0a1a0f;font-size:28px;font-weight:800;letter-spacing:-0.5px;">TurFlow</h1>
              <p style="margin:6px 0 0;color:#0a1a0f;font-size:13px;opacity:0.75;">Book sports venues instantly</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 12px;color:#ffffff;font-size:22px;font-weight:700;">' . $heading . '</h2>
              <p style="margin:0 0 28px;color:#a8d5b5;font-size:15px;line-height:1.6;">
                Hi ' . htmlspecialchars($firstName) . ', ' . $desc . '
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center" style="background:#0a1a0f;border:1px solid #22c55e;border-radius:10px;padding:28px;">
                    <p style="margin:0 0 8px;color:#22c55e;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Your OTP</p>
                    <p style="margin:0;color:#ffffff;font-size:40px;font-weight:800;letter-spacing:10px;">' . htmlspecialchars($otp) . '</p>
                    <p style="margin:10px 0 0;color:#4a7a5a;font-size:12px;">Valid for 10 minutes</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#4a7a5a;font-size:13px;line-height:1.6;">
                If you did not request this, please ignore this email. Your account remains secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #2a4a2f;text-align:center;">
              <p style="margin:0;color:#4a7a5a;font-size:12px;">
                © ' . date('Y') . ' TurFlow. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
}