<?php
// Start output buffering to prevent accidental output
ob_start();

// Log errors to a file instead of displaying them
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log');
error_reporting(E_ALL);

// Log file setup
$logFile = __DIR__ . '/contact_debug.log';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Script started\n", FILE_APPEND);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$host = 'localhost';
$dbname = 'sonijewels';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Database connection successful\n", FILE_APPEND);
} catch(PDOException $e) {
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Database connection failed: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]);
    exit();
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $raw_data = file_get_contents('php://input');
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Raw data received: " . $raw_data . "\n", FILE_APPEND);
    
    $data = json_decode($raw_data, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - JSON decode error: " . json_last_error_msg() . "\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data: ' . json_last_error_msg()]);
        exit();
    }
    
    // Debug: Log received data
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Decoded data: " . print_r($data, true) . "\n", FILE_APPEND);
    
    // Validate required fields
    if (!isset($data['name']) || !isset($data['email']) || !isset($data['subject']) || !isset($data['message'])) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Missing required fields\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit();
    }

    // Sanitize input data
    $name = filter_var($data['name'], FILTER_SANITIZE_STRING);
    $email = trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL));
    $phone = isset($data['phone']) ? filter_var($data['phone'], FILTER_SANITIZE_STRING) : null;
    $subject = filter_var($data['subject'], FILTER_SANITIZE_STRING);
    $message = filter_var($data['message'], FILTER_SANITIZE_STRING);

    // Debug: Log sanitized data
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Sanitized data - Name: $name, Email: $email, Phone: $phone, Subject: $subject\n", FILE_APPEND);

    // Validate email with a more lenient regex
    if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Invalid email format: $email\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format: ' . $email]);
        exit();
    }

    try {
        // Prepare SQL statement
        $stmt = $conn->prepare("INSERT INTO contact (name, email, phone, subject, message) VALUES (:name, :email, :phone, :subject, :message)");
        
        // Bind parameters
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);
        
        // Execute the statement
        $result = $stmt->execute();
        
        // Debug: Log execution result
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Query execution result: " . ($result ? "Success" : "Failed") . "\n", FILE_APPEND);
        
        if ($result) {
            // Send success response
            ob_end_clean();
            echo json_encode([
                'status' => 'success',
                'message' => 'Contact form submitted successfully'
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to insert data'
            ]);
        }
        
    } catch(PDOException $e) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Database error: " . $e->getMessage() . "\n", FILE_APPEND);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    // Handle non-POST requests
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Invalid request method: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method: ' . $_SERVER['REQUEST_METHOD']
    ]);
}
?> 