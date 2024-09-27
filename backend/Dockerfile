# Imagen base de Python
FROM python:3.9

# Establece el directorio de trabajo
WORKDIR /app

# Copia  requirements.txt
COPY requirements.txt .

# Instala las dependencias tomadas de requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Expone el puerto en el que correrá FastAPI
EXPOSE 8000

# Ejecuta FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
