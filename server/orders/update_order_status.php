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
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        // Prepare and execute the update query
        $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        $stmt->bind_param("si", $newStatus, $orderId);

        if (!$stmt->execute()) {
            throw new Exception("Failed to execute statement: " . $stmt->error);
        }

        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Order status updated successfully.']);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Order not found or status already the same.']);
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    } finally {
        if (isset($stmt)) {
            $stmt->close();
        }
        if (isset($conn)) {
            $conn->close();
        }
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method: ' . $_SERVER['REQUEST_METHOD']]);
}
?> 