<?php
/**
 * API de Asistencias para el Frontend
 * Ruta: backend/endpoints/asistencias.php
 * 
 * Endpoints:
 * GET  ?action=hoy           - Asistencias del día
 * GET  ?action=historial     - Historial completo (con ?fecha= opcional)
 * GET  ?action=estadisticas  - Estadísticas generales
 * GET  ?action=estudiantes   - Listar estudiantes
 * POST ?action=subir_imagen  - Subir foto de estudiante
 */

// Configurar CORS para React
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Iniciar sesión
session_start();

// Incluir clase de asistencias
require_once __DIR__ . '/../classes/asistencia.class.php';

// Verificar autenticación (solo para ciertas acciones)
function estaAutenticado() {
    return isset($_SESSION['autenticado']) && $_SESSION['autenticado'] === true;
}

// Obtener acción solicitada
$action = $_GET['action'] ?? '';

try {
    $asistencia = new Asistencia();

    switch ($action) {
        
        // ========================================
        // 📋 OBTENER ASISTENCIAS DE HOY
        // ========================================
        case 'hoy':
            if (!estaAutenticado()) {
                http_response_code(401);
                echo json_encode([
                    'estado' => 'error',
                    'mensaje' => 'No autenticado'
                ]);
                exit;
            }

            $resultado = $asistencia->obtenerAsistenciaHoy();
            http_response_code(200);
            echo json_encode($resultado);
            break;

        // ========================================
        // 📅 OBTENER HISTORIAL
        // ========================================
        case 'historial':
            if (!estaAutenticado()) {
                http_response_code(401);
                echo json_encode([
                    'estado' => 'error',
                    'mensaje' => 'No autenticado'
                ]);
                exit;
            }

            $fecha = $_GET['fecha'] ?? null;
            $limite = isset($_GET['limite']) ? intval($_GET['limite']) : 1000;
            
            $resultado = $asistencia->obtenerHistorial($fecha, $limite);
            http_response_code(200);
            echo json_encode($resultado);
            break;

        // ========================================
        // 📊 OBTENER ESTADÍSTICAS
        // ========================================
        case 'estadisticas':
            if (!estaAutenticado()) {
                http_response_code(401);
                echo json_encode([
                    'estado' => 'error',
                    'mensaje' => 'No autenticado'
                ]);
                exit;
            }

            $resultado = $asistencia->obtenerEstadisticas();
            http_response_code(200);
            echo json_encode($resultado);
            break;

        // ========================================
        // 👥 LISTAR ESTUDIANTES
        // ========================================
        case 'estudiantes':
            // Este endpoint puede ser público o requerir auth según tu necesidad
            $resultado = $asistencia->listarEstudiantes();
            http_response_code(200);
            echo json_encode($resultado);
            break;

        // ========================================
        // 🖼️ SUBIR IMAGEN
        // ========================================
        case 'subir_imagen':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode([
                    'estado' => 'error',
                    'mensaje' => 'Método no permitido'
                ]);
                exit;
            }

            if (!isset($_FILES['imagen'])) {
                http_response_code(400);
                echo json_encode([
                    'estado' => 'error',
                    'mensaje' => 'No se recibió ninguna imagen'
                ]);
                exit;
            }

            $nombre = $_POST['nombre'] ?? '';
            $curso = $_POST['curso'] ?? 'Curso A';

            $resultado = $asistencia->subirImagen($_FILES['imagen'], $nombre, $curso);
            
            if ($resultado['estado'] === 'exito') {
                http_response_code(201);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($resultado);
            break;

        // ========================================
        // ❌ ACCIÓN NO VÁLIDA
        // ========================================
        default:
            http_response_code(400);
            echo json_encode([
                'estado' => 'error',
                'mensaje' => 'Acción no válida',
                'acciones_disponibles' => [
                    'hoy',
                    'historial',
                    'estadisticas',
                    'estudiantes',
                    'subir_imagen'
                ]
            ]);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'estado' => 'error',
        'mensaje' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
?>