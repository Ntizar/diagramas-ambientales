/* Motor2 — ejemplos: estructura uniforme para los 8 tipos.
   { tipo, kicker, titulo, subtitulo, intro, tituloCentral, nodos:[{label,desc,icono,subs}], fuentes, notas } */
(function (root) {
  'use strict';
  const E = {
    pasos: {
      tipo: 'pasos', kicker: 'Tarea 3 · Metodología', titulo: 'Evolución de una zona tranquila',
      subtitulo: 'De la identificación preliminar a la verificación',
      nodos: [
        { label: 'Identificación preliminar', desc: 'Revisión de la información disponible para localizar espacios favorables.', subs: ['Cartografía acústica', 'Espacios protegidos'] },
        { label: 'Selección de candidatos', desc: 'Criterios acústicos, territoriales y funcionales.', subs: ['Accesibilidad', 'Compatibilidad de usos'] },
        { label: 'Validación', desc: 'Contraste con trabajo de campo y comprobación de afecciones.', subs: ['Mediciones', 'Encuestas'] },
        { label: 'Delimitación y caracterización', desc: 'Perímetro con límites reconocibles y descripción integral.', subs: ['SIG', 'Paisaje sonoro'] },
        { label: 'Verificación y seguimiento', desc: 'Mantenimiento de la tranquilidad con seguimiento periódico.', subs: ['Indicadores', 'Plan de medidas'] }
      ]
    },
    secuencia: {
      tipo: 'secuencia', kicker: 'Fases', titulo: 'Proceso en fases',
      subtitulo: 'Cinco hitos encadenados',
      nodos: [
        { label: 'Identificación', desc: 'Detección inicial', subs: ['MER'] },
        { label: 'Selección', desc: 'Criterios y filtros', subs: ['Multicriterio'] },
        { label: 'Validación', desc: 'Trabajo de campo', subs: ['Mediciones'] },
        { label: 'Delimitación', desc: 'Perímetro y coherencia', subs: ['SIG'] },
        { label: 'Seguimiento', desc: 'Control periódico', subs: ['Indicadores'] }
      ]
    },
    tarjetas: {
      tipo: 'tarjetas', kicker: 'Criterios', titulo: 'Criterios de evaluación',
      subtitulo: 'Seis familias de criterios',
      nodos: [
        { label: 'Acústicos', desc: 'Niveles, umbrales y evolución temporal.', subs: ['Lden', 'Lnight'] },
        { label: 'Territoriales y urbanísticos', desc: 'Planeamiento y compatibilidad de usos.', subs: ['Suelo', 'Planeamiento'] },
        { label: 'Ambientales y ecológicos', desc: 'Valores naturales del entorno.', subs: ['Red Natura'] },
        { label: 'Paisaje sonoro', desc: 'Percepción y cualidad del sonido.', subs: ['Grabaciones'] },
        { label: 'Sociales y funcionales', desc: 'Uso ciudadano del espacio.', subs: ['Aforos'] },
        { label: 'Gestión y participación', desc: 'Gobernanza y seguimiento.', subs: ['Encuestas'] }
      ]
    },
    radial: {
      tipo: 'radial', kicker: 'Síntesis', titulo: 'Área Potencialmente Tranquila',
      subtitulo: 'Criterios que la definen',
      nodos: [
        { label: 'APT' }, { label: 'Criterios acústicos' }, { label: 'Criterios territoriales' },
        { label: 'Criterios ambientales' }, { label: 'Paisaje sonoro' }, { label: 'Uso social' }, { label: 'Gestión' }
      ]
    },
    ciclo: {
      tipo: 'ciclo', kicker: 'Mejora continua', titulo: 'Metodología de zonas tranquilas',
      subtitulo: 'Mejora continua',
      nodos: [
        { label: 'Identificación preliminar', icono: 'lupa' },
        { label: 'Selección de candidatos', icono: 'mapa' },
        { label: 'Validación', icono: 'documento' },
        { label: 'Delimitación', icono: 'pin' },
        { label: 'Caracterización', icono: 'barras' },
        { label: 'Propuesta ZT', icono: 'hoja' },
        { label: 'Evaluación técnica', icono: 'portapapeles' }
      ]
    },
    concepto: {
      tipo: 'concepto', kicker: 'Tarea 3 · Herramientas', titulo: 'Herramientas para la identificación',
      tituloCentral: 'Herramientas de identificación y delimitación',
      nodos: [
        { label: 'Cartografía acústica', icono: 'mapa', subs: ['MER', 'Isofonas', 'Indicadores'] },
        { label: 'Sistemas de Información Geográfica', icono: 'bd', subs: ['Delimitación', 'Catastro', 'Parcelario'] },
        { label: 'Participación', icono: 'pajaro', subs: ['Encuestas', 'Cuestionarios', 'Percepción'] },
        { label: 'Información ambiental', icono: 'arbol', subs: ['Espacios protegidos', 'Red Natura 2000'] },
        { label: 'Mediciones acústicas', icono: 'micro', subs: ['Validación', 'Caracterización'] }
      ]
    },
    informe: {
      tipo: 'informe', kicker: 'Tarea 3 · Metodología', titulo: 'Proceso de identificación y delimitación de zonas tranquilas',
      subtitulo: 'Una aproximación integral para preservar los espacios tranquilos',
      intro: 'La identificación y delimitación requiere combinar fuentes cartográficas, ambientales, territoriales, funcionales y perceptivas.',
      nodos: [
        { label: 'Identificación preliminar', desc: 'Revisión de la información disponible para localizar espacios favorables.', icono: 'lupa', subs: ['Cartografía acústica', 'Espacios protegidos', 'Uso del suelo'] },
        { label: 'Selección de candidatos', desc: 'Criterios acústicos, territoriales y funcionales para escoger la candidatura.', icono: 'escudo', subs: ['Criterios multicriterio', 'Accesibilidad', 'Compatibilidad de usos'] },
        { label: 'Validación', desc: 'Contraste con trabajo de campo y comprobación de afecciones.', icono: 'pajaro', subs: ['Mediciones acústicas', 'Verificación in situ', 'Encuestas'] },
        { label: 'Delimitación', desc: 'Perímetro con límites reconocibles y coherencia funcional.', icono: 'pin', subs: ['SIG y cartografía', 'Límites naturales', 'Planeamiento'] },
        { label: 'Caracterización', desc: 'Descripción de valores acústicos, ambientales y sociales.', icono: 'documento', subs: ['Paisaje sonoro', 'Indicadores ambientales'] },
        { label: 'Gestión y seguimiento', desc: 'Mantenimiento de la tranquilidad con seguimiento periódico.', icono: 'onda', subs: ['Fichas de seguimiento', 'Plan de medidas'] },
        { label: 'Evaluación', desc: 'Valoración técnica de resultados y revisión de objetivos.', icono: 'chispa', subs: ['Valoración técnica', 'Actualización del MER'] }
      ],
      fuentes: [
        { icono: 'mapa', label: 'Cartografía oficial (MER)' }, { icono: 'micro', label: 'Mediciones in situ' },
        { icono: 'bd', label: 'SIG' }, { icono: 'arbol', label: 'Información ambiental' },
        { icono: 'pajaro', label: 'Participación ciudadana' }
      ],
      notas: [
        { icono: 'chispa', texto: 'El enfoque es flexible y se adapta al tipo de territorio.' },
        { icono: 'bd', texto: 'Los SIG y los Mapas Estratégicos de Ruido son el apoyo técnico principal.' },
        { icono: 'pajaro', texto: 'La percepción social matiza la evaluación final.' }
      ]
    },
    radial3: {
      tipo: 'radial3', kicker: 'Tarea 3 · Herramientas', titulo: 'Herramientas de identificación y delimitación',
      tituloCentral: 'Herramientas de identificación y delimitación',
      nodos: [
        { label: 'Cartografía acústica', icono: 'mapa', subs: ['Mapas de ruido', 'Isofonas', 'Indicadores'] },
        { label: 'SIG', icono: 'bd', subs: ['Delimitación cartográfica', 'Catastro', 'Parcelario'] },
        { label: 'Participación', icono: 'pajaro', subs: ['Entrevistas', 'Encuestas', 'Percepción ciudadana'] },
        { label: 'Información ambiental', icono: 'arbol', subs: ['Espacios protegidos', 'Red Natura 2000'] },
        { label: 'Mediciones acústicas', icono: 'micro', subs: ['Campañas de medición', 'Validación in situ'] }
      ]
    }
  };
  root.EJEMPLOS2 = E;
  if (typeof module !== 'undefined' && module.exports) module.exports = E;
})(typeof window !== 'undefined' ? window : globalThis);
