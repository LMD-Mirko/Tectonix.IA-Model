# API de Inteligencia Artificial - PetBot

<div align="center">
  <img src="https://nodejs.org/static/images/logo.svg" alt="Node.js Logo" width="200"/>
  <br>
  <img src="https://railway.app/brand/logo-dark.svg" alt="Railway Logo" width="200"/>
</div>

API REST para un chatbot inteligente que utiliza la API de Together para proporcionar respuestas conversacionales. Este proyecto está diseñado para ser utilizado como backend para aplicaciones que requieren capacidades de chat con IA.

## 🚀 Características

- Endpoint REST para interacción con el chatbot
- Verificación automática del estado de la API
- Manejo de errores y timeouts
- Capacidad de reiniciar conversaciones
- CORS habilitado para integración con frontends
- Monitoreo del estado del servicio
- Despliegue automático con Railway
- Gestión de variables de entorno segura

## 📋 Prerrequisitos

- Node.js (versión recomendada: 14.x o superior)
- npm (incluido con Node.js)
- Conexión a internet para acceder a la API de Together
- Cuenta en Railway para despliegue

## 🔧 Instalación Local

1. Clona el repositorio:
```bash
git clone https://github.com/MRamosL/Api_Inteligencia-Artificial.git
cd Api_Inteligencia-Artificial
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
# Crea un archivo .env con las siguientes variables
PORT=3001
TOGETHER_API_KEY=tu_api_key_aqui
```

## 🚀 Despliegue en Railway

### Método 1: Despliegue Automático desde GitHub

1. Crea una cuenta en [Railway](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Selecciona el repositorio para desplegar
4. Configura las variables de entorno en Railway:
   - `PORT`: 3001
   - `TOGETHER_API_KEY`: Tu API key de Together
5. Railway detectará automáticamente el `railway.json` y desplegará la aplicación

### Método 2: Despliegue Manual

1. Instala Railway CLI:
```bash
npm i -g @railway/cli
```

2. Inicia sesión en Railway:
```bash
railway login
```

3. Inicializa el proyecto:
```bash
railway init
```

4. Despliega la aplicación:
```bash
railway up
```

## 📡 Endpoints Disponibles

### GET /api/status
Verifica el estado del servicio y la conexión con la API de Together.

### POST /api/chat
Envía un mensaje al chatbot.

**Body:**
```json
{
    "mensaje": "Tu mensaje aquí"
}
```

### POST /api/chat/reiniciar
Reinicia la conversación actual.

### GET /api
Muestra información sobre los endpoints disponibles.

## ⚙️ Configuración

El servidor se configura automáticamente para:
- Usar el puerto especificado en la variable de entorno PORT o 3001 por defecto
- Verificar la conexión con la API cada 5 minutos
- Manejar timeouts de 30 segundos para las respuestas

## 🔐 Variables de Entorno

| Variable | Descripción | Requerido | Valor por Defecto |
|----------|-------------|-----------|-------------------|
| PORT | Puerto del servidor | No | 3001 |
| TOGETHER_API_KEY | API Key de Together | Sí | - |

## 🛠️ Tecnologías Utilizadas

- Node.js
- Express.js
- Axios
- CORS
- Railway (Despliegue)

## 📦 Dependencias Principales

- express: ^4.17.1
- axios: ^1.9.0
- cors: ^2.8.5

## 🔄 Monitoreo y Mantenimiento

- Railway proporciona logs en tiempo real
- Monitoreo automático del estado del servicio
- Reinicio automático en caso de fallos
- Métricas de rendimiento disponibles en el dashboard de Railway

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Características Adicionales

- Manejo robusto de errores
- Respuestas con timeout para evitar bloqueos
- Verificación periódica del estado de la API
- Documentación de API integrada
- Respuestas en formato JSON estandarizado
- Despliegue continuo con Railway
- Gestión segura de variables de entorno

