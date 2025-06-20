<?php
require_once '../config/database.php';

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $database = new Database();
        $conn = $database->getConnection();
        // Check database connection
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        $userId = $_GET['user_id'] ?? null; // Get user_id from query parameter

        // Prepare and execute query to fetch all orders with user details
        $sql = "
            SELECT 
                o.id, o.First_name, o.Last_name, o.Email, o.Address, o.City, o.State, o.Zip_code, o.Country, 
                o.order_date, o.total, o.status, o.shipping_method, o.payment_method, o.payment_last4, 
                u.Username, u.phone 
            FROM 
                orders o
            LEFT JOIN 
                users u ON o.user_id = u.id
        ";

        if ($userId) {
            $sql .= " WHERE o.user_id = ?";
        }

        $sql .= " ORDER BY o.id DESC";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Failed to prepare query: " . $conn->error);
        }

        if ($userId) {
            $stmt->bindParam(1, $userId, PDO::PARAM_INT);
        }

        if (!$stmt->execute()) {    
            throw new Exception("Failed to execute query: " . $stmt->errorInfo()[2]);
        }

        $orders = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $order = $row;
            $order_id = $order['id'];

            // Fetch order items for each order
            $stmt_items = $conn->prepare("
                SELECT 
                    oi.quantity, oi.price_at_purchase, 
                    p.name AS product_name, p.images AS product_images_json 
                FROM 
                    order_items oi
                JOIN 
                    products p ON oi.product_id = p.id
                WHERE 
                    oi.order_id = ?
            ");
            $stmt_items->bindParam(1, $order_id, PDO::PARAM_INT);
            $stmt_items->execute();
            $order_items = [];
            while ($item_row = $stmt_items->fetch(PDO::FETCH_ASSOC)) {
                error_log("Original product_images_json: " . $item_row['product_images_json']);
                // Decode the JSON string for images and take the first one
                $images_array = json_decode($item_row['product_images_json'], true);
                error_log("Decoded images_array: " . print_r($images_array, true));

                $item_row['product_image_url'] = !empty($images_array) ? $images_array[0] : null;
                error_log("Assigned product_image_url: " . $item_row['product_image_url']);

                unset($item_row['product_images_json']); // Remove the raw JSON key
                $order_items[] = $item_row;
            }
            
            $order['items'] = $order_items;

            // Fetch order timeline events for each order
            $stmt_timeline = $conn->prepare("
                SELECT 
                    status_changed_to, timestamp 
                FROM 
                    order_timeline 
                WHERE 
                    order_id = ? 
                ORDER BY 
                    timestamp ASC
            ");
            if ($stmt_timeline) {
                $stmt_timeline->bindParam(1, $order_id, PDO::PARAM_INT);
                $stmt_timeline->execute();
                $order_timeline = [];
                while ($timeline_row = $stmt_timeline->fetch(PDO::FETCH_ASSOC)) {
                    $order_timeline[] = $timeline_row;
                }
                
            } else {
                error_log("Failed to prepare timeline query: " . $conn->error);
                $order_timeline = []; // Ensure it's an empty array on error
            }
            
            $order['timeline'] = $order_timeline;
            $orders[] = $order;
        }

        // Send success response
        echo json_encode([
            'status' => 'success',
            'data' => $orders
        ]);

    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method: ' . $_SERVER['REQUEST_METHOD']
    ]);
}

if (isset($conn)) {
    $conn = null; // Close PDO connection by setting to null
}
?> 