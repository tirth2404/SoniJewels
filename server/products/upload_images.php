<?php
require_once '../config/database.php';

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Check if files were uploaded
        if (!isset($_FILES['images'])) {
            throw new Exception('No images uploaded');
        }

        $uploadedFiles = $_FILES['images'];
        $uploadedUrls = [];
        $errors = [];

        // Create uploads directory if it doesn't exist
        $uploadDir = '../uploads/products/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Process each uploaded file
        foreach ($uploadedFiles['tmp_name'] as $key => $tmp_name) {
            if ($uploadedFiles['error'][$key] === UPLOAD_ERR_OK) {
                $fileName = $uploadedFiles['name'][$key];
                $fileType = $uploadedFiles['type'][$key];
                
                // Validate file type
                $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (!in_array($fileType, $allowedTypes)) {
                    $errors[] = "Invalid file type for $fileName. Only JPG, PNG, and WebP are allowed.";
                    continue;
                }

                // Generate unique filename
                $extension = pathinfo($fileName, PATHINFO_EXTENSION);
                $newFileName = uniqid() . '.' . $extension;
                $targetPath = $uploadDir . $newFileName;

                // Move uploaded file
                if (move_uploaded_file($tmp_name, $targetPath)) {
                    // Generate URL for the uploaded file
                    $fileUrl = '/SoniJewels/server/uploads/products/' . $newFileName;
                    $uploadedUrls[] = $fileUrl;
                } else {
                    $errors[] = "Failed to move uploaded file: $fileName";
                }
            } else {
                $errors[] = "Error uploading file: " . $uploadedFiles['name'][$key];
            }
        }

        if (empty($uploadedUrls)) {
            throw new Exception('No files were successfully uploaded');
        }

        echo json_encode([
            'status' => 'success',
            'data' => [
                'urls' => $uploadedUrls,
                'errors' => $errors
            ]
        ]);

    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method'
    ]);
}
?> 