#!/usr/bin/env node
// Higiene del HTML publicado:
// 1. Sin referencias externas (CDN, fuentes remotas) — funciona offline.
// 2. Sin nombres prohibidos (identidades personales o corporativas).
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const externos = html.match(/(src|href)="https?:\/\//gi) || [];
console.log(`Referencias externas: ${externos.length}`);
externos.forEach(x => console.log('  ' + x));

const prohibidos = html.match(/ineco|antizar|ntizar|david/gi) || [];
console.log(`Nombres prohibidos: ${prohibidos.length}`);
[...new Set(prohibidos)].forEach(x => console.log('  ENCONTRADO: ' + x));

if (externos.length || prohibidos.length) process.exit(1);
console.log('HIGIENE OK');
