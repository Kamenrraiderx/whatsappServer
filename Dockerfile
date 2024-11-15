# Imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos al contenedor
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm install

# Instalar Puppeteer y sus dependencias del sistema
RUN apt-get update && apt-get install -y \
  libnss3 libatk1.0-0 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
  libasound2 libpangocairo-1.0-0 libcairo2 && \
  apt-get clean

# Exponer el puerto, si es necesario
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "src/app.js"]
