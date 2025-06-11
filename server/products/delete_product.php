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
        $database = new Database();
        $conn = $database->getConnection();

        if (!$conn) {
            throw new Exception("Database connection failed.");
        }

        // Get product ID from query parameter
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if ($id <= 0) {
            throw new Exception('Invalid product ID');
        }

        // Start transaction
        $conn->beginTransaction();

        // Delete related order items first
        $stmt_order_items = $conn->prepare("DELETE FROM order_items WHERE product_id = ?");
        if (!$stmt_order_items) {
            throw new Exception("Failed to prepare order items deletion: " . $conn->errorInfo()[2]);
        }
        $stmt_order_items->bindParam(1, $id, PDO::PARAM_INT);
        if (!$stmt_order_items->execute()) {
            throw new Exception("Failed to delete order items: " . $stmt_order_items->errorInfo()[2]);
        }

        // Delete related reviews
        $stmt_reviews = $conn->prepare("DELETE FROM reviews WHERE product_id = ?");
        if (!$stmt_reviews) {
            throw new Exception("Failed to prepare reviews deletion: " . $conn->errorInfo()[2]);
        }
        $stmt_reviews->bindParam(1, $id, PDO::PARAM_INT);
        if (!$stmt_reviews->execute()) {
            throw new Exception("Failed to delete reviews: " . $stmt_reviews->errorInfo()[2]);
        }

        // Now, delete the product itself
        $stmt_product = $conn->prepare("DELETE FROM products WHERE id = ?");
        if (!$stmt_product) {
            throw new Exception("Failed to prepare product deletion: " . $conn->errorInfo()[2]);
        }
        $stmt_product->bindParam(1, $id, PDO::PARAM_INT);
        if (!$stmt_product->execute()) {
            throw new Exception("Failed to delete product: " . $stmt_product->errorInfo()[2]);
        }

        if ($stmt_product->rowCount() === 0) {
            throw new Exception("Product not found");
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            'status' => 'success',
            'message' => 'Product and all associated data deleted successfully'
        ]);

    } catch (Exception $e) {
        // Rollback transaction on error
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
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