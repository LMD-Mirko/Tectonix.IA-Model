const express = require('express');
const cors = require('cors');
const { responderChat, reiniciarConversacion, verificarConexion } = require('./chatbot');

const app = express();

<<<<<<< HEAD
// Función para obtener el puerto del servidor
const obtenerPuerto = () => {
  return process.env.PORT || 3001;
};

const PORT = obtenerPuerto();

app.use(cors());
app.use(express.json());
=======
// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Configurar credenciales de Google Cloud
try {
  if (process.env.GOOGLE_CREDENTIALS) {
    // Si las credenciales vienen como variable de entorno (Render/Railway)
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = JSON.stringify(credentials);
    console.log('Credenciales de Google Cloud configuradas desde variable de entorno');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Si las credenciales vienen como ruta de archivo (desarrollo local)
    console.log('Credenciales de Google Cloud configuradas desde archivo');
  } else {
    throw new Error('No se encontraron credenciales de Google Cloud');
  }
} catch (error) {
  console.error('Error al configurar las credenciales de Google Cloud:', error);
  process.exit(1);
}
>>>>>>> 2e0ad014ec882631b7477b8cf8e021f618b9f1c3

let apiDisponible = false;

const comprobarEstadoAPI = async () => {
  try {
    apiDisponible = await verificarConexion();
    console.log(`🌍 SismoBot API - Estado: ${apiDisponible ? '✅ Conectado' : '❌ Desconectado'}`);
  } catch (error) {
    apiDisponible = false;
    console.error('🔥 Error al verificar la conexión con la API:', error);
  }
};

// Verificar conexión inicial y cada 5 minutos
comprobarEstadoAPI();
setInterval(comprobarEstadoAPI, 5 * 60 * 1000);

<<<<<<< HEAD
=======
// Endpoint de healthcheck alternativo
app.get('/status', (req, res) => {
  res.status(200).send('OK');
});

>>>>>>> 2e0ad014ec882631b7477b8cf8e021f618b9f1c3
// Endpoint para verificar el estado del servicio
app.get('/api/status', async (req, res) => {
  try {
    apiDisponible = await verificarConexion();
    res.json({ 
      status: 'ok', 
      servicio: 'SismoBot - Asistente de Información Sísmica',
      apiConectada: apiDisponible,
      version: '2.0.0',
      especialidad: 'Sismos, terremotos y preparación ante desastres',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error al verificar estado:', error);
    res.status(500).json({ 
      status: 'error',
      servicio: 'SismoBot',
      mensaje: 'Error al verificar la conexión con la API de Together',
      apiConectada: false,
      timestamp: new Date().toISOString()
    });
  }
});

<<<<<<< HEAD
// Endpoint principal para el chat sobre sismos
=======
// Endpoint para manejar las consultas del chat
>>>>>>> 2e0ad014ec882631b7477b8cf8e021f618b9f1c3
app.post('/api/chat', async (req, res) => {
  try {
    if (!apiDisponible) {
      return res.status(503).json({
        status: 'error',
        mensaje: 'El servicio de información sísmica no está disponible',
        respuesta: '## 🚨 Servicio No Disponible\n\nLo siento, el **servicio de información sísmica** no está disponible en este momento.\n\n🔧 Estamos trabajando para **resolver el problema**.\n\n---\n\n📞 **En caso de emergencia sísmica:**\n- Llama al **911** o **105**\n- Contacta a **INDECI**: 01-7081088'
      });
    }
    
    const { mensaje } = req.body;
    
    if (!mensaje || typeof mensaje !== 'string') {
      return res.status(400).json({
        status: 'error',
        mensaje: 'El mensaje es requerido y debe ser un texto válido'
      });
    }
    
    // Log mejorado para sismos
    console.log(`🌍 Procesando consulta sísmica: "${mensaje.substring(0, 100)}${mensaje.length > 100 ? '...' : ''}"`);
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Tiempo de espera agotado')), 35000);
    });
    
    const respuesta = await Promise.race([
      responderChat(mensaje),
      timeoutPromise
    ]);
    
    return res.json({
      status: 'ok',
      respuesta,
      timestamp: new Date().toISOString(),
      servicio: 'SismoBot'
    });
    
  } catch (error) {
    console.error('🔥 Error en la API de SismoBot:', error);
    
    let mensaje = 'Error al procesar la consulta sísmica';
    let statusCode = 500;
    let respuestaError = '## ⚠️ Error del Sistema\n\nLo siento, ocurrió un **error** al procesar tu consulta sobre sismos.\n\n🔧 El equipo técnico ha sido **notificado**.';
    
    if (error.message === 'Tiempo de espera agotado') {
      mensaje = 'La consulta está tomando demasiado tiempo en procesarse';
      statusCode = 504;
      respuestaError = '## ⏱️ Tiempo Agotado\n\nTu consulta está tomando **demasiado tiempo**.\n\n💡 **Sugerencia:** Intenta con una pregunta **más específica** sobre sismos.';
    }
    
    return res.status(statusCode).json({
      status: 'error',
      mensaje,
      respuesta: respuestaError,
      timestamp: new Date().toISOString(),
      servicio: 'SismoBot'
    });
  }
});

