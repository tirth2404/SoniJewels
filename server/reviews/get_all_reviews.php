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

try {
    // Get all reviews with user and product information
    $reviews_query = "
        SELECT r.*, u.Username, u.profilePicture, p.name as product_name
        FROM reviews r 
        LEFT JOIN users u ON r.user_id = u.id 
        LEFT JOIN products p ON r.product_id = p.id
        ORDER BY r.created_at DESC
    ";
    
    $stmt = $conn->prepare($reviews_query);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->errorInfo()[2]);
    }
    
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
                if (strpos($profilePath, 'profile/') === 0) { // Check if it starts with 'profile/' without the full path
                     $profilePath = '/SoniJewels/server/uploads/' . $profilePath; // Prepend base uploads path
                } else if (strpos($profilePath, 'uploads/') === 0) { // If it starts with 'uploads/'
                     $profilePath = '/SoniJewels/server/' . $profilePath; // Prepend base server path
                } else { // Assume it's just the filename, prepend full path
                     $profilePath = '/SoniJewels/server/uploads/profile/' . $profilePath;
                }
            }
            
            $row['profilePicture'] = $profilePath;
        }
    }
    
    echo json_encode(['reviews' => $reviews]);
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