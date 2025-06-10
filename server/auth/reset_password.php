<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    // Set MySQL session timezone to match PHP's timezone
    $db->exec("SET time_zone = '+01:00'"); // Europe/Berlin is typically UTC+1, or UTC+2 during DST
    error_log("ResetPassword: MySQL session timezone set to +01:00.", 0);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (empty($data->token) || empty($data->password)) {
        http_response_code(400);
        echo json_encode(array("message" => "Token and new password are required."));
        exit();
    }

    $token = $data->token;
    $newPassword = $data->password;

    error_log("ResetPassword: Received token: " . $token, 0);

    // Verify token and its expiration
    $query = "SELECT user_id, expires_at FROM password_resets WHERE token = :token AND expires_at > NOW() LIMIT 0,1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    error_log("ResetPassword: Current time (NOW()): " . date('Y-m-d H:i:s'), 0);
    error_log("ResetPassword: Query rowCount: " . $stmt->rowCount(), 0);

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $user_id = $row['user_id'];
        error_log("ResetPassword: Token found for user_id: " . $user_id . ", expires_at: " . $row['expires_at'], 0);

        // Hash new password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        // Update user's password
        $updateQuery = "UPDATE users SET password = :password WHERE id = :user_id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':password', $hashedPassword);
        $updateStmt->bindParam(':user_id', $user_id);

        if ($updateStmt->execute()) {
            // Invalidate the token
            $deleteQuery = "DELETE FROM password_resets WHERE token = :token";
            $deleteStmt = $db->prepare($deleteQuery);
            $deleteStmt->bindParam(':token', $token);
            $deleteStmt->execute();

            http_response_code(200);
            echo json_encode(array("message" => "Password has been reset successfully."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Could not update password."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid or expired token."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method Not Allowed."));
} 