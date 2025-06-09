<?php
require_once '../config/database.php';

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Check database connection
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        // Prepare and execute query to fetch all orders
        // Note: The 'orders' table structure provided does not include 'total' or 'status'.
        // We will fetch the available columns for now.
        $stmt = $conn->prepare("SELECT id, First_name, Last_name, Email, Address, City, State, Zip_code, Country FROM orders ORDER BY id DESC");
        if (!$stmt) {
            throw new Exception("Failed to prepare query: " . $conn->error);
        }

        if (!$stmt->execute()) {    
            throw new Exception("Failed to execute query: " . $stmt->error);
        }

        $result = $stmt->get_result();
        $orders = [];

        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }

        // Send success response
        echo json_encode([
            'status' => 'success',
            'data' => $orders
        ]);

    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method: ' . $_SERVER['REQUEST_METHOD']
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?> 