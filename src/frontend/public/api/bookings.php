<?php
require_once __DIR__ . '/db.php';

function bookingFromRow($row) {
    return [
        'id' => (int) $row['id'],
        'venueId' => isset($row['venue_id']) ? (int) $row['venue_id'] : null,
        'venueName' => $row['venue_name'],
        'venueLocation' => $row['venue_location'],
        'date' => $row['booking_date'],
        'dateLabel' => $row['date_label'],
        'time' => $row['booking_time'],
        'duration' => (int) $row['duration'],
        'amount' => (float) $row['amount'],
        'customerName' => $row['customer_name'],
        'customerPhone' => $row['customer_phone'],
        'status' => $row['status'],
        'createdAt' => $row['created_at'],
    ];
}

$pdo = getDb();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    requireAdmin();
    $stmt = $pdo->query('SELECT * FROM bookings ORDER BY created_at DESC, id DESC');
    sendJson(array_map('bookingFromRow', $stmt->fetchAll()));
}

if ($method === 'POST') {
    $input = getJsonInput();
    $stmt = $pdo->prepare('
        INSERT INTO bookings (
            venue_id,
            venue_name,
            venue_location,
            booking_date,
            date_label,
            booking_time,
            duration,
            amount,
            customer_name,
            customer_phone,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $input['venueId'] ?? null,
        $input['venueName'] ?? '',
        $input['venueLocation'] ?? '',
        $input['date'] ?? null,
        $input['dateLabel'] ?? '',
        $input['time'] ?? '',
        $input['duration'] ?? 1,
        $input['amount'] ?? 0,
        $input['customerName'] ?? '',
        $input['customerPhone'] ?? '',
        $input['status'] ?? 'New',
    ]);

    $stmt = $pdo->prepare('SELECT * FROM bookings WHERE id = ?');
    $stmt->execute([$pdo->lastInsertId()]);
    sendJson(bookingFromRow($stmt->fetch()));
}

if ($method === 'PATCH') {
    requireAdmin();
    $input = getJsonInput();
    $stmt = $pdo->prepare('UPDATE bookings SET status = ? WHERE id = ?');
    $stmt->execute([$input['status'] ?? 'New', $input['id'] ?? null]);
    sendJson(['success' => true]);
}

if ($method === 'DELETE') {
    requireAdmin();
    $stmt = $pdo->prepare('DELETE FROM bookings WHERE id = ?');
    $stmt->execute([$_GET['id'] ?? null]);
    sendJson(['success' => true]);
}

sendJson(['error' => 'Method not allowed'], 405);
