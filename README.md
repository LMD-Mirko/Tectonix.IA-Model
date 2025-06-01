# TectonixBot - Asistente Virtual de Seguridad Sísmica

<div align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Versión">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="Licencia">
  <img src="https://img.shields.io/badge/Node.js-18.x-brightgreen" alt="Node.js">
  <img src="https://img.shields.io/badge/API-Together.xyz-orange" alt="API">
</div>

## 📋 Descripción

TectonixBot es un asistente virtual especializado en la detección temprana de sismos y en brindar recomendaciones de seguridad sísmica. Diseñado para proporcionar información precisa, clara y útil que puede salvar vidas.

## 🚀 Características Principales

- 🔍 **Detección Temprana**: Monitoreo constante de actividad sísmica
- 🛡️ **Recomendaciones de Seguridad**: Protocolos antes, durante y después de sismos
- 📊 **Información en Tiempo Real**: Datos actualizados de sismos recientes
- 🎓 **Educación Sísmica**: Explicaciones claras de conceptos técnicos
- 🌍 **Cobertura Nacional**: Enfoque en el Perú con capacidad global

## 🛠️ Tecnologías Utilizadas

- Node.js
- Express.js
- Together.xyz API
- Natural Language Processing
- Markdown para formateo

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/LMD-Mirko/Tectonix.IA-Model.git
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
# Edita el archivo .env con tus credenciales
```

4. Inicia el servidor:
```bash
npm start
```

## 🎯 Uso

### Ejemplos de Comandos

```javascript
// Iniciar el bot
npm start

// Reiniciar la conversación
/reiniciar

// Verificar estado
/status
```

### Ejemplos de Preguntas

- "¿Qué hacer durante un sismo?"
- "¿Cuáles son los últimos sismos en Lima?"
- "¿Qué es la escala de Richter?"
- "¿Cómo prepararme para un sismo?"

## 📚 Estructura del Proyecto

```
tectonixbot/
├── src/
│   ├── chatbot.js      # Lógica principal del bot
│   ├── indexx.js       # Servidor Express
│   └── utils/          # Utilidades
├── public/             # Archivos estáticos
├── tests/             # Pruebas
└── package.json       # Dependencias
```

## 🔒 Seguridad

- Validación de entrada de usuario
- Sanitización de respuestas
- Límites de tasa de solicitudes
- Protección contra inyección
------
<div align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red" alt="Hecho con amor">
  <img src="https://img.shields.io/badge/Powered%20by-AI-blue" alt="Potenciado por IA">
</div>

## Despliegue en Railway

### Requisitos Previos
- Una cuenta en [Railway](https://railway.app)
- Git instalado en tu sistema
- Node.js 18 o superior

### Pasos para el Despliegue

1. **Preparar el Proyecto**
   - Asegúrate de tener todas las variables de entorno configuradas en Railway
   - Verifica que el archivo `railway.json` esté correctamente configurado
   - Asegúrate de que las credenciales de Google Cloud estén disponibles

2. **Desplegar en Railway**
   ```bash
   # Inicializar el proyecto en Railway
   railway init

   # Vincular el proyecto con Railway
   railway link

   # Desplegar la aplicación
   railway up
   ```

3. **Configurar Variables de Entorno en Railway**
   - Ve al dashboard de Railway
   - Selecciona tu proyecto
   - Ve a la sección "Variables"
   - Agrega las siguientes variables:
     - `PORT`
     - `NODE_ENV`
     - `CORS_ORIGIN`
     - `GOOGLE_APPLICATION_CREDENTIALS`
     - `PROJECT_ID`
     - `LOCATION`
     - `MODEL_ID`

4. **Verificar el Despliegue**
   - Railway proporcionará una URL para tu aplicación
   - Verifica que el endpoint `/api/status` responda correctamente
   - Prueba el endpoint `/api/chat` con una consulta simple

### Monitoreo y Mantenimiento
- Railway proporciona logs en tiempo real
- El healthcheck configurado verificará el estado de la aplicación cada 5 minutos
- La aplicación se reiniciará automáticamente en caso de fallos

## Despliegue en Render

### Requisitos Previos
- Cuenta en [Render](https://render.com)
- Cuenta en Google Cloud con Vertex AI habilitado
- Credenciales de servicio de Google Cloud

### Pasos para el Despliegue

1. **Preparar las Credenciales**
   - Asegúrate de tener tu archivo de credenciales de Google Cloud
   - Copia todo el contenido del archivo JSON de credenciales

2. **Configurar en Render**
   - Crea una nueva cuenta en [Render](https://render.com)
   - Ve a "New +" y selecciona "Web Service"
   - Conecta tu repositorio de GitHub
   - Configura el servicio:
     - Name: tectonix-bot
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Plan: Free (o el que prefieras)

3. **Configurar Variables de Entorno**
   En el panel de Render, configura las siguientes variables:
   ```
   PORT=10000
   NODE_ENV=production
   GOOGLE_CREDENTIALS=<contenido_completo_del_archivo_json>
   CORS_ORIGIN=<url_de_tu_frontend>
   ```

4. **Despliegue**
   - Render detectará automáticamente el archivo `render.yaml`
   - El despliegue comenzará automáticamente
   - Puedes monitorear el proceso en la sección "Logs"

5. **Verificación**
   - Una vez desplegado, Render te proporcionará una URL
   - Prueba el endpoint `/api/status` para verificar que todo funcione
   - Verifica los logs en caso de errores

### Solución de Problemas

Si encuentras errores durante el despliegue:

1. **Error de Credenciales**
   - Verifica que el contenido de `GOOGLE_CREDENTIALS` sea un JSON válido
   - Asegúrate de que las credenciales tengan los permisos necesarios

2. **Error de Puerto**
   - Render asignará automáticamente el puerto
   - No es necesario modificar el puerto en el código

3. **Error de Conexión**
   - Verifica que las credenciales de Google Cloud sean correctas
   - Asegúrate de que el proyecto tenga Vertex AI habilitado

## 🔧 Configuración del Entorno

### Variables de Entorno Requeridas

1. Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:
```bash
cp .env.example .env
```

2. Configura las siguientes variables en tu archivo `.env`:
```env
# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=*

# Google Cloud Configuration
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
PROJECT_ID=your-project-id
LOCATION=your-location
MODEL_ID=your-model-id

# API Configuration
API_KEY=your-api-key
API_URL=your-api-url
```

### Configuración en Railway

1. Ve al dashboard de Railway
2. Selecciona tu proyecto
3. Ve a la sección "Variables"
4. Agrega cada una de las variables de entorno mencionadas arriba
5. Para las credenciales de Google Cloud:
   - Sube el archivo de credenciales como una variable de entorno
   - O usa el servicio de secretos de Railway para manejar las credenciales

### Manejo de Credenciales

⚠️ **IMPORTANTE**: Nunca subas tus credenciales al repositorio. El archivo `.env` y cualquier archivo de credenciales están incluidos en `.gitignore`.

Para el despliegue en Railway:
1. Las credenciales deben configurarse en el dashboard de Railway
2. Railway maneja las variables de entorno de forma segura
3. Las credenciales de Google Cloud pueden subirse como un archivo o como variables de entorno
