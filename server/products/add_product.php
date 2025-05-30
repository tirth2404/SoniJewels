<?php
require_once '../config/database.php';

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
        // Get POST data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            throw new Exception('Invalid input data');
        }

        // Validate required fields
        $requiredFields = ['name', 'description', 'price', 'category', 'material', 'stock'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }

        // Prepare SQL statement
        $stmt = $conn->prepare("
            INSERT INTO products (name, description, price, category, material, stock, featured, images, features)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            "ssdssiiss",
            $data['name'],
            $data['description'],
            $data['price'],
            $data['category'],
            $data['material'],
            $data['stock'],
            $featured,
            $images,
            $features
        );

        // Execute statement
        if (!$stmt->execute()) {
            throw new Exception("Failed to add product: " . $stmt->error);
        }

        $productId = $conn->insert_id;

        echo json_encode([
            'status' => 'success',
            'message' => 'Product added successfully',
            'data' => [
                'id' => $productId
            ]
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