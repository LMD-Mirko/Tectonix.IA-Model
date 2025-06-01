require('dotenv').config(); // Cargar variables de entorno al inicio

const { GoogleAuth } = require('google-auth-library');
const { VertexAI } = require('@google-cloud/vertexai');

// Configuración de Google Cloud usando variables de entorno
const auth = new GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON),
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

const vertexAI = new VertexAI({ 
  auth, 
  project: process.env.GOOGLE_PROJECT_ID || 'fluted-clock-461222-g7', 
  location: process.env.GOOGLE_LOCATION || 'us-central1' 
});

const generativeModel = vertexAI.preview.getGenerativeModel({
  model: process.env.GOOGLE_MODEL || 'gemini-2.0-flash-001',
});

// Configuración de la aplicación con variables de entorno
const MAX_HISTORIA = process.env.MAX_HISTORY || 20;
const MAX_TOKENS = process.env.MAX_TOKENS || 400; // Reducido para respuestas más concisas
const CACHE_TIEMPO = process.env.CACHE_TIME || 60 * 60 * 1000;
const { GoogleAuth } = require('google-auth-library');
const { VertexAI } = require('@google-cloud/vertexai');

// Configuración de Google Cloud
const auth = new GoogleAuth({
  keyFilename: './config/credentials.json',
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

const vertexAI = new VertexAI({ auth, project: 'fluted-clock-461222-g7', location: 'us-central1' });
const generativeModel = vertexAI.preview.getGenerativeModel({
  model: 'gemini-2.0-flash-001',
});

const MAX_HISTORIA = 20;
const MAX_TOKENS = 400; // Reducido para respuestas más concisas
const CACHE_TIEMPO = 60 * 60 * 1000;
const cacheRespuestas = new Map();

let historialConversacion = [];

// Base de conocimiento específica para sismos (mantenemos tu estructura)
const baseConocimiento = {
  definiciones: {
    sismo: "Movimiento brusco de la corteza terrestre causado por la liberación de energía acumulada.",
    terremoto: "Sismo de gran magnitud que causa daños significativos.",
    tsunami: "Ola gigante generada por un sismo submarino.",
    epicentro: "Punto en la superficie terrestre directamente sobre el hipocentro.",
    hipocentro: "Punto donde se origina el sismo en el interior de la Tierra.",
    placaTectonica: "Segmento de la litosfera que se mueve sobre la astenosfera.",
    falla: "Fractura en la corteza terrestre a lo largo de la cual se mueven los bloques de tierra."
  },
  escalas: {
    richter: "Escala logarítmica que mide la magnitud de un sismo.",
    mercalli: "Escala que mide la intensidad de un sismo según sus efectos.",
    jma: "Escala japonesa de intensidad sísmica."
  },
  protocolos: {
    antes: [
      "Preparar mochila de emergencia con agua, alimentos no perecibles, linterna, radio, y documentos importantes.",
      "Identificar zonas seguras dentro y fuera del hogar.",
      "Practicar simulacros de evacuación con la familia."
    ],
    durante: [
      "Mantener la calma y buscar un lugar seguro, como bajo una mesa resistente.",
      "Alejarse de ventanas, espejos y objetos que puedan caer.",
      "No usar ascensores y evitar estar cerca de edificios altos o postes de electricidad en la calle."
    ],
    después: [
      "Verificar si hay heridos y proporcionar primeros auxilios si es necesario.",
      "Revisar daños en la estructura del hogar antes de reingresar.",
      "Seguir las indicaciones de las autoridades y estar atento a réplicas."
    ]
  },
  zonasPeru: {
    zona4: {
      riesgo: "Muy Alto",
      ciudades: ["Lima", "Callao", "Trujillo", "Chiclayo", "Piura", "Tacna", "Arequipa", "Ica"],
      descripcion: "Costa peruana - Mayor actividad sísmica"
    },
    zona3: {
      riesgo: "Alto", 
      ciudades: ["Huancayo", "Cusco", "Huaraz", "Cajamarca"],
      descripcion: "Sierra - Alta probabilidad sísmica"
    },
    zona2: {
      riesgo: "Medio",
      ciudades: ["Puno", "Ayacucho", "Huánuco"],
      descripcion: "Región andina - Riesgo moderado"
    },
    zona1: {
      riesgo: "Bajo",
      ciudades: ["Iquitos", "Pucallpa", "Tarapoto"],
      descripcion: "Selva - Menor actividad sísmica"
    }
  }
};

// Palabras clave relacionadas con sismos (mantenemos tu lista)
const palabrasClaveSismos = [
  'sismo', 'terremoto', 'temblor', 'seísmo', 'movimiento telúrico',
  'magnitud', 'escala richter', 'escala mercalli', 'epicentro',
  'hipocentro', 'placa', 'tectónica', 'falla', 'tsunami',
  'alerta sísmica', 'prevención', 'protección civil', 'evacuación',
  'igp', 'usgs', 'geofísica', 'geología', 'ondas sísmicas',
  'intensidad', 'profundidad', 'aceleración', 'vibración',
  'daño estructural', 'zonificación', 'riesgo sísmico', 'zona sísmica',
  'placa de nazca', 'simulacro', 'mochila de emergencia', 'réplica'
];

// Lugares sísmicos en Perú (mantenemos tu lista)
const lugaresSismicos = [
  'perú', 'lima', 'arequipa', 'cusco', 'tacna', 'nazca', 'sudamérica',
  'callao', 'trujillo', 'chiclayo', 'iquitos', 'pucallpa', 'tarapoto',
  'moquegua', 'ica', 'pisco', 'chimbote', 'piura', 'sullana', 'cajamarca'
];


];

// Lugares sísmicos en Perú (mantenemos tu lista)
const lugaresSismicos = [
  'perú', 'lima', 'arequipa', 'cusco', 'tacna', 'nazca', 'sudamérica',
  'callao', 'trujillo', 'chiclayo', 'iquitos', 'pucallpa', 'tarapoto',
  'moquegua', 'ica', 'pisco', 'chimbote', 'piura', 'sullana', 'cajamarca'
];

// FUNCIÓN PARA CREAR CONTEXTO ESTRUCTURADO
const crearContextoEstructurado = (mensajeUsuario) => {
  const contexto = `Eres un asistente especializado en sismos del Perú. REGLAS IMPORTANTES:

📝 FORMATO DE RESPUESTA:
- Respuestas cortas y directas (máximo ${MAX_TOKENS} tokens)
- Respuestas cortas y directas (máximo 400 tokens)
- Usar markdown para estructura clara
- Enumerar puntos importantes con números (1., 2., 3.)
- Una oración principal en **negrita** al inicio
- Evitar texto repetitivo o relleno

🎯 CONTENIDO:
- Solo información precisa y verificable
- Enfocar en lo más relevante
- Usar datos específicos cuando sea posible
- Incluir solo lo necesario para responder la pregunta

📊 ESTRUCTURA PREFERIDA:
**[Respuesta principal]**

1. [Punto clave 1]
2. [Punto clave 2] 
3. [Punto clave 3]

Pregunta del usuario: "${mensajeUsuario}"`;

  return contexto;
};

// Función para verificar si la pregunta está relacionada con sismos (mantienes tu lógica)
const esPreguntaSismica = (texto) => {
  if (!texto || typeof texto !== 'string') {
    return false;
  }

  const textoMinusculas = texto.toLowerCase();

  const contienePalabraClave = palabrasClaveSismos.some(palabra =>
    textoMinusculas.includes(palabra.toLowerCase())
  );

  const mencionaLugar = lugaresSismicos.some(lugar =>
    textoMinusculas.includes(lugar.toLowerCase())
  );

  const preguntaZonaSismica = /(zona|área|región)\s*(sísmic|sísmico|sísmica)/i.test(textoMinusculas);
  const contieneTiempo = /(hoy|ayer|esta semana|este mes|reciente|últimos)/i.test(textoMinusculas);

  return contienePalabraClave || mencionaLugar || preguntaZonaSismica || contieneTiempo;
};

const reiniciarConversacion = () => {
  historialConversacion = [];
  console.log("Conversación reiniciada");
  return "Conversación reiniciada. ¿En qué puedo ayudarte con información sobre sismos?";
};

// FUNCIÓN DE LIMPIEZA MEJORADA
const limpiarRespuesta = (respuesta) => {
  let textoLimpio = respuesta
    .replace(/<\|im_end\|>|<\|im_start\|>|<\|.*?\|>/g, '')
    .replace(/```.*?```/gs, '')
    .replace(/user:.*|assistant:.*|humano:.*|usuario:.*|system:.*/gi, '')
    .trim();

  // Mejorar formato de listas numeradas
  textoLimpio = textoLimpio.replace(/^(\d+)\.\s*/gm, '$1. ');
  
  // Asegurar que haya saltos de línea apropiados
  textoLimpio = textoLimpio.replace(/(\d+\.\s[^\n]+)(?=\d+\.)/g, '$1\n');
  
  // Limpiar espacios extra
  textoLimpio = textoLimpio.replace(/\n{3,}/g, '\n\n');
  
  return textoLimpio.trim();
};

const generarClaveCaché = () => {
  if (historialConversacion.length === 0) return '';
  const mensajesRecientes = historialConversacion.slice(-3);
  return mensajesRecientes.map(m => `${m.role}:${m.content}`).join('|');
};

const responderChat = async (mensajeUsuario) => {
  try {
    if (!mensajeUsuario || mensajeUsuario.trim() === '') {
      return "Por favor, escribe un mensaje para que pueda ayudarte con información sobre sismos.";
    }

    if (!esPreguntaSismica(mensajeUsuario)) {
      return "Lo siento, solo estoy entrenado para responder preguntas relacionadas con sismos y actividad sísmica.";
    }

    // AQUÍ ESTÁ EL CAMBIO CLAVE: Agregamos contexto estructurado al primer mensaje
    const mensajeConContexto = historialConversacion.length === 0 
      ? crearContextoEstructurado(mensajeUsuario)
      : mensajeUsuario;

    historialConversacion.push({
      role: "user",
      content: mensajeConContexto
    });

    if (historialConversacion.length > MAX_HISTORIA) {
      historialConversacion = historialConversacion.slice(-MAX_HISTORIA);
    }

    const claveCaché = generarClaveCaché();
    const entradaCaché = cacheRespuestas.get(claveCaché);

    if (entradaCaché && (Date.now() - entradaCaché.timestamp) < CACHE_TIEMPO) {
      console.log("Respuesta recuperada de caché");
      historialConversacion.push({
        role: "assistant",
        content: entradaCaché.respuesta
      });
      return entradaCaché.respuesta;
    }

    const mensajesIA = historialConversacion.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response = await generativeModel.generateContent({
      contents: mensajesIA,
      generationConfig: {
        maxOutputTokens: MAX_TOKENS,
        temperature: 0.2, // Más determinista para respuestas más consistentes
        topP: 0.8,
        topK: 40
      },
    });

    let respuesta = response.response.candidates[0].content.parts[0].text;
    respuesta = limpiarRespuesta(respuesta);

    cacheRespuestas.set(claveCaché, {
      respuesta,
      timestamp: Date.now()
    });

    if (cacheRespuestas.size > 100) {
      const primeraEntrada = cacheRespuestas.keys().next().value;
      cacheRespuestas.delete(primeraEntrada);
    }

    historialConversacion.push({
      role: "assistant",
      content: respuesta
    });

    return respuesta;
  } catch (error) {
    console.error("Error al conectar con la IA:", error.message);

    if (error.response) {
      console.error("Detalles del error:", error.response.data);
      if (error.response.status === 429) {
        return "Estamos experimentando mucho tráfico en este momento. Por favor, intenta de nuevo en unos minutos.";
      }
    }

    return "Lo siento, estoy teniendo problemas técnicos. ¿Podrías intentarlo más tarde?";
  }
};

const verificarConexion = async () => {
  try {
    const response = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: "Hola" }] }],
    });
    return true;
  } catch (error) {
    console.error("Error de conexión con la API:", error.message);
    return false;
  }
};

module.exports = {
  responderChat,
  reiniciarConversacion,
  verificarConexion
};