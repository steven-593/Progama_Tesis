<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once '../classes/conexion.php';
require_once '../classes/respuestas.php';

$_respuestas = new Respuestas;
$db = new Conexion;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postBody = file_get_contents("php://input");
    $data = json_decode($postBody, true);

    if (!isset($data['email']) || !isset($data['provider'])) {
        echo json_encode($_respuestas->error_400("Faltan campos requeridos"));
        exit;
    }

    $email = $data['email'];
    $provider = $data['provider']; // google, facebook, twitter

    // Buscar usuario
    $query = "SELECT id, email FROM usuarios WHERE email = '$email'";
    $result = $db->obtenerDatos($query);

    if ($result) {
        $token = sha1(uniqid(rand(), true));
        echo json_encode([
            "status" => "ok",
            "result" => [
                "token" => $token,
                "user" => $email,
                "login_method" => $provider
            ]
        ]);
    } else {
        $insert = "INSERT INTO usuarios (email, provider) VALUES ('$email', '$provider')";
        $insertResult = $db->nonQuery($insert);

        if ($insertResult > 0) {
            $token = sha1(uniqid(rand(), true));
            echo json_encode([
                "status" => "ok",
                "result" => [
                    "token" => $token,
                    "user" => $email,
                    "login_method" => $provider,
                    "new_user" => true
                ]
            ]);
        } else {
            echo json_encode($_respuestas->error_500("Error al crear usuario social"));
        }
    }
} else {
    echo json_encode($_respuestas->error_405());
}
?>
