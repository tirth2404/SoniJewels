<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        // Get product ID from query parameter
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if ($id <= 0) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid product ID'
            ]);
            exit;
        }

        // Get product details including images and features from JSON columns
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        if (!$stmt) {
            throw new Exception("Failed to prepare product query: " . $conn->errorInfo()[2]);
        }

        $stmt->bindParam(1, $id, PDO::PARAM_INT);
        if (!$stmt->execute()) {
            throw new Exception("Failed to execute product query: " . $stmt->errorInfo()[2]);
        }

        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Product not found'
            ]);
            exit;
        }
        
        // Parse JSON columns
        $product['images'] = json_decode($product['images'], true) ?? [];
        $product['features'] = json_decode($product['features'], true) ?? [];
        
        // Get reviews if the reviews table exists
        try {
            $stmt_reviews = $conn->prepare("
                SELECT r.*, u.name as user_name
                FROM reviews r
                LEFT JOIN users u ON r.user_id = u.id
                WHERE r.product_id = ? AND r.status = 'approved'
                ORDER BY r.created_at DESC
            ");
            
            if ($stmt_reviews) {
                $stmt_reviews->bindParam(1, $id, PDO::PARAM_INT);
                if ($stmt_reviews->execute()) {
                    $reviews = $stmt_reviews->fetchAll(PDO::FETCH_ASSOC);
                    $product['reviews'] = $reviews;
                    
                    // Calculate average rating
                    $totalRating = 0;
                    foreach ($reviews as $review) {
                        $totalRating += $review['rating'];
                    }
                    $product['rating'] = count($reviews) > 0 ? round($totalRating / count($reviews), 1) : 0;
                }
            }
        } catch (Exception $e) {
            // If reviews table doesn't exist, just continue without reviews
            $product['reviews'] = [];
            $product['rating'] = 0;
        }
        
        echo json_encode([
            'status' => 'success',
            'data' => $product
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch product: ' . $e->getMessage()
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