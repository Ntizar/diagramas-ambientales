// ============================================================
// ESTILOS Y CATÁLOGO — 30 conceptos × 2 variantes × 5 estilos = 300 logos.
// El estilo se aplica con CSS interno del SVG: mismo dibujo, piel distinta.
// ============================================================
const { ESQUEMAS, TIPOS_DIAGRAMA, textosDefault, tinte } = require('./paleta');
const { G } = require('./generadores');
const { G: GD } = require('./smartart');


const CATEGORIAS = ['Naturaleza', 'Agua', 'Energía', 'Movilidad', 'Fauna', 'Territorio'];

const CONCEPTOS = [
  { id: 'arbol', nombre: 'Árbol frondoso', cat: 'Naturaleza' },
  { id: 'pino', nombre: 'Pino', cat: 'Naturaleza' },
  { id: 'hoja', nombre: 'Hoja', cat: 'Naturaleza' },
  { id: 'montana', nombre: 'Montaña', cat: 'Territorio' },
  { id: 'carretera', nombre: 'Carretera', cat: 'Movilidad' },
  { id: 'camino', nombre: 'Camino sinuoso', cat: 'Movilidad' },
  { id: 'puente', nombre: 'Puente', cat: 'Movilidad' },
  { id: 'turbina', nombre: 'Aerogenerador', cat: 'Energía' },
  { id: 'panel-solar', nombre: 'Panel solar', cat: 'Energía' },
  { id: 'gota', nombre: 'Gota de agua', cat: 'Agua' },
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
  { id: 'aire', nombre: 'Calidad del aire', cat: 'Territorio' },
  { id: 'hidro', nombre: 'Energía hidráulica', cat: 'Energía' },
  { id: 'geotermia', nombre: 'Geotermia', cat: 'Energía' },
  { id: 'bici', nombre: 'Bicicleta', cat: 'Movilidad' },
  { id: 'bus', nombre: 'Transporte público', cat: 'Movilidad' },
  { id: 'rayo', nombre: 'Energía limpia', cat: 'Energía' },
  { id: 'huella', nombre: 'Huella ambiental', cat: 'Fauna' },
  { id: 'colmena', nombre: 'Polinización', cat: 'Fauna' },
  { id: 'paisaje', nombre: 'Paisaje', cat: 'Territorio' },
  { id: 'brujula', nombre: 'Orientación', cat: 'Territorio' },
];

const ESTILOS = [
  { id: 'plano', nombre: 'Plano' },
  { id: 'linea', nombre: 'Línea' },
  { id: 'duotono', nombre: 'Duotono' },
  { id: 'degradado', nombre: 'Degradado' },
  { id: 'insignia', nombre: 'Insignia' },
];

const VARIANTES = [
  { id: 1, nombre: 'Composición A' },
  { id: 2, nombre: 'Composición B' },
];

// CSS del estilo: mapea clases .cN (relleno), .stN (trazo), .f (blanco fijo), .fw (fondo blanco)
function cssEstilo(estiloId, esq, uid) {
  const { primario, secundario, acento, neutro } = esq;
  if (estiloId === 'plano') {
    return `.c1{fill:${primario}}.c2{fill:${secundario}}.c3{fill:${acento}}.c4{fill:${neutro}}
      .st1{fill:none;stroke:${primario}}.st2{fill:none;stroke:${secundario}}.st3{fill:none;stroke:${acento}}.st4{fill:none;stroke:${neutro}}
      .f{fill:#fff}.fw{fill:none;stroke:#fff}`;
  }
  if (estiloId === 'linea') {
    return `.c1{fill:${tinte(primario, 0.92)}}.c2{fill:${tinte(secundario, 0.92)}}.c3{fill:${tinte(acento, 0.85)}}.c4{fill:${tinte(neutro, 0.9)}}
      .st1{fill:none;stroke:${primario};stroke-linecap:round;stroke-linejoin:round}.st2{fill:none;stroke:${secundario};stroke-linecap:round;stroke-linejoin:round}
      .st3{fill:none;stroke:${acento};stroke-linecap:round}.st4{fill:none;stroke:${neutro};stroke-linecap:round}
      .f{fill:#fff}.fw{fill:none;stroke:${primario}}`;
  }
  if (estiloId === 'duotono') {
    return `.c1{fill:${primario}}.c2{fill:${tinte(primario, 0.55)}}.c3{fill:${secundario}}.c4{fill:${tinte(primario, 0.78)}}
      .st1{fill:none;stroke:${primario}}.st2{fill:none;stroke:${tinte(primario, 0.4)}}.st3{fill:none;stroke:${secundario}}.st4{fill:none;stroke:${tinte(primario, 0.25)}}
      .f{fill:#fff}.fw{fill:none;stroke:#fff}`;
  }
  if (estiloId === 'degradado') {
    return `.c1{fill:url(#gr${uid})}.c2{fill:url(#gr${uid})}.c3{fill:${acento}}.c4{fill:${tinte(primario, 0.35)}}
      .st1{fill:none;stroke:url(#gr${uid})}.st2{fill:none;stroke:url(#gr${uid})}.st3{fill:none;stroke:${acento}}.st4{fill:none;stroke:${tinte(primario, 0.35)}}
      .f{fill:#fff}.fw{fill:none;stroke:#fff}`;
  }
  // insignia
  return `.c1{fill:#fff}.c2{fill:${tinte(secundario, 0.78)}}.c3{fill:${acento}}.c4{fill:${tinte(primario, 0.3)}}
    .st1{fill:none;stroke:${primario}}.st2{fill:none;stroke:${secundario};stroke-linecap:round}.st3{fill:none;stroke:${acento}}.st4{fill:none;stroke:${primario}}
    .f{fill:${primario}}.fw{fill:none;stroke:${primario}}`;
}

