<?php
require_once '../config/database.php';

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        // Get product ID from query parameter
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if ($id <= 0) {
            throw new Exception('Invalid product ID');
        }

        // Prepare SQL statement
        $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        // Bind parameters
        $stmt->bind_param("i", $id);

        // Execute statement
        if (!$stmt->execute()) {
            throw new Exception("Failed to delete product: " . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            throw new Exception("Product not found");
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Product deleted successfully'
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
    $conn->close();
}
?> 