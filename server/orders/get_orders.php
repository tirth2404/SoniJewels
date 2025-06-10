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
        // Check database connection
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        // Prepare and execute query to fetch all orders with user details
        $stmt = $conn->prepare("
            SELECT 
                o.id, o.First_name, o.Last_name, o.Email, o.Address, o.City, o.State, o.Zip_code, o.Country, 
                o.order_date, o.total, o.status, 
                u.Username, u.phone 
            FROM 
                orders o
            LEFT JOIN 
                users u ON o.user_id = u.id
            ORDER BY 
                o.id DESC
        ");
        if (!$stmt) {
            throw new Exception("Failed to prepare query: " . $conn->error);
        }

        if (!$stmt->execute()) {    
            throw new Exception("Failed to execute query: " . $stmt->error);
        }

        $result = $stmt->get_result();
        $orders = [];

        while ($row = $result->fetch_assoc()) {
            $order = $row;
            $order_id = $order['id'];

            // Fetch order items for each order
            $stmt_items = $conn->prepare("
                SELECT 
                    oi.quantity, oi.price_at_purchase, 
                    p.name AS product_name, p.images AS product_image_url 
                FROM 
                    order_items oi
                JOIN 
                    products p ON oi.product_id = p.id
                WHERE 
                    oi.order_id = ?
            ");
            $stmt_items->bind_param("i", $order_id);
            $stmt_items->execute();
            $items_result = $stmt_items->get_result();
            $order_items = [];
            while ($item_row = $items_result->fetch_assoc()) {
                $order_items[] = $item_row;
            }
            $stmt_items->close();
            
            $order['items'] = $order_items;
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
    $conn->close();
}
?> 