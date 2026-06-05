<?php
// login.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$email = trim(mysqli_real_escape_string($conn, $_POST['email'] ?? ''));
$pass  = $_POST['password'] ?? '';

if (!$email || !$pass) {
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
    exit;
}

$sql    = "SELECT id, name, email, phone, age, height, weight, password FROM users WHERE email = '$email' LIMIT 1";
$result = mysqli_query($conn, $sql);

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(['status' => 'error', 'message' => 'No account found with this email.']);
    exit;
}

$user = mysqli_fetch_assoc($result);

if (!password_verify($pass, $user['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Incorrect password.']);
    exit;
}

unset($user['password']); // Never send password hash to frontend

echo json_encode([
    'status'  => 'success',
    'message' => 'Login successful!',
    'user'    => $user
]);

mysqli_close($conn);
?>
