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
    if (!isset($data['username']) || !isset($data['email'])) {
        echo json_encode(['status' => 'error', 'message' => 'Username and email are required']);
        exit;
    }
    
    try {
        // Prepare the update query
        $query = "UPDATE users SET 
                  Username = ?,
                  Email = ?,
                  phone = ?,
                  profilePicture = ?,
                  gender = ?,
                  dob = ?
                  WHERE id = ?";
                  
        $stmt = $conn->prepare($query);
        
        // Bind parameters
        $stmt->bind_param("ssssssi", 
            $data['username'],
            $data['email'],
            $data['phone'],
            $data['profilePicture'],
            $data['gender'],
            $data['dob'],
            $data['id']
        );
        
        if ($stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'data' => $data
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to update profile'
            ]);
        }
        
    } catch (Exception $e) {
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
    $conn->close();
}
?> 