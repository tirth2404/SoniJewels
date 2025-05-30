<?php
require_once '../config/database.php';

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        // Get PUT data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            throw new Exception('Invalid input data');
        }

        // Validate required fields
        if (!isset($data['id'])) {
            throw new Exception('Product ID is required');
        }

        // Prepare SQL statement
        $stmt = $conn->prepare("
            UPDATE products 
            SET name = ?, 
                description = ?, 
                price = ?, 
                category = ?, 
                material = ?, 
                stock = ?, 
                featured = ?, 
                images = ?, 
                features = ?
            WHERE id = ?
        ");

        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        // Convert arrays to JSON
        $images = isset($data['images']) ? json_encode($data['images']) : '[]';
        $features = isset($data['features']) ? json_encode($data['features']) : '[]';
        $featured = isset($data['featured']) ? (int)$data['featured'] : 0;

        // Bind parameters
        $stmt->bind_param(
            "ssdssiissi",
            $data['name'],
            $data['description'],
            $data['price'],
            $data['category'],
            $data['material'],
            $data['stock'],
            $featured,
            $images,
            $features,
            $data['id']
        );

        // Execute statement
        if (!$stmt->execute()) {
            throw new Exception("Failed to update product: " . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            throw new Exception("Product not found or no changes made");
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Product updated successfully'
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