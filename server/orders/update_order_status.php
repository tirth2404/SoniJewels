<?php
require_once '../config/database.php';

// Set headers for CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $data = json_decode(file_get_contents('php://input'), true);

    $orderId = $data['orderId'] ?? null;
    $newStatus = $data['newStatus'] ?? null;

    if (!$orderId || !$newStatus) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing orderId or newStatus']);
        exit();
    }

    try {
        $database = new Database();
        $conn = $database->getConnection();
        if (!$conn) {
            throw new Exception("Database connection failed.");
        }

        // Prepare and execute the update query
        $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->errorInfo()[2]);
        }

        $stmt->bindParam(1, $newStatus, PDO::PARAM_STR);
        $stmt->bindParam(2, $orderId, PDO::PARAM_INT);

        if (!$stmt->execute()) {
            throw new Exception("Failed to execute statement: " . $stmt->errorInfo()[2]);
        }

        if ($stmt->rowCount() > 0) {
            // Insert into order_timeline table
            $stmt_timeline = $conn->prepare("INSERT INTO order_timeline (order_id, status_changed_to) VALUES (?, ?)");
            if ($stmt_timeline) {
                $stmt_timeline->bindParam(1, $orderId, PDO::PARAM_INT);
                $stmt_timeline->bindParam(2, $newStatus, PDO::PARAM_STR);
                $stmt_timeline->execute();
            } else {
                error_log("Failed to prepare timeline insert statement: " . $conn->errorInfo()[2]);
            }
            echo json_encode(['status' => 'success', 'message' => 'Order status updated successfully.']);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Order not found or status already the same.']);
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    } finally {
        if (isset($conn)) {
            $conn = null; // Close PDO connection by setting to null
        }
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method: ' . $_SERVER['REQUEST_METHOD']]);
}
?> 