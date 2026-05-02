<?php
require_once __DIR__ . '/db.php';

$lockFile = __DIR__ . '/setup.lock';
if (file_exists($lockFile)) {
    sendJson(['message' => 'Setup already completed. Delete setup.lock only if you intentionally need to re-run setup.']);
}

$pdo = getDb();

$pdo->exec("
    CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(120) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS venues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location TEXT NOT NULL,
        description TEXT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        rating DECIMAL(2,1) NOT NULL DEFAULT 0,
        sports JSON NULL,
        image LONGTEXT NULL,
        gallery JSON NULL,
        badge VARCHAR(40) NULL,
        is_featured TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS bookings (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        venue_id INT NULL,
        venue_name VARCHAR(255) NOT NULL,
        venue_location TEXT NOT NULL,
        booking_date DATE NULL,
        date_label VARCHAR(80) NOT NULL,
        booking_time VARCHAR(40) NOT NULL,
        duration INT NOT NULL DEFAULT 1,
        amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        status VARCHAR(40) NOT NULL DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$adminCount = (int) $pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
if ($adminCount === 0) {
    $stmt = $pdo->prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)');
    $stmt->execute([
        ADMIN_INITIAL_USERNAME,
        password_hash(ADMIN_INITIAL_PASSWORD, PASSWORD_DEFAULT)
    ]);
}

$venueCount = (int) $pdo->query('SELECT COUNT(*) FROM venues')->fetchColumn();
if ($venueCount === 0) {
    $stmt = $pdo->prepare('
        INSERT INTO venues (name, location, description, price, rating, sports, image, gallery, badge, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');

    $starterVenues = [
        [
            'Ball N Goal',
            'Gate No. 1, MI Rustle Court, Sector 6, Gomti Nagar, Lucknow',
            'Multi-sport turf with cricket, football and pickleball slots.',
            1100,
            4.8,
            ['Cricket', 'Football', 'Pickleball'],
            'https://images.unsplash.com/photo-1550881111-7cfde14b8073?auto=format&fit=crop&w=900&q=80',
            [],
            'NEW',
            1
        ],
        [
            'Elite Sports Arena',
            'A-1/26, Viram Khand 1, Gomti Nagar, Lucknow',
            'Floodlit turf for evening football and box cricket bookings.',
            1100,
            4.8,
            ['Cricket', 'Football'],
            'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=900&q=80',
            [],
            '',
            1
        ],
        [
            'Players Town',
            'S-524 Vishal Khand, Gomti Nagar, Lucknow',
            'Compact neighborhood venue with fast booking availability.',
            1100,
            4.7,
            ['Cricket', 'Football'],
            'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80',
            [],
            'NEW',
            1
        ],
    ];

    foreach ($starterVenues as $venue) {
        $stmt->execute([
            $venue[0],
            $venue[1],
            $venue[2],
            $venue[3],
            $venue[4],
            json_encode($venue[5]),
            $venue[6],
            json_encode($venue[7]),
            $venue[8],
            $venue[9],
        ]);
    }
}

file_put_contents($lockFile, gmdate('c'));

sendJson([
    'success' => true,
    'message' => 'TurFlow database tables created and admin user is ready.'
]);
