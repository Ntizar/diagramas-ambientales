#!/usr/bin/env node
// Higiene del HTML publicado:
// 1. Sin referencias externas (CDN, fuentes remotas) — funciona offline.
// 2. Sin nombres prohibidos (identidades personales o corporativas).
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
let totalExt = 0, totalProhibidos = 0;
for (const fichero of ['index.html', 'smartart/index.html', 'smartart-v2/index.html']) {
  const ruta = path.join(raiz, fichero);
  if (!fs.existsSync(ruta)) { console.log('FALTA ' + fichero + ' — ejecuta scripts/compilar.js'); process.exit(1); }
  const html = fs.readFileSync(ruta, 'utf8');
  const externos = html.match(/(src|href)="https?:\/\//gi) || [];
  const prohibidos = html.match(/ineco|antizar|ntizar|david/gi) || [];
  totalExt += externos.length; totalProhibidos += prohibidos.length;
  if (externos.length || prohibidos.length) {
    console.log(fichero + ': ' + externos.length + ' externas, ' + [...new Set(prohibidos)].join(', '));
  }
}
console.log(`Referencias externas: ${totalExt}`);
console.log(`Nombres prohibidos: ${totalProhibidos}`);

if (totalExt || totalProhibidos) process.exit(1);
console.log('HIGIENE OK');