function defsEstilo(estiloId, esq, uid) {
  if (estiloId !== 'degradado') return '';
  return `<defs><linearGradient id="gr${uid}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${esq.primario}"/><stop offset="1" stop-color="${esq.secundario}"/>
  </linearGradient></defs>`;
}

function fondoEstilo(estiloId, esq, uid) {
  if (estiloId === 'insignia') {
    return `<circle cx="256" cy="256" r="242" fill="${esq.primario}"/><circle cx="256" cy="256" r="212" fill="none" stroke="${esq.acento}" stroke-width="6"/>`;
  }
  return '';
}

function render(logo) {
  const esq = ESQUEMAS.find(e => e.id === logo.esquema);
  const gen = G[logo.concepto];
  if (!esq) throw new Error('Esquema desconocido: ' + logo.esquema);
  if (!gen) throw new Error('Concepto desconocido: ' + logo.concepto);
  const uid = logo.id.replace(/[^a-z0-9]/gi, '');
  const css = cssEstilo(logo.estilo, esq, uid);
  const cuerpo = gen(esq, logo.variante, uid);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">`
    + `<style>${css}</style>` + defsEstilo(logo.estilo, esq, uid) + fondoEstilo(logo.estilo, esq, uid) + cuerpo + `</svg>`;
}

