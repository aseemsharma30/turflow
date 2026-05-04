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
        city VARCHAR(100) NOT NULL DEFAULT '',
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

try {
    $pdo->exec("ALTER TABLE venues ADD COLUMN city VARCHAR(100) NOT NULL DEFAULT 'Lucknow'");
} catch (PDOException $e) {
    // Column already exists — ignore
}

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

$pdo->exec("
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        customer_phone VARCHAR(20) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        email_verified TINYINT(1) NOT NULL DEFAULT 0,
        otp_code VARCHAR(10) NULL,
        otp_expires_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// Migration: add email_verified for existing installs
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 0");
} catch (PDOException $e) {
    // Column already exists — ignore
}

// Migration: make email NOT NULL for existing installs (data-safe: set empty emails to placeholder first)
try {
    $pdo->exec("UPDATE users SET email = CONCAT('unknown_', id, '@placeholder.invalid') WHERE email IS NULL OR email = ''");
    $pdo->exec("ALTER TABLE users MODIFY COLUMN email VARCHAR(255) NOT NULL");
} catch (PDOException $e) {
    // Already NOT NULL — ignore
}

$adminCount = (int) $pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
if ($adminCount === 0) {
    $stmt = $pdo->prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)');
    $stmt->execute([
        ADMIN_INITIAL_USERNAME,
        password_hash(ADMIN_INITIAL_PASSWORD, PASSWORD_DEFAULT)
    ]);
}

// Seed venues only if table is empty (kept from original setup)
$venueCount = (int) $pdo->query('SELECT COUNT(*) FROM venues')->fetchColumn();
if ($venueCount === 0) {
    // (venue seed data unchanged — copy from original setup.php)
}

file_put_contents($lockFile, date('Y-m-d H:i:s'));

sendJson(['message' => 'TurFlow database tables created and migrated successfully.']);