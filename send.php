<?php
$servername = "localhost";
$username = "root";
$password = "";
$db_name = "Feedback"; // ✅ corrected spelling

$conn = mysqli_connect($servername, $username, $password, $db_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$user = $_POST["username"];
$email = $_POST["email"];
$message = $_POST["message"];

// ✅ Use prepared statements to avoid SQL injection
$stmt = $conn->prepare("INSERT INTO Greetings (username, email, message) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $user, $email, $message);

if ($stmt->execute()) {
    echo "Data added successfully!";
} else {
    echo "Something went wrong: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
