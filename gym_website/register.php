<?php
// register.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Sanitize inputs
$name   = trim(mysqli_real_escape_string($conn, $_POST['name'] ?? ''));
$email  = trim(mysqli_real_escape_string($conn, $_POST['email'] ?? ''));
$phone  = trim(mysqli_real_escape_string($conn, $_POST['phone'] ?? ''));
$age    = intval($_POST['age'] ?? 0);
$height = floatval($_POST['height'] ?? 0);
$weight = floatval($_POST['weight'] ?? 0);
$pass   = $_POST['password'] ?? '';

// Validation
if (!$name || !$email || !$phone || !$age || !$height || !$weight || !$pass) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
    exit;
}
if ($age < 10 || $age > 100) {
    echo json_encode(['status' => 'error', 'message' => 'Age must be between 10 and 100.']);
    exit;
}
if ($height < 50 || $height > 300) {
    echo json_encode(['status' => 'error', 'message' => 'Height must be between 50 and 300 cm.']);
    exit;
}
if ($weight < 10 || $weight > 500) {
    echo json_encode(['status' => 'error', 'message' => 'Weight must be between 10 and 500 kg.']);
    exit;
}
if (strlen($pass) < 6) {
    echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters.']);
    exit;
}

// Check duplicate email
$check = mysqli_query($conn, "SELECT id FROM users WHERE email = '$email'");
if (mysqli_num_rows($check) > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email already registered. Please login.']);
    exit;
}

// Hash password
$hashed = password_hash($pass, PASSWORD_BCRYPT);

// Insert user
$sql = "INSERT INTO users (name, email, phone, age, height, weight, password)
        VALUES ('$name', '$email', '$phone', $age, $height, $weight, '$hashed')";

if (mysqli_query($conn, $sql)) {
    $user_id = mysqli_insert_id($conn);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Registration successful!',
        'user'    => [
            'id'     => $user_id,
            'name'   => $name,
            'email'  => $email,
            'phone'  => $phone,
            'age'    => $age,
            'height' => $height,
            'weight' => $weight
        ]
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . mysqli_error($conn)]);
}

mysqli_close($conn);
?>