// SELECCIÓN — 300 logos: 30 conceptos × (2 composiciones × 5 estilos),
// cada uno con un esquema de color distinto. Verificar.js comprueba que
// son exactamente 300 y todos con dibujo diferente.
const SELECCION = [
  ['arbol',1,'plano','corporativo'],['arbol',1,'linea','azul-pro'],['arbol',1,'duotono','verde-eco'],['arbol',1,'degradado','agua'],['arbol',1,'insignia','tierra'],
  ['arbol',2,'plano','energia'],['arbol',2,'linea','atardecer'],['arbol',2,'duotono','biodiversidad'],['arbol',2,'degradado','oceanico'],['arbol',2,'insignia','monocromo'],
  ['pino',1,'plano','corporativo'],['pino',1,'linea','azul-pro'],['pino',1,'duotono','verde-eco'],['pino',1,'degradado','agua'],['pino',1,'insignia','tierra'],
  ['pino',2,'plano','energia'],['pino',2,'linea','atardecer'],['pino',2,'duotono','biodiversidad'],['pino',2,'degradado','oceanico'],['pino',2,'insignia','monocromo'],
  ['hoja',1,'plano','corporativo'],['hoja',1,'linea','azul-pro'],['hoja',1,'duotono','verde-eco'],['hoja',1,'degradado','agua'],['hoja',1,'insignia','tierra'],
  ['hoja',2,'plano','energia'],['hoja',2,'linea','atardecer'],['hoja',2,'duotono','biodiversidad'],['hoja',2,'degradado','oceanico'],['hoja',2,'insignia','monocromo'],
  ['montana',1,'plano','corporativo'],['montana',1,'linea','azul-pro'],['montana',1,'duotono','verde-eco'],['montana',1,'degradado','agua'],['montana',1,'insignia','tierra'],
  ['montana',2,'plano','energia'],['montana',2,'linea','atardecer'],['montana',2,'duotono','biodiversidad'],['montana',2,'degradado','oceanico'],['montana',2,'insignia','monocromo'],
  ['carretera',1,'plano','corporativo'],['carretera',1,'linea','azul-pro'],['carretera',1,'duotono','verde-eco'],['carretera',1,'degradado','agua'],['carretera',1,'insignia','tierra'],
  ['carretera',2,'plano','energia'],['carretera',2,'linea','atardecer'],['carretera',2,'duotono','biodiversidad'],['carretera',2,'degradado','oceanico'],['carretera',2,'insignia','monocromo'],
  ['camino',1,'plano','corporativo'],['camino',1,'linea','azul-pro'],['camino',1,'duotono','verde-eco'],['camino',1,'degradado','agua'],['camino',1,'insignia','tierra'],
  ['camino',2,'plano','energia'],['camino',2,'linea','atardecer'],['camino',2,'duotono','biodiversidad'],['camino',2,'degradado','oceanico'],['camino',2,'insignia','monocromo'],
  ['puente',1,'plano','corporativo'],['puente',1,'linea','azul-pro'],['puente',1,'duotono','verde-eco'],['puente',1,'degradado','agua'],['puente',1,'insignia','tierra'],
  ['puente',2,'plano','energia'],['puente',2,'linea','atardecer'],['puente',2,'duotono','biodiversidad'],['puente',2,'degradado','oceanico'],['puente',2,'insignia','monocromo'],
  ['turbina',1,'plano','corporativo'],['turbina',1,'linea','azul-pro'],['turbina',1,'duotono','verde-eco'],['turbina',1,'degradado','agua'],['turbina',1,'insignia','tierra'],
  ['turbina',2,'plano','energia'],['turbina',2,'linea','atardecer'],['turbina',2,'duotono','biodiversidad'],['turbina',2,'degradado','oceanico'],['turbina',2,'insignia','monocromo'],
  ['panel-solar',1,'plano','corporativo'],['panel-solar',1,'linea','azul-pro'],['panel-solar',1,'duotono','verde-eco'],['panel-solar',1,'degradado','agua'],['panel-solar',1,'insignia','tierra'],
  ['panel-solar',2,'plano','energia'],['panel-solar',2,'linea','atardecer'],['panel-solar',2,'duotono','biodiversidad'],['panel-solar',2,'degradado','oceanico'],['panel-solar',2,'insignia','monocromo'],
  ['gota',1,'plano','corporativo'],['gota',1,'linea','azul-pro'],['gota',1,'duotono','verde-eco'],['gota',1,'degradado','agua'],['gota',1,'insignia','tierra'],
  ['gota',2,'plano','energia'],['gota',2,'linea','atardecer'],['gota',2,'duotono','biodiversidad'],['gota',2,'degradado','oceanico'],['gota',2,'insignia','monocromo'],
  ['olas',1,'plano','corporativo'],['olas',1,'linea','azul-pro'],['olas',1,'duotono','verde-eco'],['olas',1,'degradado','agua'],['olas',1,'insignia','tierra'],
  ['olas',2,'plano','energia'],['olas',2,'linea','atardecer'],['olas',2,'duotono','biodiversidad'],['olas',2,'degradado','oceanico'],['olas',2,'insignia','monocromo'],
  ['reciclaje',1,'plano','corporativo'],['reciclaje',1,'linea','azul-pro'],['reciclaje',1,'duotono','verde-eco'],['reciclaje',1,'degradado','agua'],['reciclaje',1,'insignia','tierra'],
  ['reciclaje',2,'plano','energia'],['reciclaje',2,'linea','atardecer'],['reciclaje',2,'duotono','biodiversidad'],['reciclaje',2,'degradado','oceanico'],['reciclaje',2,'insignia','monocromo'],
  ['planeta',1,'plano','corporativo'],['planeta',1,'linea','azul-pro'],['planeta',1,'duotono','verde-eco'],['planeta',1,'degradado','agua'],['planeta',1,'insignia','tierra'],
  ['planeta',2,'plano','energia'],['planeta',2,'linea','atardecer'],['planeta',2,'duotono','biodiversidad'],['planeta',2,'degradado','oceanico'],['planeta',2,'insignia','monocromo'],
  ['brote',1,'plano','corporativo'],['brote',1,'linea','azul-pro'],['brote',1,'duotono','verde-eco'],['brote',1,'degradado','agua'],['brote',1,'insignia','tierra'],
  ['brote',2,'plano','energia'],['brote',2,'linea','atardecer'],['brote',2,'duotono','biodiversidad'],['brote',2,'degradado','oceanico'],['brote',2,'insignia','monocromo'],
  ['flor',1,'plano','corporativo'],['flor',1,'linea','azul-pro'],['flor',1,'duotono','verde-eco'],['flor',1,'degradado','agua'],['flor',1,'insignia','tierra'],
  ['flor',2,'plano','energia'],['flor',2,'linea','atardecer'],['flor',2,'duotono','biodiversidad'],['flor',2,'degradado','oceanico'],['flor',2,'insignia','monocromo'],
  ['ave',1,'plano','corporativo'],['ave',1,'linea','azul-pro'],['ave',1,'duotono','verde-eco'],['ave',1,'degradado','agua'],['ave',1,'insignia','tierra'],
  ['ave',2,'plano','energia'],['ave',2,'linea','atardecer'],['ave',2,'duotono','biodiversidad'],['ave',2,'degradado','oceanico'],['ave',2,'insignia','monocromo'],
  ['pez',1,'plano','corporativo'],['pez',1,'linea','azul-pro'],['pez',1,'duotono','verde-eco'],['pez',1,'degradado','agua'],['pez',1,'insignia','tierra'],
  ['pez',2,'plano','energia'],['pez',2,'linea','atardecer'],['pez',2,'duotono','biodiversidad'],['pez',2,'degradado','oceanico'],['pez',2,'insignia','monocromo'],
  ['bosque',1,'plano','corporativo'],['bosque',1,'linea','azul-pro'],['bosque',1,'duotono','verde-eco'],['bosque',1,'degradado','agua'],['bosque',1,'insignia','tierra'],
  ['bosque',2,'plano','energia'],['bosque',2,'linea','atardecer'],['bosque',2,'duotono','biodiversidad'],['bosque',2,'degradado','oceanico'],['bosque',2,'insignia','monocromo'],
  ['sendero',1,'plano','corporativo'],['sendero',1,'linea','azul-pro'],['sendero',1,'duotono','verde-eco'],['sendero',1,'degradado','agua'],['sendero',1,'insignia','tierra'],
  ['sendero',2,'plano','energia'],['sendero',2,'linea','atardecer'],['sendero',2,'duotono','biodiversidad'],['sendero',2,'degradado','oceanico'],['sendero',2,'insignia','monocromo'],
  ['ciudad-verde',1,'plano','corporativo'],['ciudad-verde',1,'linea','azul-pro'],['ciudad-verde',1,'duotono','verde-eco'],['ciudad-verde',1,'degradado','agua'],['ciudad-verde',1,'insignia','tierra'],
  ['ciudad-verde',2,'plano','energia'],['ciudad-verde',2,'linea','atardecer'],['ciudad-verde',2,'duotono','biodiversidad'],['ciudad-verde',2,'degradado','oceanico'],['ciudad-verde',2,'insignia','monocromo'],
  ['aire',1,'plano','corporativo'],['aire',1,'linea','azul-pro'],['aire',1,'duotono','verde-eco'],['aire',1,'degradado','agua'],['aire',1,'insignia','tierra'],
  ['aire',2,'plano','energia'],['aire',2,'linea','atardecer'],['aire',2,'duotono','biodiversidad'],['aire',2,'degradado','oceanico'],['aire',2,'insignia','monocromo'],
  ['hidro',1,'plano','corporativo'],['hidro',1,'linea','azul-pro'],['hidro',1,'duotono','verde-eco'],['hidro',1,'degradado','agua'],['hidro',1,'insignia','tierra'],
  ['hidro',2,'plano','energia'],['hidro',2,'linea','atardecer'],['hidro',2,'duotono','biodiversidad'],['hidro',2,'degradado','oceanico'],['hidro',2,'insignia','monocromo'],
  ['geotermia',1,'plano','corporativo'],['geotermia',1,'linea','azul-pro'],['geotermia',1,'duotono','verde-eco'],['geotermia',1,'degradado','agua'],['geotermia',1,'insignia','tierra'],
  ['geotermia',2,'plano','energia'],['geotermia',2,'linea','atardecer'],['geotermia',2,'duotono','biodiversidad'],['geotermia',2,'degradado','oceanico'],['geotermia',2,'insignia','monocromo'],
  ['bici',1,'plano','corporativo'],['bici',1,'linea','azul-pro'],['bici',1,'duotono','verde-eco'],['bici',1,'degradado','agua'],['bici',1,'insignia','tierra'],
  ['bici',2,'plano','energia'],['bici',2,'linea','atardecer'],['bici',2,'duotono','biodiversidad'],['bici',2,'degradado','oceanico'],['bici',2,'insignia','monocromo'],
  ['bus',1,'plano','corporativo'],['bus',1,'linea','azul-pro'],['bus',1,'duotono','verde-eco'],['bus',1,'degradado','agua'],['bus',1,'insignia','tierra'],
  ['bus',2,'plano','energia'],['bus',2,'linea','atardecer'],['bus',2,'duotono','biodiversidad'],['bus',2,'degradado','oceanico'],['bus',2,'insignia','monocromo'],
  ['rayo',1,'plano','corporativo'],['rayo',1,'linea','azul-pro'],['rayo',1,'duotono','verde-eco'],['rayo',1,'degradado','agua'],['rayo',1,'insignia','tierra'],
  ['rayo',2,'plano','energia'],['rayo',2,'linea','atardecer'],['rayo',2,'duotono','biodiversidad'],['rayo',2,'degradado','oceanico'],['rayo',2,'insignia','monocromo'],
  ['huella',1,'plano','corporativo'],['huella',1,'linea','azul-pro'],['huella',1,'duotono','verde-eco'],['huella',1,'degradado','agua'],['huella',1,'insignia','tierra'],
  ['huella',2,'plano','energia'],['huella',2,'linea','atardecer'],['huella',2,'duotono','biodiversidad'],['huella',2,'degradado','oceanico'],['huella',2,'insignia','monocromo'],
  ['colmena',1,'plano','corporativo'],['colmena',1,'linea','azul-pro'],['colmena',1,'duotono','verde-eco'],['colmena',1,'degradado','agua'],['colmena',1,'insignia','tierra'],
  ['colmena',2,'plano','energia'],['colmena',2,'linea','atardecer'],['colmena',2,'duotono','biodiversidad'],['colmena',2,'degradado','oceanico'],['colmena',2,'insignia','monocromo'],
  ['paisaje',1,'plano','corporativo'],['paisaje',1,'linea','azul-pro'],['paisaje',1,'duotono','verde-eco'],['paisaje',1,'degradado','agua'],['paisaje',1,'insignia','tierra'],
  ['paisaje',2,'plano','energia'],['paisaje',2,'linea','atardecer'],['paisaje',2,'duotono','biodiversidad'],['paisaje',2,'degradado','oceanico'],['paisaje',2,'insignia','monocromo'],
  ['brujula',1,'plano','corporativo'],['brujula',1,'linea','azul-pro'],['brujula',1,'duotono','verde-eco'],['brujula',1,'degradado','agua'],['brujula',1,'insignia','tierra'],
  ['brujula',2,'plano','energia'],['brujula',2,'linea','atardecer'],['brujula',2,'duotono','biodiversidad'],['brujula',2,'degradado','oceanico'],['brujula',2,'insignia','monocromo'],
];

