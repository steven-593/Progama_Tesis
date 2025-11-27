<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once '../classes/auth.class.php';
require_once '../classes/respuestas.php';
$_auth = new Auth;
$_respuestas = new Respuestas;
if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $postBody = file_get_contents("php://input");

    $datosArray = $_auth->login($postBody);

    header('Content-Type: application/json');
    echo json_encode($datosArray, JSON_UNESCAPED_UNICODE);

} else {
    header('Content-Type: application/json');
    echo json_encode($_respuestas->error_405(), JSON_UNESCAPED_UNICODE);
}
?>
