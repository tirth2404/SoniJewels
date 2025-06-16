<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// TODO: Add your MetalpriceAPI key here
// Get your API key from https://metalpriceapi.com
$api_key = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
$symbol = 'XAU'; // Gold symbol
$currency = 'INR'; // Indian Rupees

$api_url = "https://api.metalpriceapi.com/v1/latest?api_key={$api_key}&base={$symbol}&currencies={$currency}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode([
        'success' => false,
        'message' => 'cURL Error: ' . curl_error($ch)
    ]);
    exit;
}

curl_close($ch);

$data = json_decode($response, true);

// Extracting the gold price from MetalpriceAPI response
$goldPrice = null;
if (isset($data['rates']) && isset($data['rates']['INR'])) {
    // MetalpriceAPI returns price per base unit (1 XAU)
    $goldPrice = round($data['rates']['INR'], 2);
} else {
    // Log the full API response for debugging if price is not found
    error_log("MetalpriceAPI response: " . print_r($data, true));
}

if ($goldPrice) {
    echo json_encode([
        'success' => true,
        'price' => $goldPrice,
        'timestamp' => date('d/m/Y, H:i:s'),
        'message' => 'Gold price fetched successfully',
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to retrieve gold price from API. Please check if API key is set correctly.',
        'api_response' => $data // For debugging
    ]);
}

?> 