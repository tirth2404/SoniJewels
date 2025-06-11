<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if it's a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

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

// Get product_id from query parameters
$product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : null;

if (!$product_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Product ID is required']);
    exit();
}

try {
    // Get reviews with user information
    $reviews_query = "
        SELECT r.*, u.Username, u.profilePicture 
        FROM reviews r 
        LEFT JOIN users u ON r.user_id = u.id 
        WHERE r.product_id = ? AND r.status = 'approved'
        ORDER BY r.created_at DESC
    ";
    
    $stmt = $conn->prepare($reviews_query);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->errorInfo()[2]);
    }
    
    $stmt->bindParam(1, $product_id, PDO::PARAM_INT);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->errorInfo()[2]);
    }
    
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the profile picture URL if it exists
    foreach ($reviews as &$row) {
        if ($row['profilePicture']) {
            $profilePath = $row['profilePicture'];

            // Remove "http://localhost" prefix if it's present from database storage
            if (strpos($profilePath, 'http://localhost') === 0) {
                $profilePath = substr($profilePath, strlen('http://localhost'));
            }
            
            // Normalize the path by replacing multiple slashes with a single slash
            // and removing any duplicated '/SoniJewels/server/uploads/' if it occurs
            $profilePath = preg_replace('~/{2,}|\/SoniJewels\/server\/uploads\/(?=\/SoniJewels\/server\/uploads\/profile\/)~i', '/', $profilePath);
            $profilePath = str_replace('\\', '/', $profilePath);

            // Ensure the path starts correctly for the frontend
            if (strpos($profilePath, '/SoniJewels/server/uploads/profile/') !== 0) {
                // This condition might be too aggressive, only if the path isn't already correct.
                // For now, let's assume the DB might contain it or not.
                // If path is just 'filename.jpg', prepend the full uploads path
                if (strpos($profilePath, 'profile/') === false) {
                    $profilePath = '/SoniJewels/server/uploads/profile/' . $profilePath;
                }
            }
            
            $row['profilePicture'] = $profilePath;
        }
    }
    
    // Get review statistics
    $stats_query = "
        SELECT 
            COUNT(*) as total_reviews,
            AVG(rating) as average_rating
        FROM reviews 
        WHERE product_id = ? AND status = 'approved'
    ";
    
    $stats_stmt = $conn->prepare($stats_query);
    if (!$stats_stmt) {
        throw new Exception("Prepare failed: " . $conn->errorInfo()[2]);
    }
    
    $stats_stmt->bindParam(1, $product_id, PDO::PARAM_INT);
    
    if (!$stats_stmt->execute()) {
        throw new Exception("Execute failed: " . $stats_stmt->errorInfo()[2]);
    }
    
    $stats = $stats_stmt->fetch(PDO::FETCH_ASSOC);
    
    // Ensure we have default values if no reviews
    $stats['total_reviews'] = intval($stats['total_reviews']);
    $stats['average_rating'] = $stats['average_rating'] ? floatval($stats['average_rating']) : 0;
    
    echo json_encode([
        'reviews' => $reviews,
        'stats' => $stats
    ]);
} catch (Exception $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch reviews. Please try again.']);
} finally {
    if (isset($conn)) {
        $conn = null;
    }
}
?> 