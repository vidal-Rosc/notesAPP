 # Configuraciones generales de la app (clave secreta, base de datos)
import os
from dotenv import load_dotenv

# Cargar las variables de entorno desde .env
load_dotenv()

# Configuración de JWT y base de datos
SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Duración del token en minutos
REFRESH_TOKEN_EXPIRE_MINUTES = 10080

# Configuración de MongoDB
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://admin:Lamasrobada2803@cluster0.ypalzi1.mongodb.net/")
MONGODB_DB = os.getenv("MONGODB_DB", "notas_db")

