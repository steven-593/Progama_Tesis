<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../classes/register.class.php';
require_once '../classes/respuestas.php';

$_register = new Register;
$_respuestas = new Respuestas;

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $postBody = file_get_contents("php://input");
    $datosArray = $_register->crearUsuario($postBody);

    // ✅ Auto-login inmediato si el registro fue exitoso
    if (isset($datosArray['status']) && $datosArray['status'] === "ok") {
        $email = json_decode($postBody, true)['username'] ?? null;

        if ($email) {
            $token = sha1(uniqid(rand(), true));
            $datosArray['result'] = [
                "token" => $token,
                "user" => $email,
                "message" => "Cuenta creada y sesión iniciada automáticamente."
            ];
        }
    }

    header('Content-Type: application/json');
    echo json_encode($datosArray, JSON_UNESCAPED_UNICODE);
} else {
    header('Content-Type: application/json');
    echo json_encode($_respuestas->error_405(), JSON_UNESCAPED_UNICODE);
}
?>
