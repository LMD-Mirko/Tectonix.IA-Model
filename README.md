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
