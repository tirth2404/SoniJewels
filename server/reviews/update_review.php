<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($data['review_id']) || !isset($data['rating']) || !isset($data['comment'])) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }
    
    try {
        // Prepare the update query
        $query = "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("isi", 
            $data['rating'],
            $data['comment'],
            $data['review_id']
        );
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows === 0) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Review not found or no changes made'
                ]);
            } else {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Review updated successfully'
                ]);
            }
        } else {
            throw new Exception("Execute failed: " . $stmt->error);
        }
        
    } catch (Exception $e) {
        error_log("Database error: " . $e->getMessage());
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update review: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method'
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?> 