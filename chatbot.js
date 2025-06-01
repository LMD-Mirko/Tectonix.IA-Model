const axios = require('axios');
const API_KEY = 'tgp_v1_UBBxv9fJG_MtVIaYreHLY1RJ0WFsgn3ClnWS-YTWcKA';
const MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo";
const MAX_HISTORIA = 20;
const MAX_TOKENS = 400; 

const CACHE_TIEMPO = 60 * 60 * 1000; 
const cacheRespuestas = new Map();

let historialConversacion = [];

const reiniciarConversacion = () => {
  historialConversacion = [];
  console.log("Conversación reiniciada");
  return "## 🌍 Conversación Reiniciada\n\nSoy **SismoBot**. ¿Qué necesitas saber sobre sismos?";
};

const mejorarInstruccionesSistema = () => {
  return `Eres SismoBot, asistente de información sísmica. Responde de forma CONCISA y DIRECTA.

FORMATO REQUERIDO:
- Usa ## solo para el título principal
- Máximo 3-4 puntos por lista
- Respuestas cortas y específicas
- Solo información esencial
- Usa **negrita** para lo más importante
- Emojis solo cuando sean necesarios

ESPECIALIDAD: Sismos, terremotos, preparación básica
TONO: Directo, claro, sin relleno innecesario`;
};

const formatearMarkdown = (texto) => {
  // Limpiar básico
  let textoLimpio = texto.replace(/<\|.*?\|>/g, '').trim();
  textoLimpio = textoLimpio.replace(/user:.*|assistant:.*|system:.*/gi, '').trim();
  
  // Solo encabezado principal
  textoLimpio = textoLimpio.replace(/^([A-ZÁÉÍÓÚ][^:\n]*):$/gm, '## $1');
  
  // Listas simples
  textoLimpio = textoLimpio.replace(/^(\d+)\.\s*/gm, '$1. ');
  textoLimpio = textoLimpio.replace(/^[-*]\s*/gm, '- ');
  
  // Énfasis en palabras clave (solo las más importantes)
  const palabrasClave = ['magnitud', 'epicentro', 'emergencia', 'evacuación'];
  palabrasClave.forEach(palabra => {
    const regex = new RegExp(`\\b(${palabra})\\b`, 'gi');
    textoLimpio = textoLimpio.replace(regex, '**$1**');
  });
  
  // Limpiar espacios extra
  textoLimpio = textoLimpio.replace(/\n{3,}/g, '\n\n');
  
  return textoLimpio.trim();
};

const limpiarRespuesta = (respuesta) => {
  let textoFormateado = formatearMarkdown(respuesta);
  
  // Asegurar título simple
  if (!textoFormateado.includes('##')) {
    textoFormateado = `## 🌍 Info Sísmica\n\n${textoFormateado}`;
  }
  
  return textoFormateado;
};

const generarClaveCaché = () => {
  if (historialConversacion.length === 0) return '';
  
  const mensajesRecientes = historialConversacion.slice(-3);
  return mensajesRecientes.map(m => `${m.role}:${m.content}`).join('|');
};

const responderChat = async (mensajeUsuario) => {
  try {
    if (!mensajeUsuario || mensajeUsuario.trim() === '') {
      return "## ❓ Mensaje Vacío\n\nPregunta sobre **sismos** para ayudarte.";
    }

    historialConversacion.push({
      role: "user",
      content: mensajeUsuario
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
    
    const mensajesIA = [
      {
        "role": "system",
        "content": mejorarInstruccionesSistema()
      },
      ...historialConversacion
    ];

    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: MODEL,
        messages: mensajesIA,
        max_tokens: MAX_TOKENS,
        temperature: 0.4,
        stop: ["<|eot_id|>", "<|end_of_text|>", "user:", "User:", "USER:", "Usuario:", "USUARIO:", "Human:"]
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    let respuesta = response.data.choices[0].message.content;
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
        return "## ⚠️ Servicio Saturado\n\nEstamos experimentando **mucho tráfico** en este momento.\n\n🕐 Por favor, **intenta de nuevo** en unos minutos.";
      }
    }
    
    return "## 🔧 Problemas Técnicos\n\nLo siento, estoy teniendo **problemas técnicos** temporales.\n\n🔄 ¿Podrías **intentarlo más tarde**?";
  }
};

const verificarConexion = async () => {
  try {
    await axios.get('https://api.together.xyz/v1/models', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
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