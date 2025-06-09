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
    global $conn;
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
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user || !password_verify($oldPassword, $user['password'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid old password.']);
        $stmt->close();
        $conn->close();
        exit();
    }
    $stmt->close();

    // Hash the new password
    $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update password in the database
    $stmt = $conn->prepare('UPDATE users SET password = ? WHERE id = ?');
    $stmt->bind_param('si', $hashedNewPassword, $userId);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Password updated successfully.']);
        } else {
            http_response_code(200);
            echo json_encode(['status' => 'error', 'message' => 'Password is the same as before. No changes made.']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to update password: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();

} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?> 