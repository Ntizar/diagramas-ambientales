#!/usr/bin/env node
// Verifica los bundles compilados: el JS de index.html y smartart/index.html
// se ejecuta sin errores de sintaxis y no introduce referencias externas.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.join(__dirname, '..');
let fallos = [];

for (const [nombre, fichero, marcadores] of [
  ['Cuadros', 'index.html', ['CONCEPTOS', 'ESQUEMAS', 'PALETAS']],
  ['SmartArt', 'smartart/index.html', ['Motor2026', 'LayoutsExtra', 'EJEMPLOS']]
]) {
  const ruta = path.join(raiz, fichero);
  if (!fs.existsSync(ruta)) { fallos.push(nombre + ': falta ' + fichero + ' (ejecuta scripts/compilar.js)'); continue; }
  const html = fs.readFileSync(ruta, 'utf8');
  // marcadores presentes
  for (const m of marcadores) if (!html.includes(m)) fallos.push(nombre + ': falta el marcador ' + m);
  // sintaxis: compilar cada bloque <script> sin src en un contexto nuevo
  const bloques = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
  bloques.forEach((codigo, i) => {
    try { new vm.Script(codigo, { filename: nombre + '#' + i }); }
    catch (e) { fallos.push(nombre + ': script ' + i + ' con error de sintaxis — ' + e.message); }
  });
  // sin dependencias externas en el bundle
  if (/(src|href)="https?:\/\//.test(html)) fallos.push(nombre + ': referencias externas en el bundle');
  if (/require\(/.test(html)) fallos.push(nombre + ': require() pendiente en el bundle');
}

console.log('Bundle: Cuadros + SmartArt verificados');
fallos.forEach(f => console.log('  - ' + f));
if (fallos.length) process.exit(1);
console.log('BUNDLE OK');
