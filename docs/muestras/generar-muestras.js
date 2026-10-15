// Genera un HTML (y luego PDF) con UNA muestra de cada tipo de diagrama,
// usando el MOTOR REAL del repo. Los ids de cada SVG se renombran por página
// para que no colisionen entre sí (bug conocido de ids duplicados en SVG).
const path = require('path');
const fs = require('fs');
const RAIZ = '/home/nan/Projects/diagramas-ambientales/src/smartart';
const Motor2026 = require(path.join(RAIZ, 'motor.js'));
const LayoutsExtra = require(path.join(RAIZ, 'layouts.js'));
const LayoutInfografia = require(path.join(RAIZ, 'infografia.js'));
const EJEMPLOS = require(path.join(RAIZ, 'ejemplos.js'));

const DESC = {
  vertical: 'Proceso paso a paso', horizontal: 'Línea temporal en fila', radial: 'Hub central con satélites',
  cards: 'Rejilla de tarjetas', ciclo: 'Círculo de mejora continua', concepto: 'Mapa con subelementos',
  infografia: 'Lámina institucional con bandas'
};
const ORDEN = ['vertical', 'horizontal', 'radial', 'cards', 'ciclo', 'concepto', 'infografia'];

const clon = o => JSON.parse(JSON.stringify(o));
function cfgMotor(st) {
  const est = clon(st);
  const c = { layout: est.layout, style: est.style, color: est.color, titulo: est.titulo, kicker: est.kicker,
    subtitulo: est.subtitulo, logo: est.logo, _avisos: [] };
  if (est.layout === 'ciclo') {
    c.logoIcono = est.logo;
    c.pasos = est.nodos.map(n => ({ label: n.label, icono: n.icono || 'lupa', color: n.color || undefined }));
  } else if (est.layout === 'concepto') {
    c.tituloCentral = est.titulo;
    c.categorias = est.nodos.map(n => ({ label: n.label, icono: n.icono || 'bd', subs: n.subs, color: n.color || undefined }));
  } else if (est.layout === 'infografia') {
    c.intro = est.intro; c.cierre = est.subtitulo;
    const ej = EJEMPLOS.infografia;
    c.fuentes = clon(ej.fuentes); c.fuentesNota = ej.fuentesNota; c.notas = clon(ej.notas);
    c.pasos = est.nodos.map(n => ({ titulo: n.label, icono: n.icono || 'lupa', desc: n.desc, bullets: n.subs, color: n.color || undefined }));
  } else {
    c.nodos = est.nodos.map(n => ({ label: n.label, color: n.color || undefined }));
  }
  return c;
}
function render(st) {
  const cfg = cfgMotor(st);
  if (cfg.layout === 'ciclo' || cfg.layout === 'concepto') return LayoutsExtra.render(cfg);
  if (cfg.layout === 'infografia') return LayoutInfografia.render(cfg);
  return Motor2026.render(cfg);
}
// prefija ids (y sus url(#...) referencias) para que no choquen entre páginas
function prefijarIds(svg, pref) {
  const ids = [];
  svg.replace(/\sid="([^"]+)"/g, (m, id) => { ids.push(id); return m; });
  let out = svg;
  ids.forEach(id => {
    out = out.split('id="' + id + '"').join('id="' + pref + id + '"');
    out = out.split('url(#' + id + ')').join('url(#' + pref + id + ')');
  });
  return out;
}

let paginas = '';
ORDEN.forEach((lay, i) => {
  const svgBruto = render(EJEMPLOS[lay]);
  const svg = prefijarIds(svgBruto, 'p' + i + '-');
  const vb = /viewBox="([^"]+)"/.exec(svgBruto);
  paginas += `
  <section class="pagina">
    <header class="cab"><span class="num">${i + 1}</span><h1>${lay.charAt(0).toUpperCase() + lay.slice(1)}</h1><span class="desc">${DESC[lay]}</span></header>
    <div class="lienzo">${svg}</div>
  </section>`;
});

// la propuesta (página A4) al final — SVG extraído del prototipo ya renderizado
const svgProt = prefijarIds(fs.readFileSync('/home/nan/.hermes/cache/scratch/audit-smartart/prototipo.svg', 'utf8'), 'p7-');
paginas += `
  <section class="pagina">
    <header class="cab"><span class="num">★</span><h1>Propuesta — formato Página A4</h1><span class="desc">El nuevo formato pensado para pegar en Word (letra legible, 1 página)</span></header>
    <div class="lienzo">${svgProt}</div>
  </section>`;

const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Diagramas ambientales — una de cada tipo</title>
<style>
  @page { size: A3 landscape; margin: 0; }
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#fff}
  .pagina{position:relative;width:420mm;height:297mm;page-break-after:always;overflow:hidden;background:#fff;padding:10mm 8mm 6mm}
  .pagina:last-child{page-break-after:auto}
  .cab{display:flex;align-items:baseline;gap:3mm;margin-bottom:3mm}
  .cab .num{display:inline-block;min-width:7mm;height:7mm;line-height:7mm;text-align:center;border-radius:2mm;background:#0E7A50;color:#fff;font-size:3.4mm;font-weight:700}
  .cab h1{font-size:5.4mm;font-weight:700;color:#132A3E;letter-spacing:-0.1mm}
  .cab .desc{font-size:3.2mm;color:#4E657A}
  .lienzo{width:100%;height:calc(100% - 16mm);display:flex;align-items:center;justify-content:center;overflow:hidden}
  .lienzo svg{max-width:100%;max-height:100%;width:auto;height:auto}
</style></head><body>${paginas}</body></html>`;

fs.writeFileSync('/home/nan/.hermes/cache/scratch/audit-smartart/muestras.html', html);
console.log('HTML generado: 8 páginas (' + ORDEN.join(', ') + ' + propuesta)');
console.log('avisos del motor:', ORDEN.map(l => {
  const cfg = cfgMotor(EJEMPLOS[l]); render(EJEMPLOS[l]);
  return l + '=' + ((cfg._avisos || []).length);
}).join(' '));
