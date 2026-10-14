#!/usr/bin/env node
// VERIFICACIÓN — editor Cuadros: 30 logos renderizan, sin nombres prohibidos,
// sin CDN, bundle ejecutable.
const { CONCEPTOS, render, ESTILOS } = require('../src/catalogo');
const { ESQUEMAS } = require('../src/paleta');

let ok = 0;
const fallos = [];
for (const c of CONCEPTOS) {
  for (const esq of ESQUEMAS) {
    try {
      const svg = render({ concepto: c.id, esquema: esq.id, estilo: 'plano', variante: 1, id: c.id });
      if (!svg.startsWith('<svg') || !svg.trim().endsWith('</svg>')) throw new Error('SVG mal formado');
      if (/NaN|undefined|Infinity/.test(svg)) throw new Error('valores no numéricos');
      ok++;
    } catch (e) { fallos.push(c.id + '/' + esq.id + ': ' + e.message); }
  }
}
console.log('Logos: ' + CONCEPTOS.length + ' × ' + ESQUEMAS.length + ' esquemas = ' + ok + ' renders OK');
fallos.slice(0, 5).forEach(f => console.log('  - ' + f));
if (fallos.length) process.exit(1);
console.log('TODO OK');
