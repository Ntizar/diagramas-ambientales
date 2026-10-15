// Catálogo de ejemplos — uno por layout (universal: node + navegador)
// Ejemplos de referencia — uno por layout, con contenido real de zonas tranquilas
var EJEMPLOS = {
  vertical: {
    layout: 'vertical', style: 'dark', color: '#34D399', logo: 'hoja',
    kicker: 'Tarea 3 · Metodología', titulo: 'Evolución de una zona tranquila',
    nodos: [
      { label: 'Identificación preliminar → APT' },
      { label: 'Selección de espacios candidatos → AC' },
      { label: 'Validación → ACV' },
      { label: 'Delimitación + caracterización → ZTP' },
      { label: 'Verificación y seguimiento → ZT' }
    ]
  },
  horizontal: {
    layout: 'horizontal', style: 'light', color: '#A3E635', logo: 'montana',
    kicker: 'Fases', titulo: 'Proceso en fases',
    nodos: [
      { label: 'Identificación' }, { label: 'Selección' }, { label: 'Validación' },
      { label: 'Delimitación' }, { label: 'Seguimiento' }
    ]
  },
  radial: {
    layout: 'radial', style: 'dark', color: '#38BDF8', logo: 'chispa',
    kicker: 'Síntesis', titulo: 'Área Potencialmente Tranquila',
    nodos: [
      { label: 'APT' }, { label: 'Criterios acústicos' }, { label: 'Criterios territoriales' },
      { label: 'Criterios ambientales' }, { label: 'Paisaje sonoro' }, { label: 'Uso social' },
      { label: 'Gestión' }
    ]
  },
  cards: {
    layout: 'cards', style: 'light', color: '#2DD4BF', logo: 'onda', destacada: 0,
    kicker: 'Criterios', titulo: 'Criterios de evaluación',
    nodos: [
      { label: 'Acústicos: niveles y umbrales' }, { label: 'Territoriales y urbanísticos' },
      { label: 'Ambientales y ecológicos' }, { label: 'Paisaje sonoro' },
      { label: 'Sociales y funcionales' }, { label: 'Gestión y participación' }
    ]
  },
  ciclo: {
    layout: 'ciclo', style: 'dark', color: '#34D399',
    titulo: 'Metodología de zonas tranquilas', subtitulo: 'Mejora continua', logoIcono: 'arbol',
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
    layout: 'concepto', style: 'light', color: '#34D399', logo: 'bd',
    kicker: 'Tarea 3 · Herramientas', titulo: 'Herramientas para la identificación',
    tituloCentral: 'Herramientas de identificación y delimitación',
    nodos: [
      { label: 'Cartografía acústica', icono: 'mapa', subs: ['MER', 'Isofonas', 'Indicadores acústicos'] },
      { label: 'Sistemas de Información Geográfica', icono: 'bd', subs: ['Delimitación cartográfica', 'Catastro', 'Parcelario'] },
      { label: 'Participación', icono: 'pajaro', subs: ['Encuestas', 'Cuestionarios', 'Percepción ciudadana'] },
      { label: 'Información ambiental', icono: 'arbol', subs: ['Espacios protegidos', 'Red Natura 2000'] },
      { label: 'Mediciones acústicas', icono: 'micro', subs: ['Validación', 'Caracterización acústica'] }
    ]
  },
  infografia: {
    layout: 'infografia', style: 'light', color: '#1FA971', logo: 'hoja',
    titulo: 'Proceso de identificación y delimitación de zonas tranquilas',
    subtitulo: 'Una aproximación integral para preservar los espacios tranquilos',
    intro: 'La identificación y delimitación requiere la utilización combinada de fuentes de información cartográficas, ambientales, territoriales, funcionales y perceptivas.',
    nodos: [
      { label: 'Identificación preliminar', icono: 'lupa', desc: 'Revisión de la información disponible para localizar espacios con condiciones favorables.', subs: ['Cartografía acústica', 'Espacios protegidos', 'Uso del suelo'] },
      { label: 'Selección de candidatos', icono: 'escudo', desc: 'Aplicación de criterios acústicos, territoriales y funcionales para escoger la mejor candidatura.', subs: ['Criterios multicriterio', 'Accesibilidad', 'Compatibilidad de usos'] },
      { label: 'Validación', icono: 'pajaro', desc: 'Contraste de la información con trabajo de campo y comprobación de afecciones.', subs: ['Mediciones acústicas', 'Verificación in situ', 'Encuestas de percepción'] },
      { label: 'Delimitación', icono: 'pin', desc: 'Definición del perímetro con límites reconocibles y coherencia funcional.', subs: ['SIG y cartografía', 'Límites naturales', 'Planeamiento'] },
      { label: 'Caracterización', icono: 'documento', desc: 'Descripción integral del espacio: valores acústicos, ambientales y sociales.', subs: ['Paisaje sonoro', 'Indicadores ambientales', 'Valores sociales'] },
      { label: 'Gestión y seguimiento', icono: 'onda', desc: 'Mantenimiento de las condiciones de tranquilidad con seguimiento periódico.', subs: ['Fichas de seguimiento', 'Indicadores de control', 'Plan de medidas'] },
      { label: 'Evaluación', icono: 'chispa', desc: 'Valoración técnica de resultados y revisión de objetivos.', subs: ['Valoración técnica', 'Revisión periódica', 'Actualización MER'] }
    ],
    fuentes: [
      { icono: 'mapa', label: 'Cartografía oficial (MER)' },
      { icono: 'micro', label: 'Mediciones in situ' },
      { icono: 'bd', label: 'Sistemas de Información Geográfica' },
      { icono: 'arbol', label: 'Información ambiental' },
      { icono: 'pajaro', label: 'Participación ciudadana' }
    ],
    fuentesNota: 'Se utilizan de forma combinada a lo largo de todas las etapas del proceso',
    notas: [
      { icono: 'chispa', texto: 'El enfoque es flexible y se adapta al tipo de territorio (aglomeración o campo abierto).' },
      { icono: 'bd', texto: 'Los SIG y los Mapas Estratégicos de Ruido constituyen el apoyo técnico principal.' },
      { icono: 'pajaro', texto: 'La percepción social y la participación ciudadana matizan la evaluación final.' }
    ],
    cierre: 'Una aproximación integral para preservar y poner en valor los espacios tranquilos'
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = EJEMPLOS;
if (typeof window !== 'undefined') window.EJEMPLOS = EJEMPLOS;
