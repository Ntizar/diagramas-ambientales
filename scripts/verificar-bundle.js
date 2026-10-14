#!/usr/bin/env node
// Verifica el bundle de la UI: extrae el primer <script> de index.html,
// lo ejecuta y renderiza las 300 plantillas.
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length < 2) { console.error('No hay 2 bloques <script>'); process.exit(1); }

const ctx = { console, window: {} };
vm.createContext(ctx);
try {
  vm.runInContext(scripts[0] + '\n;__r = { CATALOGO, render, TIPOS, G };', ctx);
} catch (e) {
  console.error('El bundle no ejecuta: ' + e.message);
  process.exit(1);
}

const { CATALOGO, render, TIPOS, G } = ctx.__r;
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
const sinGen = TIPOS.filter(t => !G[t.id]);
console.log(`Bundle UI: ${ok}/${CATALOGO.length} renders OK, tipos sin generador: ${sinGen.length}`);
if (fallos.length) { fallos.slice(0, 5).forEach(f => console.log('  ' + f)); process.exit(1); }
if (sinGen.length) process.exit(1);
console.log('BUNDLE OK');
