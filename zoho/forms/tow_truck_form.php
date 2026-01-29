<?php
ob_start();
include 'db.php';
include '../access-token.php';

/* ---------------------------
   Helper Function
---------------------------- */
function cleanValue($value) {
    if (is_array($value)) {
        return implode(', ', array_map('trim', $value));
    }
    return trim($value ?? '');
}

/* ---------------------------
   Map Form Fields
---------------------------- */
function mapFormFields($formData) {
    return [
        'Last_Name' => cleanValue($formData['full_name'] ?? ''),
        'Phone' => cleanValue($formData['contact_number'] ?? ''),
        'Email' => cleanValue($formData['email'] ?? ''),
        'Company' => cleanValue($formData['company_name'] ?? ''),
        'Street' => cleanValue($formData['address'] ?? ''),
        'Coverage_Options' => cleanValue($formData['coverage_options'] ?? []),
        'Additional_Info' => cleanValue($formData['additional_info'] ?? ''),
        'Sum_Insured' => cleanValue($formData['truck_details'] ?? ''),
        'Product_Inquiry' => 'Tow Trucks Insurance',
        'Enquiry_Source' => 'Tow Trucks Insurance',
        'Sales_Team' => 'Shalin Shah - AR: 418137',
        'Service_Team' => 'Shalin Shah',
        'Layout' => [
            'name' => 'Website',
            'id' => '62950000001318018'
        ],
        'Owner' => [
            'name' => 'Shalin Shah',
            'id' => '62950000000229001',
            'email' => 'shalin@ilinkinsurance.com.au'
        ]
    ];
}

/* ---------------------------
   Insert Into Database
---------------------------- */
function insertDataIntoDatabase($data, $pdo) {
    try {
        $sql = "INSERT INTO towtruck_leads (
                    full_name,
                    company_name,
                    contact_number,
                    email,
                    address,
                    coverage_options,
                    additional_info,
                    sum_insured
                ) VALUES (
                    :full_name,
                    :company_name,
                    :contact_number,
                    :email,
                    :address,
                    :coverage_options,
                    :additional_info,
                    :sum_insured
                )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':full_name' => $data['Last_Name'],
            ':company_name' => $data['Company'],
            ':contact_number' => $data['Phone'],
            ':email' => $data['Email'],
            ':address' => $data['Street'],
            ':coverage_options' => $data['Coverage_Options'],
            ':additional_info' => $data['Additional_Info'],
            ':sum_insured' => $data['Sum_Insured']
        ]);

        return true;
    } catch (PDOException $e) {
        error_log("DB Error: " . $e->getMessage());
        return false;
    }
}

/* ---------------------------
   Send to Zoho
---------------------------- */
function addRecordToZoho($mappedData, $pdo) {

    getAccessToken($pdo);
    $accessToken = $_SESSION['access_token'] ?? null;

    if (!$accessToken) {
        error_log("Zoho token missing");
        return false;
    }

    $url = "https://www.zohoapis.com.au/crm/v2/Leads";

    $payload = json_encode([
        'data' => [$mappedData]
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => [
            "Authorization: Zoho-oauthtoken $accessToken",
            "Content-Type: application/json"
        ]
    ]);

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($status === 201);
}

/* ---------------------------
   MAIN LOGIC
---------------------------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $mappedData = mapFormFields($_POST);

    /* Email */
    $to = "info@ilinkinsurance.com.au, smartsolutions.designstudio@gmail.com";
    $subject = "New Tow Truck Insurance Lead";

    $message = "
    <h2>New Tow Truck Insurance Enquiry</h2>
    <table border='1' cellpadding='8'>
        <tr><th>Name</th><td>{$mappedData['Last_Name']}</td></tr>
        <tr><th>Company</th><td>{$mappedData['Company']}</td></tr>
        <tr><th>Phone</th><td>{$mappedData['Phone']}</td></tr>
        <tr><th>Email</th><td>{$mappedData['Email']}</td></tr>
        <tr><th>Address</th><td>{$mappedData['Street']}</td></tr>
        <tr><th>Coverage</th><td>{$mappedData['Coverage_Options']}</td></tr>
        <tr><th>Sum Insured</th><td>{$mappedData['Sum_Insured']}</td></tr>
        <tr><th>Notes</th><td>{$mappedData['Additional_Info']}</td></tr>
    </table>
    ";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= "From: Tow Truck Insurance <mail@towtruckinsurance.com.au>\r\n";

    mail($to, $subject, $message, $headers);

    if (insertDataIntoDatabase($mappedData, $pdo)) {
        addRecordToZoho($mappedData, $pdo);
        header("Location: https://towtrucksinsurance.com.au/thank.html");
        exit;
    }

    header("Location: /error.html");
    exit;
}
