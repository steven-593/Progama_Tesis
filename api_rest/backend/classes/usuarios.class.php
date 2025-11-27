<?php
require_once __DIR__ . '/../classes/conexion.php';
require_once __DIR__ . '/respuestas.php';

class Usuarios extends Conexion {

    public function listarUsuarios() {
        $query = "SELECT id_usuario, nombre, email, telefono, rol, estado FROM usuarios";
        return parent::obtenerDatos($query);
    }

    public function insertarUsuario($datos) {
        if (!isset($datos['nombre']) || !isset($datos['email'])) {
            return ["status" => "error", "message" => "Faltan campos obligatorios"];
        }

        $nombre = $datos['nombre'];
        $email = $datos['email'];
        $telefono = $datos['telefono'] ?? '';
        $rol = $datos['rol'] ?? 'Usuario';
        $estado = $datos['estado'] ?? 'active';

        $query = "INSERT INTO usuarios (nombre, email, telefono, rol, estado)
                  VALUES ('$nombre', '$email', '$telefono', '$rol', '$estado')";

        $resp = parent::nonQueryId($query);
        if ($resp > 0) {
            return ["status" => "ok", "id" => $resp];
        } else {
            return ["status" => "error", "message" => "No se pudo insertar el usuario"];
        }
    }

    // ✅ Nuevo método para actualizar usuario
    public function actualizarUsuario($datos) {
        if (!isset($datos['id_usuario'])) {
            return ["status" => "error", "message" => "Falta el ID del usuario"];
        }

        $id = $datos['id_usuario'];
        $nombre = $datos['nombre'] ?? '';
        $email = $datos['email'] ?? '';
        $telefono = $datos['telefono'] ?? '';
        $rol = $datos['rol'] ?? 'Usuario';
        $estado = $datos['estado'] ?? 'active';

        $query = "UPDATE usuarios 
                  SET nombre = '$nombre', email = '$email', telefono = '$telefono', rol = '$rol', estado = '$estado'
                  WHERE id_usuario = $id";

        $resp = parent::nonQuery($query);
        if ($resp >= 0) {
            return ["status" => "ok", "message" => "Usuario actualizado"];
        } else {
            return ["status" => "error", "message" => "No se pudo actualizar el usuario"];
        }
    }

    // ✅ Nuevo método para eliminar usuario
    public function eliminarUsuario($id) {
        if (!isset($id)) {
            return ["status" => "error", "message" => "Falta el ID del usuario"];
        }

        $query = "DELETE FROM usuarios WHERE id_usuario = $id";
        $resp = parent::nonQuery($query);

        if ($resp > 0) {
            return ["status" => "ok", "message" => "Usuario eliminado"];
        } else {
            return ["status" => "error", "message" => "No se pudo eliminar el usuario"];
        }
    }
}
?>
