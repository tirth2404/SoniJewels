<?php
// Start output buffering
ob_start();

// Error handling setup
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Database configuration
$host = 'localhost';
$dbname = 'sonijewels';
$username = 'root';
$password = '';

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4
$conn->set_charset("utf8mb4");

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Test database connection
try {
    $test = $conn->query("SELECT 1");
    if (!$test) {
        throw new Exception("Database connection test failed");
    }
} catch (Exception $e) {
    die("Database connection error: " . $e->getMessage());
}
?> 