<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sonijewels";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// You can use either user_id or username to fetch the email
$user_identifier = isset($data['user_id']) ? $data['user_id'] : (isset($data['username']) ? $data['username'] : null);

if (!$user_identifier) {
    http_response_code(400);
    echo json_encode(["error" => "User identifier is required"]);
    exit();
}

// Fetch email from users table
if (isset($data['user_id'])) {
    $stmt = $conn->prepare("SELECT Email FROM users WHERE id = ?");
    $stmt->bind_param("i", $data['user_id']);
} else {
    $stmt = $conn->prepare("SELECT Email FROM users WHERE Username = ?");
    $stmt->bind_param("s", $data['username']);
}
$stmt->execute();
$stmt->bind_result($email);
$stmt->fetch();
$stmt->close();

if (!$email) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit();
}

// Prepare order insert
$stmt = $conn->prepare("INSERT INTO orders (First_name, Last_name, Email, Address, City, State, Zip_code, Country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param(
    "ssssssis",
    $data['First_name'],
    $data['Last_name'],
    $email,
    $data['Address'],
    $data['City'],
    $data['State'],
    $data['Zip_code'],
    $data['Country']
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "order_id" => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to place order"]);
}

$stmt->close();
$conn->close();
?> 