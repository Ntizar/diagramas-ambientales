#!/usr/bin/env node
// VERIFICACIÓN — motor SmartArt: los 7 layouts renderizan con sus ejemplos,
// sin NaN/undefined, hits de edición presentes, sistema de avisos activo.
const path = require('path');
const m = require('../src/smartart/motor.js');
const l = require('../src/smartart/layouts.js');
const i = require('../src/smartart/infografia.js');
const E = require('../src/smartart/ejemplos.js');

let ok = 0;
const fallos = [];

function render(c) {
  if (c.layout === 'ciclo' || c.layout === 'concepto') return l.render(c);
  if (c.layout === 'infografia') {
    const cc = Object.assign({}, c);
    cc.pasos = (cc.pasos || cc.nodos || []).map(function (n) {
      return { titulo: n.titulo || n.label, icono: n.icono, desc: n.desc, bullets: n.bullets || n.subs };
    });
    return i.render(cc);
  }
  return m.render(c);
}

for (const k of ['vertical', 'horizontal', 'radial', 'cards', 'ciclo', 'concepto', 'infografia']) {
  try {
    if (!E[k]) throw new Error('ejemplo ausente');
    const cfg = JSON.parse(JSON.stringify(E[k]));
    if (cfg.layout !== k) throw new Error('layout del ejemplo no coincide');
    const svg = render(cfg);
    if (!svg.startsWith('<svg') || !svg.trim().endsWith('</svg>')) throw new Error('SVG mal formado');
    if (/NaN|undefined|Infinity/.test(svg)) throw new Error('valores no numéricos en el SVG');
    const hits = (svg.match(/class="hit"/g) || []).length;
    if (hits < 1) throw new Error('sin zonas de edición (hits) — el editor no podría tocar nodos');
    if (!/<text[^>]*>([^<])/.test(svg)) throw new Error('sin texto visible');
    ok++;
  } catch (e) { fallos.push(k + ': ' + e.message); }
}

// avisos de recorte: un texto desbordante debe producir aviso, no silencio
try {
  const cfg = { layout: 'radial', titulo: 'T', _avisos: [],
    nodos: [{ label: 'C' }, { label: 'un texto muuuuy largo que no cabe en el satelite de tres lineas absolutamente nada que ver con lo esperable' }] };
  m.render(cfg);
  if (!cfg._avisos.length) throw new Error('el sistema de avisos no ha avisado del recorte');
} catch (e) { fallos.push('avisos: ' + e.message); }

// estilos dark y light con color custom
for (const stilo of ['dark', 'light']) {
  try {
    const svg = m.render({ layout: 'cards', style: stilo, color: '#7C3AED', titulo: 'X', nodos: [{ label: 'uno' }, { label: 'dos' }, { label: 'tres' }, { label: 'cuatro' }] });
    if (!svg.includes('#7C3AED')) throw new Error('el color custom no se aplica');
  } catch (e) { fallos.push('color ' + stilo + ': ' + e.message); }
}

const total = 7 + 1 + 2;
console.log('SmartArt: ' + ok + '/' + (7) + ' layouts OK + avisos + colores');
fallos.forEach(f => console.log('  - ' + f));
if (fallos.length) process.exit(1);
console.log('SMARTART TODO OK');
