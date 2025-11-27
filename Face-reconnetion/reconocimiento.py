import face_recognition
import cv2
import numpy as np
import os
import requests

# --- CONFIGURACIÓN ---
ruta_imagenes = "imagenes_estudiantes"
encodings_conocidos = []
nombres_conocidos = []

# 🔗 URL del backend PHP 
# IMPORTANTE: Ajusta esta URL según donde esté tu backend
# Si tu backend está en localhost/backend: usa "http://localhost/backend/endpoints/reconocimiento.php"
# Si está en otro puerto: usa "http://localhost:8080/backend/endpoints/reconocimiento.php"
# URL_BACKEND = "http://localhost/backend/endpoints/reconocimiento.php"
URL_BACKEND ="http://localhost/api_rest/backend/endpoints/reconocimiento.php"

print("📚 Cargando y 'aprendiendo' rostros...")

# Cargar imágenes de estudiantes
if not os.path.exists(ruta_imagenes):
    print(f"❌ Error: No se encontró la carpeta '{ruta_imagenes}'")
    print(f"   Crea la carpeta y coloca las imágenes de los estudiantes allí.")
    exit()

archivos = os.listdir(ruta_imagenes)
if len(archivos) == 0:
    print(f"⚠️ Advertencia: La carpeta '{ruta_imagenes}' está vacía")
    print(f"   Agrega imágenes de estudiantes antes de continuar.")
    exit()

for nombre_archivo in archivos:
    ruta_completa = os.path.join(ruta_imagenes, nombre_archivo)
    
    # Solo procesar archivos de imagen
    if not nombre_archivo.lower().endswith(('.jpg', '.jpeg', '.png')):
        continue
    
    try:
        imagen = face_recognition.load_image_file(ruta_completa)
        encodings = face_recognition.face_encodings(imagen)
        
        if encodings:
            encoding = encodings[0]
            encodings_conocidos.append(encoding)
            # El nombre es el archivo sin extensión
            nombre = os.path.splitext(nombre_archivo)[0]
            nombres_conocidos.append(nombre)
            print(f"   ✓ {nombre}")
        else:
            print(f"   ⚠️ No se detectó rostro en: {nombre_archivo}")
    except Exception as e:
        print(f"   ❌ Error al cargar {nombre_archivo}: {e}")

if len(encodings_conocidos) == 0:
    print("❌ No se pudieron cargar rostros. Verifica las imágenes.")
    exit()

print(f"\n✅ Total de rostros aprendidos: {len(nombres_conocidos)}")
print(f"   Estudiantes: {', '.join(nombres_conocidos)}\n")

# --- INICIAR CÁMARA ---
print("🎥 Iniciando cámara...")
video_capture = cv2.VideoCapture(0)
estudiantes_presentes = set()  # Para no registrar dos veces

if not video_capture.isOpened():
    print("❌ Error: No se pudo abrir la cámara.")
    print("   Verifica que:")
    print("   1. Tienes una cámara conectada")
    print("   2. Ninguna otra aplicación está usando la cámara")
    print("   3. Tienes permisos para acceder a la cámara")
    exit()

# --- OPTIMIZACIÓN ---
frame_count = 0
FACTOR_REDUCCION = 4
FRAMES_A_SALTEAR = 5
loc_caras_procesadas = []
nombres_caras_procesadas = []

print("✅ Cámara iniciada correctamente")
print(f"🔗 Backend: {URL_BACKEND}")
print("\n" + "="*60)
print("INSTRUCCIONES:")
print("- Presiona 'q' para salir")
print("- Presiona 'r' para reiniciar el conteo de presentes")
print("="*60 + "\n")

# Verificar conexión con el backend al inicio
try:
    print("🔍 Verificando conexión con el backend...")
    test_response = requests.post(
        URL_BACKEND, 
        json={"nombre": "TEST_CONEXION"},
        timeout=3
    )
    print(f"✅ Backend respondió correctamente (HTTP {test_response.status_code})")
except requests.exceptions.RequestException as e:
    print(f"⚠️ ADVERTENCIA: No se pudo conectar al backend")
    print(f"   Error: {e}")
    print(f"   Verifica que el servidor web esté corriendo y la URL sea correcta")
    continuar = input("\n¿Deseas continuar de todos modos? (s/n): ")
    if continuar.lower() != 's':
        exit()

print("\n🚀 Sistema activo. Detectando rostros...\n")

