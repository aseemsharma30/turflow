<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

startSession();
unset($_SESSION['turflow_user']);

sendJson(['success' => true]);
