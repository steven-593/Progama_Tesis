<?php
/**
 * Clase para gestionar asistencias del sistema de reconocimiento facial
 * Compatible con la estructura backend/classes
 */

require_once __DIR__ . '/conexion.php';

class Asistencia extends Conexion
{
    // ============================================
    // 📝 REGISTRAR ASISTENCIA (Desde Python)
    // ============================================
    
    public function registrarAsistencia($nombre)
    {
        if (empty($nombre)) {
            return [
                'estado' => 'error',
                'mensaje' => 'El nombre es requerido'
            ];
        }

        $nombre_escaped = $this->conexion->real_escape_string(trim($nombre));
        $hora_actual = date('Y-m-d H:i:s');

        try {
            // 1. Buscar si el estudiante existe
            $query_buscar = "SELECT id, curso FROM estudiantes WHERE nombre = '$nombre_escaped'";
            $resultado = $this->obtenerDatos($query_buscar);

            if (count($resultado) > 0) {
                $estudiante_id = $resultado[0]['id'];
                $curso = $resultado[0]['curso'] ?? 'Curso Desconocido';
            } else {
                // 2. Crear nuevo estudiante si no existe
                $query_crear = "INSERT INTO estudiantes (nombre, curso) VALUES ('$nombre_escaped', 'Curso A')";
                $estudiante_id = $this->nonQueryId($query_crear);
                
                if ($estudiante_id === 0) {
                    throw new Exception('Error al crear estudiante');
                }
                
                $curso = 'Curso A';
            }

            // 3. Verificar si ya registró hoy (opcional - evitar duplicados)
            $query_hoy = "SELECT id FROM asistencias 
                         WHERE estudiante_id = $estudiante_id 
                         AND DATE(hora_ingreso) = CURDATE()";
            $ya_registro = $this->obtenerDatos($query_hoy);

            if (count($ya_registro) > 0) {
                return [
                    'estado' => 'info',
                    'mensaje' => 'Ya registró asistencia hoy',
                    'registro' => [
                        'nombre' => $nombre,
                        'curso' => $curso,
                        'hora_ingreso' => $hora_actual
                    ]
                ];
            }

            // 4. Registrar asistencia
            $query_asistencia = "INSERT INTO asistencias (estudiante_id, hora_ingreso) 
                                VALUES ($estudiante_id, '$hora_actual')";
            $resultado_insert = $this->nonQuery($query_asistencia);

            if (isset($resultado_insert['error'])) {
                throw new Exception($resultado_insert['error']);
            }

            return [
                'estado' => 'exito',
                'registro' => [
                    'nombre' => $nombre,
                    'curso' => $curso,
                    'hora_ingreso' => $hora_actual
                ]
            ];

        } catch (Exception $e) {
            return [
                'estado' => 'error',
                'mensaje' => 'Error al registrar: ' . $e->getMessage()
            ];
        }
    }

    // ============================================
    // 📋 OBTENER ASISTENCIAS DE HOY
    // ============================================
    
    public function obtenerAsistenciaHoy()
    {
        $query = "SELECT 
                    E.id,
                    E.nombre, 
                    E.curso, 
                    A.hora_ingreso,
                    A.id as asistencia_id
                  FROM asistencias A 
                  JOIN estudiantes E ON A.estudiante_id = E.id 
                  WHERE DATE(A.hora_ingreso) = CURDATE()
                  ORDER BY A.hora_ingreso DESC";

        $asistencias = $this->obtenerDatos($query);

        return [
            'estado' => 'exito',
            'total' => count($asistencias),
            'fecha' => date('Y-m-d'),
            'asistencias' => $asistencias
        ];
    }

    // ============================================
    // 📅 OBTENER HISTORIAL DE ASISTENCIAS
    // ============================================
    
    public function obtenerHistorial($fecha = null, $limite = 1000)
    {
        if ($fecha) {
            $fecha_escaped = $this->conexion->real_escape_string($fecha);
            $query = "SELECT 
                        E.id,
                        E.nombre, 
                        E.curso, 
                        A.hora_ingreso,
                        A.id as asistencia_id
                      FROM asistencias A 
                      JOIN estudiantes E ON A.estudiante_id = E.id 
                      WHERE DATE(A.hora_ingreso) = '$fecha_escaped'
                      ORDER BY A.hora_ingreso DESC";
        } else {
            $query = "SELECT 
                        E.id,
                        E.nombre, 
                        E.curso, 
                        A.hora_ingreso,
                        A.id as asistencia_id
                      FROM asistencias A 
                      JOIN estudiantes E ON A.estudiante_id = E.id 
                      ORDER BY A.hora_ingreso DESC
                      LIMIT $limite";
        }

        $asistencias = $this->obtenerDatos($query);

        return [
            'estado' => 'exito',
            'total' => count($asistencias),
            'fecha' => $fecha,
            'asistencias' => $asistencias
        ];
    }