while True:
    ret, frame = video_capture.read()
    if not ret:
        print("❌ Error: No se pudo capturar el frame.")
        break

    frame = cv2.flip(frame, 1)  # Efecto espejo

    # Procesar cada X frames para optimizar
    if frame_count % FRAMES_A_SALTEAR == 0:
        frame_pequeno = cv2.resize(frame, (0, 0), fx=(1.0 / FACTOR_REDUCCION), fy=(1.0 / FACTOR_REDUCCION))
        rgb_frame_pequeno = cv2.cvtColor(frame_pequeno, cv2.COLOR_BGR2RGB)

        loc_caras_procesadas = []
        nombres_caras_procesadas = []

        # Detectar rostros
        loc_caras_actuales = face_recognition.face_locations(rgb_frame_pequeno, model="hog")
        encodings_caras_actuales = face_recognition.face_encodings(rgb_frame_pequeno, loc_caras_actuales)

        for (top, right, bottom, left), face_encoding in zip(loc_caras_actuales, encodings_caras_actuales):
            coincidencias = face_recognition.compare_faces(encodings_conocidos, face_encoding)
            nombre = "Desconocido"

            distancias_faciales = face_recognition.face_distance(encodings_conocidos, face_encoding)
            
            if len(distancias_faciales) > 0:
                mejor_indice = np.argmin(distancias_faciales)
                
                if coincidencias[mejor_indice]:
                    nombre = nombres_conocidos[mejor_indice]

                    # 🎯 REGISTRO DE ASISTENCIA
                    if nombre not in estudiantes_presentes and nombre != "Desconocido":
                        
                        print(f"\n{'='*60}")
                        print(f"👤 RECONOCIDO: {nombre}")
                        print(f"{'='*60}")
                        print(f"📤 Registrando asistencia en el backend...")
                        
                        try:
                            # Datos a enviar al backend PHP
                            datos = {"nombre": nombre}
                            
                            # Petición POST al backend
                            respuesta = requests.post(URL_BACKEND, json=datos, timeout=5)
                            
                            if respuesta.status_code == 201:
                                datos_respuesta = respuesta.json()
                                print(f"✅ ASISTENCIA REGISTRADA EXITOSAMENTE")
                                print(f"   Nombre: {datos_respuesta['registro']['nombre']}")
                                print(f"   Curso: {datos_respuesta['registro']['curso']}")
                                print(f"   Hora: {datos_respuesta['registro']['hora_ingreso']}")
                                
                                # Marcar como presente
                                estudiantes_presentes.add(nombre)
                                
                            elif respuesta.status_code == 200:
                                print(f"ℹ️  Ya había registrado asistencia hoy")
                                estudiantes_presentes.add(nombre)
                                
                            else:
                                print(f"⚠️ Error HTTP {respuesta.status_code}")
                                try:
                                    error_data = respuesta.json()
                                    print(f"   Mensaje: {error_data.get('mensaje', 'Error desconocido')}")
                                except:
                                    print(f"   Respuesta: {respuesta.text}")
                        
                        except requests.exceptions.Timeout:
                            print(f"❌ TIMEOUT: El servidor tardó demasiado en responder")
                            print(f"   El registro podría haberse completado de todos modos")
                            
                        except requests.exceptions.ConnectionError:
                            print(f"❌ ERROR DE CONEXIÓN: No se pudo conectar al backend")
                            print(f"   Verifica que el servidor web esté corriendo")
                            print(f"   URL: {URL_BACKEND}")
                            
                        except requests.exceptions.RequestException as e:
                            print(f"❌ ERROR: {e}")
                        
                        print(f"{'='*60}\n")
            
            # Guardar resultados para dibujar
            loc_caras_procesadas.append((top, right, bottom, left))
            nombres_caras_procesadas.append(nombre)

    frame_count += 1

    # --- DIBUJAR RECTÁNGULOS Y NOMBRES ---
    for (top, right, bottom, left), nombre in zip(loc_caras_procesadas, nombres_caras_procesadas):
        # Escalar coordenadas de vuelta al tamaño original
        top *= FACTOR_REDUCCION
        right *= FACTOR_REDUCCION
        bottom *= FACTOR_REDUCCION
        left *= FACTOR_REDUCCION

        # Color verde si está registrado, rojo si es desconocido
        color = (0, 255, 0) if nombre != "Desconocido" else (0, 0, 255)
        
        # Rectángulo alrededor del rostro
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        
        # Rectángulo para el nombre
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
        
        # Texto con el nombre
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, nombre, (left + 6, bottom - 6), font, 0.8, (255, 255, 255), 1)

    # Mostrar información en pantalla
    info_y = 30
    cv2.putText(frame, f"Presentes hoy: {len(estudiantes_presentes)}", 
                (10, info_y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    
    if len(estudiantes_presentes) > 0:
        info_y += 30
        lista_presentes = ', '.join(list(estudiantes_presentes)[:3])
        if len(estudiantes_presentes) > 3:
            lista_presentes += f" +{len(estudiantes_presentes) - 3} mas"
        cv2.putText(frame, lista_presentes, 
                    (10, info_y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    cv2.imshow('Sistema de Asistencia Facial', frame)

    # Manejar teclas
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    elif key == ord('r'):
        estudiantes_presentes.clear()
        print("\n🔄 Conteo de presentes reiniciado\n")

# --- LIMPIEZA ---
print("\n" + "="*60)
print("🔒 Cerrando sistema...")
print("="*60)
video_capture.release()
cv2.destroyAllWindows()

print(f"\n📊 RESUMEN DE LA SESIÓN:")
print(f"   Total de estudiantes que asistieron: {len(estudiantes_presentes)}")
if estudiantes_presentes:
    print(f"   Lista: {', '.join(estudiantes_presentes)}")
else:
    print(f"   No se registraron asistencias en esta sesión")

print("\n✅ Sistema finalizado correctamente")