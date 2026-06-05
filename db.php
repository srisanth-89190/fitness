<?php
// db.php - Database Connection
// Place this file in: C:/xampp/htdocs/gym_website/

define('DB_HOST', 'localhost');
define('DB_USER', 'root');       // Default XAMPP username
define('DB_PASS', '');           // Default XAMPP password (empty)
define('DB_NAME', 'gym_db');

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if (!$conn) {
    die(json_encode([
        'status'  => 'error',
        'message' => 'Database connection failed: ' . mysqli_connect_error()
    ]));
}

mysqli_set_charset($conn, 'utf8mb4');
?>
