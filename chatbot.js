const axios = require('axios');
const API_KEY = 'tgp_v1_UBBxv9fJG_MtVIaYreHLY1RJ0WFsgn3ClnWS-YTWcKA';
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";
const MAX_HISTORIA = 20;
const MAX_TOKENS = 800; 

const CACHE_TIEMPO = 60 * 60 * 1000; 
const cacheRespuestas = new Map();

let historialConversacion = [];

// Base de conocimiento específica para sismos
const baseConocimiento = {
  definiciones: {
    sismo: "Movimiento brusco de la corteza terrestre causado por la liberación de energía acumulada",
    terremoto: "Sismo de gran magnitud que causa daños significativos",
    tsunami: "Ola gigante generada por un sismo submarino",
    epicentro: "Punto en la superficie terrestre directamente sobre el hipocentro",
    hipocentro: "Punto donde se origina el sismo en el interior de la Tierra"
  },
  
  escalas: {
    richter: "Escala logarítmica que mide la magnitud de un sismo",
    mercalli: "Escala que mide la intensidad de un sismo según sus efectos",
    jma: "Escala japonesa de intensidad sísmica"
  },
  
  protocolos: {
    antes: [
      "Preparar mochila de emergencia",
      "Identificar zonas seguras",
      "Practicar simulacros"
    ],
    durante: [
      "Mantener la calma",
      "Buscar zona segura",
      "Alejarse de ventanas"
    ],
    después: [
      "Verificar daños",
      "Seguir indicaciones oficiales",
      "Revisar servicios básicos"
    ]
  },
  
  zonasPeru: {
    costa: {
      riesgo: "Alto",
      ciudades: ["Lima", "Callao", "Trujillo", "Chiclayo"],
      caracteristicas: ["Placa de Nazca", "Zona de subducción"]
    },
    sierra: {
      riesgo: "Medio",
      ciudades: ["Cusco", "Arequipa", "Huancayo"],
      caracteristicas: ["Fallas activas", "Sismicidad moderada"]
    },
    selva: {
      riesgo: "Bajo",
      ciudades: ["Iquitos", "Pucallpa", "Tarapoto"],
      caracteristicas: ["Plataforma estable", "Baja sismicidad"]
    }
  }
};

// Palabras clave relacionadas con sismos
const palabrasClaveSismos = [
  'sismo', 'terremoto', 'temblor', 'seísmo', 'movimiento telúrico',
  'magnitud', 'escala richter', 'escala mercalli', 'epicentro',
  'hipocentro', 'placa', 'tectónica', 'falla', 'tsunami',
  'alerta sísmica', 'prevención', 'protección civil', 'evacuación',
  'igp', 'usgs', 'geofísica', 'geología', 'ondas sísmicas',
  'intensidad', 'profundidad', 'aceleración', 'vibración',
  'daño estructural', 'zonificación', 'riesgo sísmico'
];

// Función para verificar si la pregunta está relacionada con sismos
const esPreguntaSismica = (texto) => {
  const textoMinusculas = texto.toLowerCase();
  
  // Verificar si contiene palabras clave de sismos
  const contienePalabraClave = palabrasClaveSismos.some(palabra => 
    textoMinusculas.includes(palabra.toLowerCase())
  );
  
  // Verificar si contiene números seguidos de unidades de magnitud
  const contieneMagnitud = /\d+\.?\d*\s*(grados|magnitud|escala|richter|mercalli)/i.test(texto);
  
  // Verificar si menciona lugares conocidos por actividad sísmica
  const lugaresSismicos = ['perú', 'lima', 'arequipa', 'cusco', 'tacna', 'nazca', 'sudamericana'];
  const mencionaLugar = lugaresSismicos.some(lugar => 
    textoMinusculas.includes(lugar.toLowerCase())
  );
  
  return contienePalabraClave || contieneMagnitud || mencionaLugar;
};

const reiniciarConversacion = () => {
  historialConversacion = [];
  console.log("Conversación reiniciada");
  return "Conversación reiniciada. ¿En qué puedo ayudarte con información sobre sismos?";
};

