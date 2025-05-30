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
        // Check database connection
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
            throw new Exception("Failed to prepare product query: " . $conn->error);
        }

        $stmt->bind_param("i", $id);
        if (!$stmt->execute()) {
            throw new Exception("Failed to execute product query: " . $stmt->error);
        }

        $result = $stmt->get_result();
        if ($result->num_rows === 0) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Product not found'
            ]);
            exit;
        }
        
        $product = $result->fetch_assoc();
        $stmt->close();
        
        // Parse JSON columns
        $product['images'] = json_decode($product['images'], true) ?? [];
        $product['features'] = json_decode($product['features'], true) ?? [];
        
        // Get reviews if the reviews table exists
        try {
            $stmt = $conn->prepare("
                SELECT r.*, u.name as user_name
                FROM reviews r
                LEFT JOIN users u ON r.user_id = u.id
                WHERE r.product_id = ? AND r.status = 'approved'
                ORDER BY r.created_at DESC
            ");
            
            if ($stmt) {
                $stmt->bind_param("i", $id);
                if ($stmt->execute()) {
                    $reviews = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
                    $product['reviews'] = $reviews;
                    
                    // Calculate average rating
                    $totalRating = 0;
                    foreach ($reviews as $review) {
                        $totalRating += $review['rating'];
                    }
                    $product['rating'] = count($reviews) > 0 ? round($totalRating / count($reviews), 1) : 0;
                }
                $stmt->close();
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
    $conn->close();
}
?> 