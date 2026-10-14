#!/usr/bin/env node
// ============================================================
// VERIFICACIÓN — catálogo unificado: 50 diagramas + 50 logos,
// todos renderizan sin fallos y sin valores corruptos.
// ============================================================
const { CATALOGO, render } = require('../src/catalogo');

let ok = 0;
const fallos = [];
for (const p of CATALOGO) {
  try {
    const svg = render(p);
    if (!svg.startsWith('<svg') || !svg.trim().endsWith('</svg>')) throw new Error('SVG mal formado');
    if (/NaN|undefined|Infinity/.test(svg)) throw new Error('valores no numéricos');
    if (svg.includes('</>')) throw new Error('XML roto');
    ok++;
  } catch (e) { fallos.push(p.id + ': ' + e.message); }
}

const diag = CATALOGO.filter(p => p.clase === 'diagrama').length;
const logos = CATALOGO.filter(p => p.clase === 'logo').length;

// prueba de incrustación de logo: un diagrama con logo debe renderizar
const conLogo = { ...CATALOGO.find(p => p.clase === 'diagrama'), logoConcepto: 'arbol', logoEstilo: 'plano', logoVariante: 1 };
let incrusta = false;
try { incrusta = render(conLogo).includes('translate'); } catch (e) { fallos.push('incrustación: ' + e.message); }

console.log(`Catálogo: ${CATALOGO.length} (${diag} diagramas + ${logos} logos)`);
console.log(`Render OK: ${ok}, fallos: ${fallos.length}`);
console.log(`Incrustación de logo en diagramas: ${incrusta ? 'OK' : 'FALLA'}`);
fallos.slice(0, 8).forEach(f => console.log('  - ' + f));

if (diag !== 50 || logos !== 50) { console.log('ERROR: deben ser 50 + 50'); process.exit(1); }
if (fallos.length) process.exit(1);
if (!incrusta) process.exit(1);
console.log('TODO OK — catálogo unificado verificado');
