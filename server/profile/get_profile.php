<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = isset($_GET['id']) ? $_GET['id'] : null;
    
    // Debug log
    error_log("Received request for user ID: " . $userId);
    
    if (!$userId) {
        echo json_encode(['status' => 'error', 'message' => 'User ID is required']);
        exit;
    }
    
    try {
        $query = "SELECT id, Username, Email, phone, profilePicture, gender, dob FROM users WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Debug log
        error_log("Query executed. Number of rows: " . $result->num_rows);
        
        if ($result->num_rows > 0) {
            $userData = $result->fetch_assoc();
            
            // Debug log
            error_log("User data found: " . json_encode($userData));
            
            // Map database column names to frontend field names
            $userData['username'] = $userData['Username'];
            $userData['email'] = $userData['Email'];
            unset($userData['Username']);
            unset($userData['Email']);
            
            // Set empty values for optional fields if they're null
            $userData['phone'] = $userData['phone'] ?? '';
            $userData['profilePicture'] = $userData['profilePicture'] ?? '';
            $userData['gender'] = $userData['gender'] ?? '';
            $userData['dob'] = $userData['dob'] ?? '';
            
            echo json_encode([
                'status' => 'success',
                'data' => $userData
            ]);
        } else {
            error_log("No user found with ID: " . $userId);
            echo json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ]);
        }
        
    } catch (Exception $e) {
        error_log("Database error: " . $e->getMessage());
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