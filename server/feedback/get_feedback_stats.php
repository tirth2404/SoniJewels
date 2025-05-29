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
    // Get total feedback count
    $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM feedback");
    if (!$countStmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    if (!$countStmt->execute()) {
        throw new Exception("Execute failed: " . $countStmt->error);
    }
    
    $totalCount = $countStmt->get_result()->fetch_assoc()['total'];
    
    // Get average rating
    $avgStmt = $conn->prepare("SELECT AVG(rating) as average FROM feedback");
    if (!$avgStmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    if (!$avgStmt->execute()) {
        throw new Exception("Execute failed: " . $avgStmt->error);
    }
    
    $averageRating = round($avgStmt->get_result()->fetch_assoc()['average'], 1);
    
    // Get rating distribution
    $distStmt = $conn->prepare("
        SELECT rating, COUNT(*) as count 
        FROM feedback 
        GROUP BY rating 
        ORDER BY rating
    ");
    if (!$distStmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    if (!$distStmt->execute()) {
        throw new Exception("Execute failed: " . $distStmt->error);
    }
    
    $result = $distStmt->get_result();
    $distribution = [];
    
    while ($row = $result->fetch_assoc()) {
        $distribution[$row['rating']] = $row['count'];
    }
    
    // Fill in missing ratings with 0
    for ($i = 1; $i <= 5; $i++) {
        if (!isset($distribution[$i])) {
            $distribution[$i] = 0;
        }
    }
    
    echo json_encode([
        'total_feedback' => $totalCount,
        'average_rating' => $averageRating,
        'rating_distribution' => $distribution
    ]);
} catch (Exception $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to retrieve feedback statistics. Please try again.']);
} finally {
    if (isset($countStmt)) {
        $countStmt->close();
    }
    if (isset($avgStmt)) {
        $avgStmt->close();
    }
    if (isset($distStmt)) {
        $distStmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
