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

        // Prepare and execute query
        $stmt = $conn->prepare("SELECT * FROM products ORDER BY created_at DESC");
        if (!$stmt) {
            throw new Exception("Failed to prepare query: " . $conn->error);
        }

        if (!$stmt->execute()) {
            throw new Exception("Failed to execute query: " . $stmt->error);
        }

        $result = $stmt->get_result();
        $products = [];
        
        while ($row = $result->fetch_assoc()) {
            // Convert JSON strings to arrays
            $row['images'] = json_decode($row['images'], true) ?? [];
            $row['features'] = json_decode($row['features'], true) ?? [];
            $products[] = $row;
        }
        
        // Send success response
        echo json_encode([
            'status' => 'success',
            'data' => $products
        ]);
        
    } catch(Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method: ' . $_SERVER['REQUEST_METHOD']
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?> 