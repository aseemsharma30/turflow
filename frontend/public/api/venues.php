<?php
require_once __DIR__ . '/db.php';

function venueFromRow($row) {
    return [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'location' => $row['location'],
        'city' => $row['city'] ?? '',
        'description' => $row['description'] ?? '',
        'price' => (string) (0 + $row['price']),
        'rating' => (float) $row['rating'],
        'sports' => json_decode($row['sports'] ?? '[]', true) ?: [],
        'image' => $row['image'] ?? '',
        'gallery' => json_decode($row['gallery'] ?? '[]', true) ?: [],
        'badge' => $row['badge'] ?? '',
        'isFeatured' => (bool) $row['is_featured'],
    ];
}

function venuePayload($input) {
    return [
        'name' => trim($input['name'] ?? ''),
        'location' => trim($input['location'] ?? ''),
        'city' => trim($input['city'] ?? ''),
        'description' => trim($input['description'] ?? ''),
        'price' => (float) ($input['price'] ?? 0),
        'rating' => (float) ($input['rating'] ?? 0),
        'sports' => json_encode($input['sports'] ?? []),
        'image' => $input['image'] ?? '',
        'gallery' => json_encode($input['gallery'] ?? []),
        'badge' => $input['badge'] ?? '',
        'is_featured' => !empty($input['isFeatured']) ? 1 : 0,
    ];
}


$pdo = getDb();

// Migrate: add city column if it doesn't exist
try {
    $pdo->exec("ALTER TABLE venues ADD COLUMN city VARCHAR(100) NOT NULL DEFAULT ''");
} catch (PDOException $e) {
    // Column already exists — ignore
}

$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM venues ORDER BY id DESC');
    sendJson(array_map('venueFromRow', $stmt->fetchAll()));
}

if ($method === 'POST') {
    requireAdmin();
    $payload = venuePayload(getJsonInput());
    if ($payload['name'] === '' || $payload['location'] === '') {
        sendJson(['error' => 'Venue name and location are required'], 400);
    }

    $stmt = $pdo->prepare('
        INSERT INTO venues (name, location, city, description, price, rating, sports, image, gallery, badge, is_featured)
        VALUES (:name, :location, :city, :description, :price, :rating, :sports, :image, :gallery, :badge, :is_featured)
    ');
    $stmt->execute($payload);

    $stmt = $pdo->prepare('SELECT * FROM venues WHERE id = ?');
    $stmt->execute([$pdo->lastInsertId()]);
    sendJson(venueFromRow($stmt->fetch()));
}

if ($method === 'PATCH') {
    requireAdmin();
    $input = getJsonInput();
    $id = $input['id'] ?? null;
    $payload = venuePayload($input);

    $stmt = $pdo->prepare('
        UPDATE venues
        SET name = :name,
            location = :location,
            city = :city,
            description = :description,
            price = :price,
            rating = :rating,
            sports = :sports,
            image = :image,
            gallery = :gallery,
            badge = :badge,
            is_featured = :is_featured
        WHERE id = :id
    ');
    $payload['id'] = $id;
    $stmt->execute($payload);

    $stmt = $pdo->prepare('SELECT * FROM venues WHERE id = ?');
    $stmt->execute([$id]);
    sendJson(venueFromRow($stmt->fetch()));
}

if ($method === 'DELETE') {
    requireAdmin();
    $id = $_GET['id'] ?? null;
    $stmt = $pdo->prepare('DELETE FROM venues WHERE id = ?');
    $stmt->execute([$id]);
    sendJson(['success' => true]);
}

sendJson(['error' => 'Method not allowed'], 405);