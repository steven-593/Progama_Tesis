<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../classes/usuarios.class.php';
require_once '../classes/respuestas.php';

$_usuarios = new Usuarios();
$_respuestas = new Respuestas();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($_usuarios->listarUsuarios());
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postBody = file_get_contents("php://input");
    $datos = json_decode($postBody, true);
    $resultado = $_usuarios->insertarUsuario($datos);
    echo json_encode($resultado);
    http_response_code(201);
    exit;
}

// ✅ PUT - Actualizar usuario
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $putBody = file_get_contents("php://input");
    $datos = json_decode($putBody, true);
    $resultado = $_usuarios->actualizarUsuario($datos);
    echo json_encode($resultado);
    http_response_code(200);
    exit;
}

// ✅ DELETE - Eliminar usuario
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isset($_GET['id'])) {
        echo json_encode(["status" => "error", "message" => "Falta el ID del usuario"]);
        http_response_code(400);
        exit;
    }

    $id = $_GET['id'];
    $resultado = $_usuarios->eliminarUsuario($id);
    echo json_encode($resultado);
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

http_response_code(405);
echo json_encode($_respuestas->error_405());
?>
