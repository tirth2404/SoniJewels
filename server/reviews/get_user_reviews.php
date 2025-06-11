<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

// Database connection
try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Check connection
    if (!$conn) {
        throw new Exception("Database connection failed.");
    }
} catch (Exception $e) {
    error_log("Database connection error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed. Please check server configuration.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['user_id'])) {
        echo json_encode(['error' => 'User ID is required']);
        exit;
    }

    $user_id = intval($_GET['user_id']);
    
    try {
        // Get reviews with product information
        $query = "
            SELECT r.*, p.name as product_name, p.images as product_images, u.Username, u.profilePicture 
            FROM reviews r 
            LEFT JOIN products p ON r.product_id = p.id 
            LEFT JOIN users u ON r.user_id = u.id 
            WHERE r.user_id = ? 
            ORDER BY r.created_at DESC
        ";
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->errorInfo()[2]);
        }
        
        $stmt->bindParam(1, $user_id, PDO::PARAM_INT);
        
        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->errorInfo()[2]);
        }
        
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format the product image URL and profile picture URL if they exist
        foreach ($reviews as &$row) {
            if ($row['product_images']) {
                // Since images are stored as JSON array, get the first image
                $images = json_decode($row['product_images'], true);
                
                if ($images && is_array($images) && count($images) > 0) {
                    // Get the first image and ensure it's properly formatted
                    $imagePath = $images[0];
                    // Remove any leading slashes or backslashes and the base path if it exists
                    $imagePath = ltrim($imagePath, '/\\');
                    $imagePath = str_replace('SoniJewels/server/uploads/products/', '', $imagePath);
                    // Construct the full path
                    $row['product_image'] = '/SoniJewels/server/uploads/products/' . $imagePath;
                } else {
                    $row['product_image'] = null;
                }
            }

            // Format the profile picture URL
            if ($row['profilePicture']) {
                $profilePath = ltrim($row['profilePicture'], '/\\');
                $profilePath = str_replace('SoniJewels/server/uploads/profile/', '', $profilePath);
                $row['profilePicture'] = '/SoniJewels/server/uploads/profile/' . $profilePath;
            }
        }
        
        echo json_encode([
            'status' => 'success',
            'reviews' => $reviews
        ]);
        
    } catch (Exception $e) {
        error_log("Database error: " . $e->getMessage());
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch reviews: ' . $e->getMessage()
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