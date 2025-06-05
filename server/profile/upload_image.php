<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!isset($_FILES['image'])) {
            throw new Exception('No image uploaded');
        }

        $file = $_FILES['image'];
        
        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Upload failed with error code: ' . $file['error']);
        }

        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mimeType, $allowedTypes)) {
            throw new Exception('Invalid file type. Allowed types: JPG, PNG, GIF');
        }

        // Validate file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            throw new Exception('File size too large. Maximum size is 5MB');
        }

        // Create upload directory if it doesn't exist
        $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/SoniJewels/server/uploads/profile/';
        error_log('Upload directory path: ' . $uploadDir);
        
        if (!file_exists($uploadDir)) {
            error_log('Creating upload directory: ' . $uploadDir);
            if (!mkdir($uploadDir, 0777, true)) {
                throw new Exception('Failed to create upload directory: ' . $uploadDir);
            }
        }

        // Check directory permissions
        if (!is_writable($uploadDir)) {
            throw new Exception('Upload directory is not writable: ' . $uploadDir);
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = uniqid() . '_' . time() . '.' . $extension;
        $targetPath = $uploadDir . $fileName;

        error_log('Attempting to move file to: ' . $targetPath);
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            $uploadError = error_get_last();
            throw new Exception('Failed to move uploaded file. Error: ' . ($uploadError ? $uploadError['message'] : 'Unknown error'));
        }

        // Verify file was actually moved
        if (!file_exists($targetPath)) {
            throw new Exception('File was not successfully moved to target location');
        }

        // Return success response with the image URL
        $imageUrl = '/SoniJewels/server/uploads/profile/' . $fileName;
        
        // Debug log
        error_log('Upload successful. Image URL: ' . $imageUrl);
        error_log('Full server path: ' . $targetPath);
        
        echo json_encode([
            'status' => 'success',
            'imageUrl' => $imageUrl
        ]);

    } catch (Exception $e) {
        error_log('Image upload error: ' . $e->getMessage());
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method'
    ]);
}
?> 