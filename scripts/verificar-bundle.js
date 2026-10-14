#!/usr/bin/env node
// Verifica el bundle de la UI: extrae los <script> de index.html,
// ejecuta el motor embebido y renderiza los 300 logos.
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);

const ctx = { console, window: {} };
vm.createContext(ctx);
try {
  vm.runInContext(scripts[0] + '\n;__r = { CATALOGO, render, ESQUEMAS };', ctx);
} catch (e) {
  console.error('El bundle no ejecuta: ' + e.message);
  process.exit(1);
}

const { CATALOGO, render, ESQUEMAS } = ctx.__r;
let ok = 0;
const fallos = [];
for (const p of CATALOGO) {
  try {
    const svg = render(p);
    if (!svg.startsWith('<svg')) throw new Error('sin etiqueta svg');
    if (/NaN|undefined|Infinity/.test(svg)) throw new Error('valores no numéricos');
    ok++;
  } catch (e) { fallos.push(p.id + ': ' + e.message); }
}
console.log(`Bundle UI: ${ok}/${CATALOGO.length} renders OK, esquemas disponibles: ${ESQUEMAS.length}`);
if (fallos.length) { fallos.slice(0, 5).forEach(f => console.log('  ' + f)); process.exit(1); }
if (CATALOGO.length !== 300) process.exit(1);
console.log('BUNDLE OK');
