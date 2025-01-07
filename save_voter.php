<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "chainelect";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $voterId = $_POST['voter_id'];
    $metamaskId = $_POST['metamask_id'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hash the password for security
    $image = $_FILES['image']['tmp_name'];

    // Read image file as binary data
    $imageData = file_get_contents($image);

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO voters (voter_id, metamask_id, password, image) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $voterId, $metamaskId, $password, $imageData);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Voter registered successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to register voter."]);
    }

    $stmt->close();
}

$conn->close();
?>