// ============================================================
// CATÁLOGO UNIFICADO — 50 diagramas + 50 logos.
// Los esquemas son editables en vivo desde el editor, así que
// el catálogo reparte esquemas para que la galería luzca variada.
// ============================================================

Object.assign(G, GD);

function construirCatalogo() {
  const items = [];

  // ---- 50 DIAGRAMAS ----
  const ordenEsqD = ['corporativo','verde-eco','azul-pro','agua','energia','tierra','biodiversidad','atardecer','oceanico','monocromo'];
  TIPOS_DIAGRAMA.forEach((t, i) => {
    items.push({
      id: 'd-' + t.id,
      clase: 'diagrama',
      tipo: t.id,
      nombre: t.nombre,
      categoria: t.cat,
      esquema: ordenEsqD[i % 10],
      pasos: t.pasos,
    });
  });
  // 20 diagramas adicionales: los 20 primeros tipos con otro esquema
  TIPOS_DIAGRAMA.slice(0, 20).forEach((t, i) => {
    items.push({
      id: 'd2-' + t.id,
      clase: 'diagrama',
      tipo: t.id,
      nombre: t.nombre + ' · ' + ESQUEMAS[(i + 1) % 10].nombre,
      categoria: t.cat,
      esquema: ordenEsqD[(i + 1) % 10],
      pasos: t.pasos,
    });
  });

  // ---- 50 LOGOS ----
  const ordenEsqL = ['corporativo','verde-eco','azul-pro','agua','energia','tierra','biodiversidad','atardecer','oceanico','monocromo'];
  const estilos = ['plano','linea','duotono','degradado','insignia'];
  CONCEPTOS.forEach((c, i) => {
    items.push({
      id: 'l-' + c.id + '-v1-' + estilos[i % 5],
      clase: 'logo',
      concepto: c.id,
      nombre: c.nombre,
      categoria: c.cat,
      variante: 1,
      estilo: estilos[i % 5],
      esquema: ordenEsqL[i % 10],
    });
  });
  // 20 logos adicionales: composición 2 con otro estilo/esquema
  CONCEPTOS.slice(0, 20).forEach((c, i) => {
    items.push({
      id: 'l2-' + c.id + '-v2-' + estilos[(i + 2) % 5],
      clase: 'logo',
      concepto: c.id,
      nombre: c.nombre + ' · B',
      categoria: c.cat,
      variante: 2,
      estilo: estilos[(i + 2) % 5],
      esquema: ordenEsqL[(i + 3) % 10],
    });
  });

  return items;
}

