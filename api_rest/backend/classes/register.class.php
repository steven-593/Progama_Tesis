<?php
require_once "conexion.php";
require_once "respuestas.php";

class Register extends Conexion {

    public function crearUsuario($json) {
        $_respuestas = new Respuestas;
        $datos = json_decode($json, true);

        if (!isset($datos['username']) || !isset($datos['password_hash'])) {
            return $_respuestas->error_400("Faltan campos obligatorios");
        }

        $username = trim($datos['username']);
        $password_hash = sha1(trim($datos['password_hash']));

        // Verificar si existe
        $queryCheck = "SELECT * FROM administradores WHERE username = '$username'";
        $existe = parent::obtenerDatos($queryCheck);
        if ($existe && count($existe) > 0) {
            return $_respuestas->error_200("El usuario ya existe");
        }

        // Insertar
        $queryInsert = "INSERT INTO administradores (username, password_hash) VALUES ('$username', '$password_hash')";
        $idInsertado = parent::nonQueryId($queryInsert);

        if ($idInsertado > 0) {
            $respuesta = $_respuestas->response;
            $respuesta["result"] = [
                "message" => "Usuario creado correctamente",
                "user" => $username,
                "id" => $idInsertado
            ];
            return $respuesta;
        } else {
            return $_respuestas->error_500("Error al registrar usuario");
        }
    }
}
?>
