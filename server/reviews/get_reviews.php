<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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
    $conn = new mysqli("localhost", "root", "", "Sonijewels");
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
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
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("i", $product_id);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $reviews = [];
    
    while ($row = $result->fetch_assoc()) {
        // Format the profile picture URL if it exists
        if ($row['profilePicture']) {
            // Remove any leading slashes or backslashes and the base path if it exists
            $profilePath = ltrim($row['profilePicture'], '/\\');
            $profilePath = str_replace('SoniJewels/server/uploads/profile/', '', $profilePath);
            // Construct the full path
            $row['profilePicture'] = '/SoniJewels/server/uploads/profile/' . $profilePath;
        }
        $reviews[] = $row;
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
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stats_stmt->bind_param("i", $product_id);
    
    if (!$stats_stmt->execute()) {
        throw new Exception("Execute failed: " . $stats_stmt->error);
    }
    
    $stats_result = $stats_stmt->get_result();
    $stats = $stats_result->fetch_assoc();
    
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
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($stats_stmt)) {
        $stats_stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?> 