<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJson(['error' => 'Method not allowed'], 405);
}

requireUser();

$user = $_SESSION['turflow_user'];
$phone = $user['phone'];

try {
    $db = getDb();

    $stmt = $db->prepare('SELECT * FROM bookings WHERE customer_phone = ? ORDER BY created_at DESC');
    $stmt->execute([$phone]);
    $bookings = $stmt->fetchAll();

    sendJson($bookings ?: []);
} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
