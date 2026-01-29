<?php
$host = "localhost";
$user = "towtruck";
$password = "towtruck@9999";
$dbname = "towtruck";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo 'db connected successfull';
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>