const mejorarInstruccionesSistema = () => {
  return `Eres TectonixBot, un asistente virtual especializado en la detección temprana de sismos y en brindar recomendaciones de seguridad sísmica. Tu objetivo es proporcionar información precisa, clara y útil que pueda salvar vidas.

REGLAS DE RESPUESTA:

1. Completitud:
   - SIEMPRE proporciona respuestas completas
   - NO dejes listas o explicaciones a medias
   - Asegúrate de que cada punto tenga su explicación completa
   - Incluye un resumen o conclusión cuando sea apropiado

2. Estructura:
   - Usa títulos en negrita para cada sección
   - Numera los pasos secuenciales (1, 2, 3...)
   - Usa viñetas (-) para listas no ordenadas
   - Usa puntos (•) para subelementos
   - Mantén una jerarquía clara en la información

3. Formato de Protocolos:
   **Protocolo de Seguridad**
   1. [Acción principal]
      • [Detalle específico]
      • [Razón o beneficio]
   2. [Acción principal]
      • [Detalle específico]
      • [Razón o beneficio]
   [Continuar con todos los pasos necesarios]
   
   **Resumen**
   - [Punto clave 1]
   - [Punto clave 2]
   - [Recomendación final]

4. Formato de Información Técnica:
   **Información Técnica**
   - [Concepto principal]
     • [Definición clara]
     • [Importancia práctica]
   - [Aplicación]
     • [Uso específico]
     • [Beneficio]
   
   **Resumen**
   - [Punto clave 1]
   - [Punto clave 2]

5. Formato de Datos Sísmicos:
   **Datos Sísmicos**
   - [Fecha y hora]
     • Magnitud: [valor]
     • Ubicación: [detalles]
     • Profundidad: [valor]
   [Continuar con todos los datos]
   
   **Resumen**
   - Total de eventos: [número]
   - Rango de magnitud: [valor]
   - Zonas afectadas: [lista]

6. Reglas de Completitud:
   - SIEMPRE termina cada sección con un resumen
   - NO dejes puntos sin explicar
   - Asegúrate de que cada lista esté completa
   - Incluye información adicional relevante
   - Proporciona contexto cuando sea necesario

7. Manejo de Errores:
   - Si no tienes información completa, indícalo claramente
   - Si la información es parcial, especifica qué aspectos no están disponibles
   - Si necesitas más detalles, solicítalos de manera específica

8. Prioridades:
   1. Seguridad inmediata
   2. Información precisa
   3. Claridad en instrucciones
   4. Calma y tranquilidad
   5. Fuentes confiables

9. Elementos Prohibidos:
   - Información no verificada
   - Lenguaje alarmista
   - Técnicismos excesivos
   - Respuestas vagas
   - Información no solicitada

10. Reglas de Estructuración:
    - Usar numeración (1, 2, 3) para:
      • Pasos secuenciales
      • Acciones ordenadas
      • Procesos temporales
    - Usar viñetas (-) para:
      • Listas de características
      • Datos independientes
      • Elementos sin orden específico
    - Usar puntos (•) para:
      • Detalles de un punto principal
      • Subelementos de una lista
      • Explicaciones adicionales`;
};

const limpiarRespuesta = (respuesta) => {
  // Limpiar marcadores de IA
  let textoLimpio = respuesta.replace(/<\|im_end\|>|<\|im_start\|>|<\|.*?\|>/g, '').trim();
  textoLimpio = textoLimpio.replace(/```.*?```/gs, '').trim();
  textoLimpio = textoLimpio.replace(/user:.*|assistant:.*|humano:.*|usuario:.*|system:.*/gi, '').trim();

  // Asegurar que el título esté en negrita
  const lineas = textoLimpio.split('\n');
  const primeraLinea = lineas[0].trim();
  if (!primeraLinea.startsWith('**') && !primeraLinea.endsWith('**')) {
    lineas[0] = `**${primeraLinea}**`;
  }

  // Formatear el resto del texto
  textoLimpio = lineas.join('\n');
  textoLimpio = formatearListasEnumeradas(textoLimpio);

  // Asegurar que la respuesta esté completa
  if (textoLimpio.includes('...')) {
    textoLimpio = textoLimpio.replace(/\.\.\.$/, '');
  }

  // Verificar si la respuesta termina con un número seguido de puntos
  const ultimaLinea = textoLimpio.split('\n').pop().trim();
  if (ultimaLinea.match(/^\d+\./)) {
    textoLimpio = textoLimpio.replace(/^\d+\.\s*$/, '');
  }

  return textoLimpio;
};