const CATALOGO = construirCatalogo();

function render(item) {
  const esq = ESQUEMAS.find(e => e.id === item.esquema);
  if (!esq) throw new Error('Esquema desconocido: ' + item.esquema);
  if (item.clase === 'diagrama') {
    const gen = G[item.tipo];
    if (!gen) throw new Error('Diagrama desconocido: ' + item.tipo);
    const textos = item.textos || textosDefault(item.pasos);
    const cuerpo = gen(esq, textos);
    let extra = '';
    if (item.logoConcepto) {
      const genLogo = G[item.logoConcepto];
      if (genLogo) {
        const uid = 'ins' + item.id.replace(/[^a-z0-9]/gi, '');
        const css = cssEstilo(item.logoEstilo || 'plano', esq, uid);
        const logoCuerpo = genLogo(esq, item.logoVariante || 1, uid);
        const zona = ZONAS_CENTRALES[item.tipo] || { cx: 400, cy: 250, r: 52 };
        // el logo 512x512 se escala al diámetro de la zona central
        const d = zona.r * 2;
        const escala = d / 512;
        extra = '<circle cx="' + zona.cx + '" cy="' + zona.cy + '" r="' + (zona.r + 6) + '" fill="#FFFFFF"/>'
          + '<style>' + css + '</style>'
          + '<g transform="translate(' + (zona.cx - zona.r) + ' ' + (zona.cy - zona.r) + ') scale(' + escala + ')">'
          + defsEstilo(item.logoEstilo || 'plano', esq, uid) + logoCuerpo + '</g>';
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">'
      + cuerpo + extra + '</svg>';
  }
  const gen = G[item.concepto];
  if (!gen) throw new Error('Logo desconocido: ' + item.concepto);
  const uid = item.id.replace(/[^a-z0-9]/gi, '');
  const css = cssEstilo(item.estilo, esq, uid);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">'
    + '<style>' + css + '</style>' + defsEstilo(item.estilo, esq, uid) + fondoEstilo(item.estilo, esq, uid)
    + gen(esq, item.variante, uid) + '</svg>';
}

// Zona central de los diagramas que admiten logo incrustado (círculo central o hueco)
const ZONAS_CENTRALES = {
  'ciclo-4': { cx: 400, cy: 250, r: 54 },
  'ciclo-6': { cx: 400, cy: 250, r: 54 },
  'ciclo-orbital': { cx: 400, cy: 250, r: 46 },
  'ciclo-segmentos': { cx: 400, cy: 250, r: 44 },
  'relacion-radial': { cx: 400, cy: 250, r: 56 },
  'relacion-venn-3': { cx: 400, cy: 245, r: 34 },
  'proceso-pilares': { cx: 400, cy: 330, r: 40 },
};

const CATEGORIAS_UNIFICADAS = [...new Set(CATALOGO.map(p => p.categoria))];

module.exports = { CATALOGO, render, CONCEPTOS, ESTILOS, CATEGORIAS_UNIFICADAS, cssEstilo, defsEstilo, fondoEstilo };