    // ============================================
    // 👥 OBTENER ESTADÍSTICAS
    // ============================================
    
    public function obtenerEstadisticas()
    {
        // Total de estudiantes
        $query_estudiantes = "SELECT COUNT(*) as total FROM estudiantes";
        $total_estudiantes = $this->obtenerDatos($query_estudiantes);

        // Asistencias de hoy
        $query_hoy = "SELECT COUNT(*) as total FROM asistencias WHERE DATE(hora_ingreso) = CURDATE()";
        $asistencias_hoy = $this->obtenerDatos($query_hoy);

        // Asistencias de esta semana
        $query_semana = "SELECT COUNT(*) as total FROM asistencias 
                        WHERE YEARWEEK(hora_ingreso, 1) = YEARWEEK(CURDATE(), 1)";
        $asistencias_semana = $this->obtenerDatos($query_semana);

        // Asistencias de este mes
        $query_mes = "SELECT COUNT(*) as total FROM asistencias 
                     WHERE MONTH(hora_ingreso) = MONTH(CURDATE()) 
                     AND YEAR(hora_ingreso) = YEAR(CURDATE())";
        $asistencias_mes = $this->obtenerDatos($query_mes);

        return [
            'estado' => 'exito',
            'estadisticas' => [
                'total_estudiantes' => $total_estudiantes[0]['total'] ?? 0,
                'asistencias_hoy' => $asistencias_hoy[0]['total'] ?? 0,
                'asistencias_semana' => $asistencias_semana[0]['total'] ?? 0,
                'asistencias_mes' => $asistencias_mes[0]['total'] ?? 0
            ]
        ];
    }

    // ============================================
    // 👨‍🎓 LISTAR ESTUDIANTES
    // ============================================
    
    public function listarEstudiantes()
    {
        $query = "SELECT 
                    id,
                    nombre, 
                    curso,
                    created_at
                  FROM estudiantes 
                  ORDER BY nombre ASC";

        $estudiantes = $this->obtenerDatos($query);

        return [
            'estado' => 'exito',
            'total' => count($estudiantes),
            'estudiantes' => $estudiantes
        ];
    }

    // ============================================
    // 🖼️ SUBIR IMAGEN DE ESTUDIANTE
    // ============================================
    
    public function subirImagen($archivo, $nombre, $curso = 'Curso A')
    {
        if (empty($nombre)) {
            return [
                'estado' => 'error',
                'mensaje' => 'El nombre es requerido'
            ];
        }

        if (!isset($archivo['error']) || $archivo['error'] !== UPLOAD_ERR_OK) {
            return [
                'estado' => 'error',
                'mensaje' => 'Error al subir el archivo'
            ];
        }

        $extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
        
        if (!in_array($extension, ['jpg', 'jpeg', 'png'])) {
            return [
                'estado' => 'error',
                'mensaje' => 'Formato no permitido. Solo JPG, JPEG o PNG'
            ];
        }

        // Crear carpeta si no existe
        $carpeta_destino = __DIR__ . '/../../imagenes_estudiantes/';
        if (!file_exists($carpeta_destino)) {
            mkdir($carpeta_destino, 0777, true);
        }

        $nombre_archivo = $nombre . '.' . $extension;
        $ruta_completa = $carpeta_destino . $nombre_archivo;

        if (move_uploaded_file($archivo['tmp_name'], $ruta_completa)) {
            
            $nombre_escaped = $this->conexion->real_escape_string($nombre);
            $curso_escaped = $this->conexion->real_escape_string($curso);
            
            // Verificar si el estudiante existe
            $query_buscar = "SELECT id FROM estudiantes WHERE nombre = '$nombre_escaped'";
            $resultado = $this->obtenerDatos($query_buscar);

            if (count($resultado) > 0) {
                $estudiante_id = $resultado[0]['id'];
                $query_update = "UPDATE estudiantes SET curso = '$curso_escaped' WHERE id = $estudiante_id";
                $this->nonQuery($query_update);
            } else {
                $query_crear = "INSERT INTO estudiantes (nombre, curso) VALUES ('$nombre_escaped', '$curso_escaped')";
                $estudiante_id = $this->nonQueryId($query_crear);
            }

            return [
                'estado' => 'exito',
                'mensaje' => 'Imagen subida correctamente',
                'estudiante' => [
                    'id' => $estudiante_id,
                    'nombre' => $nombre,
                    'curso' => $curso,
                    'ruta_imagen' => 'imagenes_estudiantes/' . $nombre_archivo
                ]
            ];

        } else {
            return [
                'estado' => 'error',
                'mensaje' => 'Error al guardar la imagen'
            ];
        }
    }
}
?>