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
            throw new Exception("Failed to prepare statement: " . $conn->errorInfo()[2]);
        }

        // Convert arrays to JSON
        $images = isset($data['images']) ? json_encode($data['images']) : '[]';
        $features = isset($data['features']) ? json_encode($data['features']) : '[]';
        $featured = isset($data['featured']) ? (int)$data['featured'] : 0;

        // Bind parameters
        $stmt->bindParam(1, $data['name'], PDO::PARAM_STR);
        $stmt->bindParam(2, $data['description'], PDO::PARAM_STR);
        $stmt->bindParam(3, $data['price'], PDO::PARAM_STR);
        $stmt->bindParam(4, $data['category'], PDO::PARAM_STR);
        $stmt->bindParam(5, $data['material'], PDO::PARAM_STR);
        $stmt->bindParam(6, $data['stock'], PDO::PARAM_INT);
        $stmt->bindParam(7, $featured, PDO::PARAM_INT);
        $stmt->bindParam(8, $images, PDO::PARAM_STR);
        $stmt->bindParam(9, $features, PDO::PARAM_STR);

        // Execute statement
        if (!$stmt->execute()) {
            throw new Exception("Failed to add product: " . $stmt->errorInfo()[2]);
        }

        $productId = $conn->lastInsertId();

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
    $conn = null; // Close PDO connection by setting to null
}
?> 