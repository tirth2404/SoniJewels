<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sonijewels";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);
error_log("add_order.php received data: " . print_r($data, true)); // Log incoming data

// Get total, user_id, and items from posted data
$total = $data['total'] ?? 0.00;
$userId = $data['user_id'] ?? null; // Get user_id
$items = $data['items'] ?? []; // Get items array

// Get shipping and payment details
$shippingMethod = $data['shipping_method'] ?? null;
$paymentMethod = $data['payment_method'] ?? null;
$paymentLast4 = $data['payment_last4'] ?? null;

// You can use either user_id or username to fetch the email
// Note: user_identifier is no longer strictly needed if user_id is directly available
$user_identifier = $userId; // Use userId directly

if (!$user_identifier) {
    http_response_code(400);
    echo json_encode(["error" => "User identifier is required"]);
    exit();
}

// Fetch email from users table
if (isset($data['user_id'])) {
    $stmt = $conn->prepare("SELECT Email FROM users WHERE id = ?");
    $stmt->bind_param("i", $data['user_id']);
} else {
    $stmt = $conn->prepare("SELECT Email FROM users WHERE Username = ?");
    $stmt->bind_param("s", $data['username']);
}
$stmt->execute();
$stmt->bind_result($email);
$stmt->fetch();
$stmt->close();

if (!$email) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit();
}

// Prepare order insert to include total, user_id, shipping and payment details
$stmt = $conn->prepare("INSERT INTO orders (First_name, Last_name, Email, Address, City, State, Zip_code, Country, total, user_id, shipping_method, payment_method, payment_last4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    error_log("add_order.php prepare error: " . $conn->error); // Log prepare error
    throw new Exception("Failed to prepare statement: " . $conn->error);
}
$stmt->bind_param(
    "ssssssisdisss", // Corrected: 's' for string (payment_last4)
    $data['First_name'],
    $data['Last_name'],
    $email,
    $data['Address'],
    $data['City'],
    $data['State'],
    $data['Zip_code'],
    $data['Country'],
    $total,
    $userId,
    $shippingMethod,
    $paymentMethod,
    $paymentLast4
);

if ($stmt->execute()) {
    error_log("Order inserted successfully. Order ID: " . $stmt->insert_id); // Log successful insert
    $order_id = $stmt->insert_id;

    // Insert order items
    if (!empty($items)) {
        $stmt_items = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)");
        if (!$stmt_items) {
            error_log("add_order.php order_items prepare error: " . $conn->error); // Log order items prepare error
            throw new Exception("Failed to prepare order_items statement: " . $conn->error);
        }
        foreach ($items as $item) {
            $product_id = $item['id'] ?? null;
            $quantity = $item['quantity'] ?? null;
            $price_at_purchase = $item['price'] ?? null;

            if ($product_id && $quantity && $price_at_purchase !== null) {
                $stmt_items->bind_param("iiid", $order_id, $product_id, $quantity, $price_at_purchase);
                $stmt_items->execute();
            } else {
                // Log or handle error if item data is incomplete
                error_log("Incomplete item data for order_id: " . $order_id . " - " . json_encode($item));
            }
        }
        $stmt_items->close();
    }

    echo json_encode(["success" => true, "order_id" => $order_id]);
} else {
    error_log("add_order.php execute error: " . $stmt->error); // Log execute error
    http_response_code(500);
    echo json_encode(["error" => "Failed to place order"]);
}

$stmt->close();
$conn->close();
?> 