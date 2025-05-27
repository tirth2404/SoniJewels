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

// Get and validate data from POST
if (!isset($_POST['email']) || !isset($_POST['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing email or password']);
    exit();
}

$email = trim($_POST['email']);
$password = $_POST['password'];

// Special case for admin login
if ($email === 'admin@gmail.com' && $password === 'admin123') {
    $adminUser = [
        'id' => 0,
        'Username' => 'Admin',
        'Email' => 'admin@gmail.com'
    ];
    echo json_encode([
        'message' => 'Admin login successful',
        'user' => $adminUser,
        'isAdmin' => true
    ]);
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

// Prepare and execute the SQL statement to fetch user by email
try {
    $stmt = $conn->prepare("SELECT id, Username, Email, Password FROM users WHERE Email = ? LIMIT 1");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("s", $email);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if ($user && password_verify($password, $user['Password'])) {
        // Password is correct
        // Remove password hash before sending user data to frontend
        unset($user['Password']);
        
        // Determine if user is admin (you might need a role column in your database)
        // The frontend also checks for admin@gmail.com, so let's keep that logic if needed.
        $isAdmin = ($user['Email'] === 'admin@gmail.com');
        
        echo json_encode(['message' => 'Login successful', 'user' => $user, 'isAdmin' => $isAdmin]);
    } else {
        // Invalid credentials
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
    }
    
} catch (Exception $e) {
    error_log("Database error during login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred during login. Please try again.']);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?> 