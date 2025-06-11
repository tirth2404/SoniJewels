<?php
require_once 'config/database.php';

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $database = new Database();
        $conn = $database->getConnection();

        if (!$conn) {
            throw new Exception("Database connection failed.");
        }

        // Get POST data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            throw new Exception('Invalid input data');
        }

        // Validate required fields
        $requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }

        // Validate email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }

        // Prepare SQL statement
        $stmt = $conn->prepare("
            INSERT INTO contact (name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?)
        ");

        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->errorInfo()[2]);
        }

        // Bind parameters
        $stmt->bindParam(1, $data['name'], PDO::PARAM_STR);
        $stmt->bindParam(2, $data['email'], PDO::PARAM_STR);
        $stmt->bindParam(3, $data['phone'], PDO::PARAM_STR);
        $stmt->bindParam(4, $data['subject'], PDO::PARAM_STR);
        $stmt->bindParam(5, $data['message'], PDO::PARAM_STR);

        // Execute statement
        if (!$stmt->execute()) {
            throw new Exception("Failed to save message: " . $stmt->errorInfo()[2]);
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Message sent successfully'
        ]);

    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method'
    ]);
}

if (isset($conn)) {
    $conn = null; // Close PDO connection by setting to null
}
?> 