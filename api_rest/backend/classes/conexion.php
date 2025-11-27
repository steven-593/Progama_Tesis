<?php
class Conexion
{
    private $host = "localhost";
    private $usuario = "root";
    private $password = "";
    private $db = "db_asistencia";
    private $conexion;

    public function __construct()
    {
        $this->conexion = new mysqli($this->host, $this->usuario, $this->password, $this->db);
        if ($this->conexion->connect_errno) {
            echo json_encode([
                "status" => "error",
                "message" => "Error de conexión: " . $this->conexion->connect_error
            ]);
            exit;
        }
        $this->conexion->set_charset("utf8");
    }

    // ✅ Método para obtener datos (SELECT)
    protected function obtenerDatos($query)
    {
        $resultado = $this->conexion->query($query);
        $array = [];
        if ($resultado) {
            foreach ($resultado as $fila) {
                $array[] = $fila;
            }
        }
        return $array;
    }

    // ✅ Método para ejecutar INSERT y obtener el ID generado
    protected function nonQueryId($query)
    {
        $resultado = $this->conexion->query($query);
        return $resultado ? $this->conexion->insert_id : 0;
    }

    // ✅ Método para ejecutar UPDATE o DELETE
    protected function nonQuery($query)
    {
        $resultado = $this->conexion->query($query);
        if ($resultado === false) {
            // 🔍 Devuelve mensaje de error SQL si ocurre un problema
            return ["error" => $this->conexion->error];
        }
        return $this->conexion->affected_rows;
    }
}
?>
