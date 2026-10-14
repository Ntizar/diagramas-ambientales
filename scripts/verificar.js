#!/usr/bin/env node
// ============================================================
// VERIFICACIÓN — valida que las 300 plantillas rendericen sin
// excepciones, que el SVG sea válido y que los textos estén.
// Sales sin exit 0 si algo falla. CI antes de pushear.
// ============================================================
const { CATALOGO, render } = require('../src/catalogo');

let ok = 0, fallos = [];
for (const p of CATALOGO) {
  try {
    const svg = render(p);
    if (!svg.startsWith('<svg') || !svg.trim().endsWith('</svg>')) throw new Error('SVG mal formado');
    if (!svg.includes('<text')) throw new Error('Sin textos');
    if ((svg.match(/<text/g) || []).length < p.pasos) throw new Error(`Menos textos (${p.pasos}) que pasos`);
    if (/<g data-i="/g && false) {} // noop
    const grupos = (svg.match(/data-i="/g) || []).length;
    if (grupos < p.pasos) throw new Error(`Grupos editables ${grupos} < pasos ${p.pasos}`);
    if (/NaN|undefined|Infinity/.test(svg)) throw new Error('Valores no numéricos en el SVG');
    ok++;
  } catch (e) {
    fallos.push(`${p.id}: ${e.message}`);
  }
}

console.log(`Plantillas: ${CATALOGO.length}`);
console.log(`Render OK: ${ok}`);
if (fallos.length) {
  console.log(`FALLOS (${fallos.length}):`);
  fallos.forEach(f => console.log('  - ' + f));
  process.exit(1);
}
if (CATALOGO.length !== 300) {
  console.log('ERROR: el catálogo debe tener exactamente 300 plantillas');
  process.exit(1);
}
console.log('TODO OK — 300 plantillas verificadas');
