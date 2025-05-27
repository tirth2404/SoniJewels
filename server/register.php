<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Database connection
try {
    $conn = new mysqli("localhost", "root", "", "Sonijewels");
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
} catch (Exception $e) {
    error_log("Database connection error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed. Please check server configuration.']);
    exit();
}

// Get and validate data from POST
if (!isset($_POST['username']) || !isset($_POST['email']) || !isset($_POST['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

$username = trim($_POST['username']);
$email = trim($_POST['email']);
$password = $_POST['password'];

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit();
}

// Validate username (alphanumeric and spaces only)
if (!preg_match('/^[a-zA-Z0-9\s]+$/', $username)) {
    http_response_code(400);
    echo json_encode(['error' => 'Username can only contain letters, numbers, and spaces']);
    exit();
}

// Check if username already exists
try {
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE Username = ? LIMIT 1");
    if (!$checkStmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $checkStmt->bind_param("s", $username);
    
    if (!$checkStmt->execute()) {
        throw new Exception("Execute failed: " . $checkStmt->error);
    }
    
    $result = $checkStmt->get_result();
    if ($result->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Username already exists']);
        exit();
    }
    
    $checkStmt->close();
} catch (Exception $e) {
    error_log("Database error checking username: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred while checking username. Please try again.']);
    exit();
}

// Check if email already exists
try {
    $checkEmailStmt = $conn->prepare("SELECT id FROM users WHERE Email = ? LIMIT 1");
    if (!$checkEmailStmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $checkEmailStmt->bind_param("s", $email);
    
    if (!$checkEmailStmt->execute()) {
        throw new Exception("Execute failed: " . $checkEmailStmt->error);
    }
    
    $result = $checkEmailStmt->get_result();
    if ($result->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Email is already registered']);
        exit();
    }
    
    $checkEmailStmt->close();
} catch (Exception $e) {
    error_log("Database error checking email: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred while checking email. Please try again.']);
    exit();
}

// Validate password length
if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 8 characters long']);
    exit();
}

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    // Prepare and execute the SQL statement
    $stmt = $conn->prepare("INSERT INTO users (Username, Email, Password) VALUES (?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("sss", $username, $email, $hashedPassword);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    echo json_encode(['message' => 'Account created successfully']);
} catch (Exception $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create account. Please try again.']);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
