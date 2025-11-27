from flask import Flask, request, jsonify, render_template, redirect, url_for, flash, session
from datetime import datetime
import mysql.connector
from mysql.connector import errorcode
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash

# --- CONFIGURACIÓN DE LA BASE DE DATOS ---
MYSQL_CONFIG = {
    'user': 'root',
    'password': '',
    'host': '127.0.0.1',
    'database': 'db_asistencia'
}

# --- INICIALIZACIÓN DE FLASK ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'esta-es-una-clave-secreta-muy-segura'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False  # True si usas HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True

# Configuración CORS mejorada para React
CORS(app, 
     resources={r"/api/*": {"origins": "http://localhost:5173"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# --- CONFIGURACIÓN DE FLASK-LOGIN ---
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Por favor, inicia sesión para ver esta página.'
login_manager.login_message_category = 'info'

# --- MODELO DE USUARIO ---
class Admin(UserMixin):
    def __init__(self, id, username, password_hash):
        self.id = id
        self.username = username
        self.password_hash = password_hash

@login_manager.user_loader
def load_user(user_id):
    conn = get_db_connection()
    if not conn:
        return None
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM administradores WHERE id = %s", (user_id,))
        user_data = cursor.fetchone()
        if user_data:
            return Admin(user_data['id'], user_data['username'], user_data['password_hash'])
        return None
    except mysql.connector.Error as err:
        print(f"Error al cargar usuario: {err}")
        return None
    finally:
        cursor.close()
        conn.close()

# --- FUNCIONES AUXILIARES DE LA DB ---
def get_db_connection():
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print(f"Error de conexión: {err}")
        return None

def init_db():
    conn = get_db_connection()
    if not conn:
        print("No se pudo conectar a la DB para inicializar.")
        return
    cursor = conn.cursor()
    try:
        cursor.execute("CREATE TABLE IF NOT EXISTS estudiantes (id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(100) NOT NULL UNIQUE, curso VARCHAR(50));")
        cursor.execute("CREATE TABLE IF NOT EXISTS asistencias (id INT AUTO_INCREMENT PRIMARY KEY, estudiante_id INT, hora_ingreso DATETIME NOT NULL, FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id));")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS administradores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL
            );
        """)
        conn.commit()
        print("Tablas verificadas/creadas.")
    except mysql.connector.Error as err:
        print(f"Error al crear tablas: {err}")
    finally:
        cursor.close()
        conn.close()

# --- RUTAS DE AUTENTICACIÓN API ---

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def api_login():
    if request.method == 'OPTIONS':
        return '', 204
        
    data = request.get_json()
    username = data.get('email')  # El frontend envía 'email'
    password = data.get('password')
    
    if not username or not password:
        return jsonify({
            'success': False,
            'error': 'Usuario y contraseña requeridos'
        }), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({
            'success': False,
            'error': 'Error de conexión con la base de datos'
        }), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM administradores WHERE username = %s", (username,))
        user_data = cursor.fetchone()
        
        if user_data and check_password_hash(user_data['password_hash'], password):
            admin = Admin(user_data['id'], user_data['username'], user_data['password_hash'])
            login_user(admin, remember=True)
            print(f"Login API exitoso para: {username}")
            return jsonify({
                'success': True,
                'user': {
                    'id': user_data['id'],
                    'username': user_data['username']
                }
            }), 200
        else:
            print(f"Intento fallido de login API para: {username}")
            return jsonify({
                'success': False,
                'error': 'Usuario o contraseña incorrectos'
            }), 401

    except mysql.connector.Error as err:
        print(f"Error en la base de datos: {err}")
        return jsonify({
            'success': False,
            'error': 'Error en la base de datos'
        }), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/logout', methods=['POST', 'OPTIONS'])
def api_logout():
    if request.method == 'OPTIONS':
        return '', 204
    logout_user()
    return jsonify({'success': True, 'message': 'Sesión cerrada'}), 200

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({
            'authenticated': True,
            'user': {
                'id': current_user.id,
                'username': current_user.username
            }
        }), 200
    return jsonify({'authenticated': False}), 401

# --- RUTAS TRADICIONALES (Para render_template) ---
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = get_db_connection()
        if not conn:
            flash('Error de conexión con la base de datos.', 'danger')
            return render_template('login.html')
            
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM administradores WHERE username = %s", (username,))
            user_data = cursor.fetchone()
            
            if user_data and check_password_hash(user_data['password_hash'], password):
                admin = Admin(user_data['id'], user_data['username'], user_data['password_hash'])
                login_user(admin)
                print(f"Login exitoso para: {username}")
                return redirect(url_for('index'))
            else:
                flash('Usuario o contraseña incorrectos.', 'danger')
                print(f"Intento fallido de login para: {username}")

        except mysql.connector.Error as err:
            flash(f'Error en la base de datos: {err}', 'danger')
        finally:
            cursor.close()
            conn.close()
            
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Has cerrado sesión exitosamente.', 'success')
    return redirect(url_for('login'))

@app.route('/')
@login_required
def index():
    return render_template('index.html', username=current_user.username)

# --- RUTAS API DE ASISTENCIA ---

@app.route('/api/registrar', methods=['POST', 'OPTIONS'])
def registrar_asistencia():
    if request.method == 'OPTIONS':
        return '', 204
        
    datos_recibidos = request.json
    if not datos_recibidos or 'nombre' not in datos_recibidos:
        return jsonify({"estado": "error", "mensaje": "Datos incompletos"}), 400
    
    nombre_estudiante = datos_recibidos['nombre']
    hora_actual = datetime.now()
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"estado": "error", "mensaje": "Error interno del servidor"}), 500
    
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, curso FROM estudiantes WHERE nombre = %s", (nombre_estudiante,))
        resultado = cursor.fetchone()
        
        if resultado:
            estudiante_id = resultado[0]
            curso = resultado[1] if resultado[1] else "Curso Desconocido"
        else:
            cursor.execute("INSERT INTO estudiantes (nombre, curso) VALUES (%s, %s)", 
                         (nombre_estudiante, "Curso A"))
            conn.commit()
            estudiante_id = cursor.lastrowid
            curso = "Curso A"
        
        cursor.execute("INSERT INTO asistencias (estudiante_id, hora_ingreso) VALUES (%s, %s)",
                      (estudiante_id, hora_actual))
        conn.commit()
        
        return jsonify({
            "estado": "exito",
            "registro": {
                "nombre": nombre_estudiante,
                "curso": curso,
                "hora_ingreso": hora_actual.strftime("%Y-%m-%d %H:%M:%S")
            }
        }), 201
    except mysql.connector.Error as err:
        print(f"Error de MySQL: {err}")
        conn.rollback()
        return jsonify({"estado": "error", "mensaje": "Error de base de datos"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/asistencia/hoy', methods=['GET'])
@login_required
def obtener_asistencia_hoy():
    conn = get_db_connection()
    if not conn:
        return jsonify({"estado": "error", "mensaje": "Error de conexión"}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        query = """SELECT E.nombre, E.curso, A.hora_ingreso 
                   FROM asistencias A 
                   JOIN estudiantes E ON A.estudiante_id = E.id 
                   WHERE DATE(A.hora_ingreso) = CURDATE()"""
        cursor.execute(query)
        asistencias = cursor.fetchall()
        
        for reg in asistencias:
            reg['hora_ingreso'] = reg['hora_ingreso'].strftime("%Y-%m-%d %H:%M:%S")
        
        return jsonify(asistencias), 200
    except mysql.connector.Error as err:
        print(f"Error al leer: {err}")
        return jsonify({"estado": "error", "mensaje": "Error de base de datos"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/asistencia/historial', methods=['GET'])
@login_required
def obtener_historial():
    fecha = request.args.get('fecha')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"estado": "error", "mensaje": "Error de conexión"}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        if fecha:
            query = """SELECT E.nombre, E.curso, A.hora_ingreso 
                       FROM asistencias A 
                       JOIN estudiantes E ON A.estudiante_id = E.id 
                       WHERE DATE(A.hora_ingreso) = %s"""
            cursor.execute(query, (fecha,))
        else:
            query = """SELECT E.nombre, E.curso, A.hora_ingreso 
                       FROM asistencias A 
                       JOIN estudiantes E ON A.estudiante_id = E.id"""
            cursor.execute(query)
        
        asistencias = cursor.fetchall()
        for reg in asistencias:
            reg['hora_ingreso'] = reg['hora_ingreso'].strftime("%Y-%m-%d %H:%M:%S")
        
        return jsonify(asistencias), 200
    except mysql.connector.Error as err:
        print(f"Error al leer: {err}")
        return jsonify({"estado": "error", "mensaje": "Error de base de datos"}), 500
    finally:
        cursor.close()
        conn.close()

# --- INICIAR SERVIDOR ---
if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)