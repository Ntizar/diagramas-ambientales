#!/usr/bin/env node
// VERIFICACIÓN — catálogo unificado estilo 2026:
// 55 diagramas (11 tipos × 5 esquemas) + 50 logos, render sin fallos,
// incrustación de logo en todas las filas y sin XML roto.
const { CATALOGO, render } = require('../src/catalogo');

let ok = 0;
const fallos = [];
for (const p of CATALOGO) {
  try {
    const svg = render(p);
    if (!svg.startsWith('<svg') || !svg.trim().endsWith('</svg>')) throw new Error('SVG mal formado');
    if (/NaN|undefined|Infinity/.test(svg)) throw new Error('valores no numéricos');
    if (svg.includes('</>') || (svg.match(/<svg/g) || []).length !== 1) throw new Error('XML roto');
    ok++;
  } catch (e) { fallos.push(p.id + ': ' + e.message); }
}

const diag = CATALOGO.filter(p => p.clase === 'diagrama').length;
const logos = CATALOGO.filter(p => p.clase === 'logo').length;

// incrustación: un diagrama con logo debe llevar varios chips (uno por fila)
const conLogo = { ...CATALOGO.find(p => p.clase === 'diagrama'), logoConcepto: 'arbol', logoEstilo: 'plano', logoVariante: 1 };
let incrustaciones = 0;
try { incrustaciones = (render(conLogo).match(/translate/g) || []).length; }
catch (e) { fallos.push('incrustación: ' + e.message); }

console.log('Catálogo: ' + CATALOGO.length + ' (' + diag + ' diagramas + ' + logos + ' logos)');
console.log('Render OK: ' + ok + ', fallos: ' + fallos.length);
console.log('Incrustación de logo: ' + incrustaciones + ' chips en el diagrama de prueba');
fallos.slice(0, 8).forEach(f => console.log('  - ' + f));

if (diag !== 55 || logos !== 50) { console.log('ERROR: deben ser 55 + 50'); process.exit(1); }
if (fallos.length) process.exit(1);
if (incrustaciones < 3) { console.log('ERROR: el logo no se incrusta en las filas'); process.exit(1); }
console.log('TODO OK — catálogo 2026 verificado');