const formatearListasEnumeradas = (texto) => {
  let lineas = texto.split('\n');
  let resultado = [];
  let esLista = false;
  let contadorLista = 1;
  let nivelIndentacion = 0;
  let enSeccion = false;
  let formatoActual = 'puntos';
  
  // Detectar el formato basado en el contenido
  if (texto.includes('Definición') || texto.includes('Qué es')) {
    formatoActual = 'parrafo';
  } else if (texto.includes('Protocolo') || texto.includes('Pasos')) {
    formatoActual = 'pasos';
  } else if (texto.includes('Magnitud') || texto.includes('Profundidad')) {
    formatoActual = 'datos';
  }
  
  for (let i = 0; i < lineas.length; i++) {
    let linea = lineas[i].trim();
    
    // Ignorar líneas vacías al inicio
    if (linea === '' && resultado.length === 0) continue;
    
    // Manejar títulos principales
    if (linea.startsWith('**') && linea.endsWith('**')) {
      if (resultado.length > 0) resultado.push('');
      resultado.push(linea);
      resultado.push('');
      enSeccion = true;
      continue;
    }
    
    // Aplicar formato según el tipo de respuesta
    switch (formatoActual) {
      case 'parrafo':
        if (linea.length > 0) {
          resultado.push(linea);
        }
        break;
        
      case 'pasos':
        if (linea.match(/^\d+\./)) {
          resultado.push(linea);
        } else if (linea.length > 0) {
          resultado.push(`${contadorLista}. ${linea}`);
          contadorLista++;
        }
        break;
        
      case 'datos':
        if (linea.startsWith('- ')) {
          resultado.push(linea);
        } else if (linea.length > 0) {
          resultado.push(`- ${linea}`);
        }
        break;
        
      default:
        if (linea.startsWith('- ')) {
          if (enSeccion) resultado.push('');
          resultado.push(linea);
          nivelIndentacion = 2;
          esLista = false;
          contadorLista = 1;
        } else if (linea.match(/^(\d+\.|[-•])\s+/) || 
        (i > 0 && lineas[i-1].match(/:\s*$/) && linea.length > 0)) {
          if (!esLista) {
            esLista = true;
            contadorLista = 1;
          }
          let contenido = linea.replace(/^(\d+\.|[-•])\s+/, '');
          resultado.push(' '.repeat(nivelIndentacion) + `${contadorLista}. ${contenido}`);
          contadorLista++;
        } else if (linea.length > 0) {
          esLista = false;
          resultado.push(linea);
        }
    }
  }
  
  // Asegurar que no haya líneas vacías al final
  while (resultado.length > 0 && resultado[resultado.length - 1] === '') {
    resultado.pop();
  }
  
  // Asegurar que la lista esté completa
  if (formatoActual === 'pasos' && resultado.length > 0) {
    const ultimaLinea = resultado[resultado.length - 1];
    if (ultimaLinea.match(/^\d+\.\s*$/)) {
      resultado.pop();
    }
  }
  
  return resultado.join('\n');
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

    // Verificar si la pregunta está relacionada con sismos
    if (!esPreguntaSismica(mensajeUsuario)) {
      return "Lo siento, solo estoy entrenado para responder preguntas relacionadas con sismos y actividad sísmica.";
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
        temperature: 0.3,
        stop: ["<|im_end|>", "<|im_start|>", "user:", "User:", "USER:", "Usuario:", "USUARIO:", "Human:"]
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
        return "Estamos experimentando mucho tráfico en este momento. Por favor, intenta de nuevo en unos minutos.";
      }
    }
    
    return "Lo siento, estoy teniendo problemas técnicos. ¿Podrías intentarlo más tarde?";
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