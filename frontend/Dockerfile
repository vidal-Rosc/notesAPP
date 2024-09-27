# 1. Etapa de construcción: Construir la aplicación React: Usa una imagen base de Node.js
FROM node:16-alpine as build

# 2. Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copia el archivo package.json
COPY package.json package-lock.json ./

# 4. Instala las dependencias
RUN npm install

# 5. Copiar el resto del código fuente y construir la aplicación
COPY . ./
RUN npm run build

# 2. Etapa final: Servir con Nginx: Usa una imagen base de nginx para servir la app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

