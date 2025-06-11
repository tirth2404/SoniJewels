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
        $database = new Database();
        $conn = $database->getConnection();
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

        $products = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Convert JSON strings to arrays
            $row['images'] = json_decode($row['images'], true) ?? [];
            $row['features'] = json_decode($row['features'], true) ?? [];
            $products[] = $row;
        }
        
        // Log the products array before encoding
        error_log("Products data: " . print_r($products, true));

        // --- Start: Log image paths for product ID 1 ---
        $productIdToLog = 1;
        $stmtSingle = $conn->prepare("SELECT images FROM products WHERE id = ?");
        if ($stmtSingle) {
            $stmtSingle->bindParam(1, $productIdToLog, PDO::PARAM_INT);
            $stmtSingle->execute();
            if ($rowSingle = $stmtSingle->fetch(PDO::FETCH_ASSOC)) {
                $imagesJson = $rowSingle['images'];
                $imagesArray = json_decode($imagesJson, true) ?? [];
                error_log("Images for product ID " . $productIdToLog . ": " . print_r($imagesArray, true));
            } else {
                error_log("Product with ID " . $productIdToLog . " not found.");
            }
        }
        // --- End: Log image paths for product ID 1 ---

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
    $conn = null; // Close PDO connection by setting to null
}
?> 