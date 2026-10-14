// ============================================================
// CATÁLOGO — logos y estilos para el editor Cuadros.
// CONCEPTOS: los 30 dibujos. render(): SVG de un logo.
// ============================================================
const { ESQUEMAS, TIPOS_SMARTART_UNUSED, textosDefault, tinte } = require('./paleta');
const { G } = require('./generadores');
const { cssEstilo, defsEstilo, fondoEstilo } = require('./catalogo-estilos');

const CATEGORIAS = ['Naturaleza', 'Agua', 'Energía', 'Movilidad', 'Fauna', 'Territorio'];

const CONCEPTOS = [
  { id: 'arbol', nombre: 'Árbol', cat: 'Naturaleza' },
  { id: 'pino', nombre: 'Pino', cat: 'Naturaleza' },
  { id: 'hoja', nombre: 'Hoja', cat: 'Naturaleza' },
  { id: 'montana', nombre: 'Montaña', cat: 'Territorio' },
  { id: 'carretera', nombre: 'Carretera', cat: 'Movilidad' },
  { id: 'camino', nombre: 'Camino', cat: 'Movilidad' },
  { id: 'puente', nombre: 'Puente', cat: 'Movilidad' },
  { id: 'turbina', nombre: 'Aerogenerador', cat: 'Energía' },
  { id: 'panel-solar', nombre: 'Panel solar', cat: 'Energía' },
  { id: 'gota', nombre: 'Gota', cat: 'Agua' },
  { id: 'olas', nombre: 'Olas', cat: 'Agua' },
  { id: 'reciclaje', nombre: 'Reciclaje', cat: 'Territorio' },
  { id: 'planeta', nombre: 'Planeta', cat: 'Territorio' },
  { id: 'brote', nombre: 'Brote', cat: 'Naturaleza' },
  { id: 'flor', nombre: 'Flor', cat: 'Naturaleza' },
  { id: 'ave', nombre: 'Ave', cat: 'Fauna' },
  { id: 'pez', nombre: 'Pez', cat: 'Fauna' },
  { id: 'bosque', nombre: 'Bosque', cat: 'Naturaleza' },
  { id: 'sendero', nombre: 'Sendero', cat: 'Movilidad' },
  { id: 'ciudad-verde', nombre: 'Ciudad verde', cat: 'Territorio' },
  { id: 'aire', nombre: 'Aire', cat: 'Territorio' },
  { id: 'hidro', nombre: 'Hidráulica', cat: 'Energía' },
  { id: 'geotermia', nombre: 'Geotermia', cat: 'Energía' },
  { id: 'bici', nombre: 'Bicicleta', cat: 'Movilidad' },
  { id: 'bus', nombre: 'Bus', cat: 'Movilidad' },
  { id: 'rayo', nombre: 'Rayo', cat: 'Energía' },
  { id: 'huella', nombre: 'Huella', cat: 'Fauna' },
  { id: 'colmena', nombre: 'Polinización', cat: 'Fauna' },
  { id: 'paisaje', nombre: 'Paisaje', cat: 'Territorio' },
  { id: 'brujula', nombre: 'Orientación', cat: 'Territorio' },
];

const ESTILOS = ['plano', 'linea', 'duotono', 'degradado', 'insignia'];

function render(item) {
  const esq = ESQUEMAS.find(e => e.id === item.esquema) || ESQUEMAS[0];
  const gen = G[item.concepto];
  if (!gen) throw new Error('Logo desconocido: ' + item.concepto);
  const uid = (item.id || item.concepto).replace(/[^a-z0-9]/gi, '');
  const estilo = item.estilo || 'plano';
  const css = cssEstilo(estilo, esq, uid);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">'
    + '<style>' + css + '</style>' + defsEstilo(estilo, esq, uid) + fondoEstilo(estilo, esq, uid)
    + gen(esq, item.variante || 1, uid) + '</svg>';
}

module.exports = { CATALOGO: [], render, CONCEPTOS, ESTILOS };
