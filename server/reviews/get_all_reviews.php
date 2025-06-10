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
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $reviews = [];
    
    while ($row = $result->fetch_assoc()) {
        // Format the profile picture URL if it exists
        if ($row['profilePicture']) {
            $row['profilePicture'] = 'http://localhost/SoniJewels/server/uploads/' . $row['profilePicture'];
        }
        $reviews[] = $row;
    }
    
    echo json_encode(['reviews' => $reviews]);
} catch (Exception $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch reviews. Please try again.']);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?> 