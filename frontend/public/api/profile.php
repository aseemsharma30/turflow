<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJson(['error' => 'Method not allowed'], 405);
}

requireUser();

$user = $_SESSION['turflow_user'];

sendJson([
    'id' => $user['id'],
    'firstName' => $user['firstName'],
    'lastName' => $user['lastName'],
    'email' => $user['email'],
    'phone' => $user['phone']
]);
