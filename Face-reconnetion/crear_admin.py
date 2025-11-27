import mysql.connector
from werkzeug.security import generate_password_hash

# Configuración de la base de datos
MYSQL_CONFIG = {
    'user': 'root',
    'password': '',
    'host': '127.0.0.1',
    'database': 'db_asistencia'
}

def crear_admin():
    conn = mysql.connector.connect(**MYSQL_CONFIG)
    cursor = conn.cursor()
    
    # Datos del administrador
    username = "admin@test.com"  # El frontend espera un email
    password = "admin123"  # Cambia esto por tu contraseña deseada
    password_hash = generate_password_hash(password)
    
    try:
        # Verificar si ya existe
        cursor.execute("SELECT * FROM administradores WHERE username = %s", (username,))
        if cursor.fetchone():
            print(f"El usuario '{username}' ya existe.")
        else:
            # Insertar nuevo administrador
            cursor.execute(
                "INSERT INTO administradores (username, password_hash) VALUES (%s, %s)",
                (username, password_hash)
            )
            conn.commit()
            print(f"✅ Administrador creado exitosamente:")
            print(f"   Usuario: {username}")
            print(f"   Contraseña: {password}")
            print(f"\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login")
    except mysql.connector.Error as err:
        print(f"❌ Error: {err}")
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    crear_admin()