<?php
/**
 * Endpoint para registro de asistencias desde el sistema de reconocimiento facial (Python)
 * Ruta: backend/endpoints/reconocimiento.php
 * 
 * Este archivo maneja las peticiones del script Python de reconocimiento facial
 */

// Permitir CORS para Python local
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

// Manejar peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'estado' => 'error',
        'mensaje' => 'Método no permitido. Use POST'
    ]);
    exit;
}

// Incluir la clase de asistencias
require_once __DIR__ . '/../classes/asistencia.class.php';

try {
    // Obtener datos JSON del body
    $json = file_get_contents('php://input');
    $datos = json_decode($json, true);

    // Validar que se recibió el nombre
    if (!isset($datos['nombre']) || empty($datos['nombre'])) {
        http_response_code(400);
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'Datos incompletos. Se requiere el nombre del estudiante'
        ]);
        exit;
    }

    // Crear instancia de Asistencia
    $asistencia = new Asistencia();
    
    // Registrar la asistencia
    $resultado = $asistencia->registrarAsistencia($datos['nombre']);

    // Determinar código de respuesta HTTP
    if ($resultado['estado'] === 'exito') {
        http_response_code(201); // Created
    } elseif ($resultado['estado'] === 'info') {
        http_response_code(200); // OK (ya existía)
    } else {
        http_response_code(500); // Error interno
    }

    echo json_encode($resultado);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'estado' => 'error',
        'mensaje' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
?>