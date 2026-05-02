<?php
require_once __DIR__ . '/db.php';

session_start();

sendJson([
    'authenticated' => !empty($_SESSION['turflow_admin']),
    'admin' => $_SESSION['turflow_admin'] ?? null
]);
