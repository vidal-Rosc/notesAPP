# Usa una imagen base de Node.js para construir la aplicación
FROM node:16 as build

# Establece directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia todo el código fuente
COPY . .

# Construye la aplicación React
RUN npm run build

# Fase de producción: Nginx
FROM nginx:alpine

# Copia los archivos de construcción de React al directorio que servirá Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
