<?php
class Respuestas
{
    public $response = [
        'status' => 'ok',
        'result' => []
    ];

    public function error_405()
    {
        $this->response['status'] = "error";
        $this->response['result'] = [
            "error_id" => "405",
            "error_msg" => "Método no permitido"
        ];
        return $this->response;
    }

    public function error_200($mensaje = "Datos incorrectos")
    {
        $this->response['status'] = "error";
        $this->response['result'] = [
            "error_id" => "200",
            "error_msg" => $mensaje
        ];
        return $this->response;
    }

    public function error_400($mensaje = "Datos incompletos o formato incorrecto")
    {
        $this->response['status'] = "error";
        $this->response['result'] = [
            "error_id" => "400",
            "error_msg" => $mensaje
        ];
        return $this->response;
    }

    public function error_500($mensaje = "Error interno del servidor")
    {
        $this->response['status'] = "error";
        $this->response['result'] = [
            "error_id" => "500",
            "error_msg" => $mensaje
        ];
        return $this->response;
    }
}
?>