// Endpoint para reiniciar la conversación
app.post('/api/chat/reiniciar', (req, res) => {
  try {
    const mensaje = reiniciarConversacion();
    console.log('🔄 Conversación sísmica reiniciada');
    
    res.json({
      status: 'ok',
      mensaje: 'Conversación sobre sismos reiniciada correctamente',
      respuesta: mensaje,
      timestamp: new Date().toISOString(),
      servicio: 'SismoBot'
    });
  } catch (error) {
    console.error('❌ Error al reiniciar la conversación:', error);
    res.status(500).json({
      status: 'error',
      mensaje: 'Error al reiniciar la conversación sísmica',
      timestamp: new Date().toISOString(),
      servicio: 'SismoBot'
    });
  }
});

<<<<<<< HEAD
// Endpoint de información de la API
=======
// Endpoint principal de la API
>>>>>>> 2e0ad014ec882631b7477b8cf8e021f618b9f1c3
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    servicio: '🌍 SismoBot API - Información Sísmica',
    descripcion: 'Asistente especializado en sismos, terremotos y preparación ante desastres naturales',
    version: '2.0.0',
    caracteristicas: [
      '📊 Información sobre sismos y terremotos',
      '🏠 Guías de preparación ante desastres',
      '🚨 Protocolos de seguridad durante sismos',
      '📱 Sistemas de alerta temprana',
      '🌎 Actividad sísmica regional y mundial',
      '📝 Respuestas en formato Markdown mejorado'
    ],
    endpoints: [
      { 
        ruta: '/api/status', 
        método: 'GET', 
        descripción: 'Verificar el estado del servicio SismoBot' 
      },
      { 
        ruta: '/api/chat', 
        método: 'POST', 
        descripción: 'Consultar información sobre sismos y terremotos', 
        body: { mensaje: 'string - Tu pregunta sobre sismos' } 
      },
      { 
        ruta: '/api/chat/reiniciar', 
        método: 'POST', 
        descripción: 'Reiniciar la conversación sísmica' 
      }
    ],
    timestamp: new Date().toISOString(),
    contacto_emergencia: {
      peru_emergencias: '911',
      indeci: '01-7081088',
      igp_sismos: 'www.igp.gob.pe'
    }
  });
});

<<<<<<< HEAD
// Middleware para rutas no encontradas
=======
// Manejo de rutas no encontradas
>>>>>>> 2e0ad014ec882631b7477b8cf8e021f618b9f1c3
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    mensaje: 'Ruta no encontrada en SismoBot API',
    servicio: 'SismoBot',
    sugerencia: 'Visita /api para ver los endpoints disponibles',
    timestamp: new Date().toISOString()
  });
});

// Iniciar el servidor
<<<<<<< HEAD
app.listen(PORT, () => {
  console.log('\n🌍 =====================================');
  console.log('🚀 SISMOBOT API - SERVIDOR INICIADO');
  console.log('=====================================');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🔗 URL API: http://localhost:${PORT}/api`);
  console.log(`📊 Estado: http://localhost:${PORT}/api/status`);
  console.log(`💬 Chat: POST http://localhost:${PORT}/api/chat`);
  console.log('=====================================');
  console.log('🔍 Verificando conexión con Together AI...');
  console.log('🌍 Especialidad: Sismos y Terremotos');
  console.log('=====================================\n');
});
=======
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor activo en http://0.0.0.0:${PORT}`);
  console.log('🔍 Variables de entorno:', {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV
  });
});
>>>>>>> 2e0ad014ec882631b7477b8cf8e021f618b9f1c3
