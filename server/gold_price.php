<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// IMPORTANT: Replace with your actual API key from MetalpriceAPI.com
// You need to register at https://metalpriceapi.com/gold to get your API key.
$api_key = 'f230e10bf15d32697361b2494565e1a8';
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
    // MetalpriceAPI returns price per base unit (e.g., 1 XAU). Assuming this is per troy ounce.
    // If you need price per gram, you would need to convert it (1 troy ounce = 31.1035 grams).
    // For now, let's display the price per troy ounce in INR.
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
        'message' => 'Failed to retrieve gold price from API. Check API key and response structure.',
        'api_response' => $data // For debugging
    ]);
}

?> 