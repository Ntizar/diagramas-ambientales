#!/usr/bin/env node
// ============================================================
// VERIFICACIÓN — 300 logos, todos con dibujo distinto, sin
// valores corruptos y con SVG bien formado.
// ============================================================
const { CATALOGO, render } = require('../src/catalogo');

// Firma visual: el SVG sin colores ni ids de gradiente — si dos logos
// comparten firma, son el mismo dibujo con otra capa de pintura.
function firma(p) {
  return render(p)
    .replace(/url\(#gr[^)]*\)/g, 'GR')
    .replace(/id="gr[^"]*"/g, '')
    .replace(/(fill|stroke)="(#[0-9a-fA-F]{3,8})"/g, '$1="COL"')
    .replace(/opacity="[\d.]+"/g, '')
    .replace(/\s+/g, ' ');
}

let ok = 0;
const fallos = [];
for (const p of CATALOGO) {
  try {
    const svg = render(p);
    if (!svg.startsWith('<svg') || !svg.trim().endsWith('</svg>')) throw new Error('SVG mal formado');
    if (/NaN|undefined|Infinity/.test(svg)) throw new Error('valores no numéricos');
    if (!/<(path|circle|rect|polygon|ellipse|g)/.test(svg)) throw new Error('sin formas');
    ok++;
  } catch (e) { fallos.push(p.id + ': ' + e.message); }
}

const firmas = new Set(CATALOGO.map(firma));
const porEsquema = {};
CATALOGO.forEach(p => porEsquema[p.esquema] = (porEsquema[p.esquema] || 0) + 1);
const cuotas = Object.values(porEsquema);
const equilibrado = cuotas.every(c => c === 30);

console.log(`Logos: ${CATALOGO.length}`);
console.log(`Render OK: ${ok}, fallos: ${fallos.length}`);
console.log(`Dibujos únicos: ${firmas.size}`);
console.log(`Esquemas: ${Object.keys(porEsquema).length}, cuotas ${equilibrado ? 'equilibradas (30 c/u)' : 'DESEQUILIBRADAS: ' + JSON.stringify(porEsquema)}`);
fallos.slice(0, 8).forEach(f => console.log('  - ' + f));

if (CATALOGO.length !== 300) { console.log('ERROR: deben ser exactamente 300'); process.exit(1); }
if (fallos.length) process.exit(1);
if (firmas.size !== 300) { console.log('ERROR: hay dibujos repetidos'); process.exit(1); }
if (!equilibrado) process.exit(1);
console.log('TODO OK — 300 logos únicos verificados');
