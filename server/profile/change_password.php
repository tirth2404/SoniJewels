<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../config/database.php';

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Remove global $conn;
    $database = new Database();
    $conn = $database->getConnection();

    if (!$conn) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);

    $userId = $data['userId'] ?? null;
    $oldPassword = $data['oldPassword'] ?? null;
    $newPassword = $data['newPassword'] ?? null;
    $confirmPassword = $data['confirmPassword'] ?? null;

    if (!$userId || !$oldPassword || !$newPassword || !$confirmPassword) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit();
    }

    if ($newPassword !== $confirmPassword) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'New password and confirm password do not match.']);
        exit();
    }

    // Validate new password strength
    if (strlen($newPassword) < 8 ||
        !preg_match("/[A-Z]/", $newPassword) ||
        !preg_match("/[a-z]/", $newPassword) ||
        !preg_match("/[0-9]/", $newPassword) ||
        !preg_match("/[^A-Za-z0-9]/", $newPassword)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'New password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.']);
        exit();
    }

    // Verify old password
    $stmt = $conn->prepare('SELECT password FROM users WHERE id = ?');
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement: ' . $conn->errorInfo()[2]]);
        exit();
    }
    $stmt->bindParam(1, $userId, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($oldPassword, $user['password'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid old password.']);
        exit();
    }

    // Hash the new password
    $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update password in the database
    $stmt = $conn->prepare('UPDATE users SET password = ? WHERE id = ?');
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement: ' . $conn->errorInfo()[2]]);
        exit();
    }
    $stmt->bindParam(1, $hashedNewPassword, PDO::PARAM_STR);
    $stmt->bindParam(2, $userId, PDO::PARAM_INT);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Password updated successfully.']);
        } else {
            http_response_code(200);
            echo json_encode(['status' => 'error', 'message' => 'Password is the same as before. No changes made.']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to update password: ' . $stmt->errorInfo()[2]]);
    }

} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}

// Ensure connection is closed by setting to null
if (isset($conn)) {
    $conn = null;
}
?> 