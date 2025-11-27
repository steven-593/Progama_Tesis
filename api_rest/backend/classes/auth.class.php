<?php
require_once "conexion.php";
require_once "respuestas.php";
class Auth extends Conexion
{
    public function login($json)
    {
        $_respuestas = new Respuestas;
        $datos = json_decode($json, true);

        if (!isset($datos['username']) || !isset($datos['password_hash'])) {
            return $_respuestas->error_400("Faltan credenciales");
        }
        $username = trim($datos['username']);
        $password_hash = sha1(trim($datos['password_hash']));
        $query = "SELECT * FROM administradores WHERE username = '$username' AND password_hash = '$password_hash' LIMIT 1;";
        $usuario = parent::obtenerDatos($query);
        if (!$usuario || count($usuario) == 0) {
            return $_respuestas->error_200("Usuario o contraseña incorrectos");
        }
        $user = $usuario[0];
        $token = $this->insertar_token($user['id']);
        if ($token) {
            $result = $_respuestas->response;
            $result['result'] = [
                "token" => $token,
                "user" => $user['username']
            ];
            return $result;
        } else {
            return $_respuestas->error_500("No se pudo generar el token");
        }
    }
    private function insertar_token($id_admin)
    {
        $valor = true;
        $token = bin2hex(openssl_random_pseudo_bytes(16, $valor));
        date_default_timezone_set('America/Guayaquil');
        $fecha = date("Y-m-d H:i:s");
        $query = "INSERT INTO tokens (token_g, fecha, activo, id_admin) 
                  VALUES ('$token', '$fecha', 1, '$id_admin');";
        $verifica = parent::nonQueryId($query);
        return $verifica ? $token : 0;
    }
}
?>
