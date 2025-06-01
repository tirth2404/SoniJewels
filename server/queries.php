<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = ""; // default for XAMPP
$dbname = "sonijewels";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed"]);
    exit();
}

$sql = "SELECT * FROM contact ORDER BY submitted_at DESC";
$result = $conn->query($sql);

$queries = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $queries[] = $row;
    }
}

$conn->close();
echo json_encode($queries);