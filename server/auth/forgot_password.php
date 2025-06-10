<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // Use absolute path for database.php to avoid include path issues
    require_once 'C:/xampp/htdocs/SoniJewels/server/config/database.php';
    require_once '../vendor/autoload.php'; // For PHPMailer

    // Debugging: Log PHP's default timezone
    error_log("Forgot Password: PHP Default Timezone: " . date_default_timezone_get(), 0);

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    // Initialize Database connection
    $database = new Database();
    $db = $database->getConnection();

    if ($db) {
        // Set MySQL session timezone to match PHP's timezone
        $db->exec("SET time_zone = '+01:00'"); // Europe/Berlin is typically UTC+1, or UTC+2 during DST
        error_log("Forgot Password: MySQL session timezone set to +01:00.", 0);
    }

    if (!$db) {
        http_response_code(500);
        echo json_encode(array("message" => "Database connection failed."));
        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"));

        if (empty($data->email)) {
            http_response_code(400);
            echo json_encode(array("message" => "Email is required."));
            exit();
        }

        $email = $data->email;

        // Check if email exists
        $query = "SELECT id FROM users WHERE email = :email LIMIT 0,1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $user_id = $row['id'];

            // Generate a unique token
            $token = bin2hex(random_bytes(32)); // 64 character hex string
            $expires = date('Y-m-d H:i:s', strtotime('+1 hour')); // Token valid for 1 hour

            // Store token in database
            // Assuming you have a password_resets table: id, user_id, token, expires_at
            $insertQuery = "INSERT INTO password_resets (user_id, token, expires_at) VALUES (:user_id, :token, :expires)";
            $insertStmt = $db->prepare($insertQuery);
            $insertStmt->bindParam(':user_id', $user_id);
            $insertStmt->bindParam(':token', $token);
            $insertStmt->bindParam(':expires', $expires);

            if ($insertStmt->execute()) {
                // Send email
                $mail = new PHPMailer(true);
                try {
                    //Server settings (UPDATE THESE WITH YOUR EMAIL INFO)
                    $mail->isSMTP();
                    $mail->Host       = 'smtp.gmail.com'; // Your SMTP server
                    $mail->SMTPAuth   = true;
                    $mail->Username   = ''; // Your sending email address
                    $mail->Password   = ''; // Your App Password (for Gmail) or email password
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Use ENCRYPTION_SMTPS for port 465, ENCRYPTION_STARTTLS for port 587
                    $mail->Port       = 587; // Usually 587 for STARTTLS, 465 for SMTPS

                    //Recipients
                    $mail->setFrom('', 'SoniJewels'); // Your sender email and name
                    $mail->addAddress($email);

                    // Content
                    $mail->isHTML(true);
                    $mail->Subject = 'Password Reset Request';
                    $resetLink = "http://localhost:5173/reset-password?token=" . $token; // Frontend reset page URL
                    $mail->Body    = 'Click <a href="' . $resetLink . '">here</a> to reset your password. This link is valid for 1 hour.';
                    $mail->AltBody = 'Please copy and paste the following link into your browser to reset your password: ' . $resetLink;

                    $mail->send();
                    http_response_code(200);
                    echo json_encode(array("message" => "Password reset link sent to your email."));
                } catch (Exception $e) {
                    http_response_code(500);
                    error_log("Mailer Error: {$mail->ErrorInfo}", 0); // Log Mailer errors
                    echo json_encode(array("message" => "Message could not be sent. Please check server logs."));
                }
            } else {
                http_response_code(500);
                error_log("Could not create reset token in database.", 0);
                echo json_encode(array("message" => "Could not create reset token."));
            }
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Email not found."));
        }
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Method Not Allowed."));
    }