#!/usr/bin/env node
// Compila el editor v2 en un único HTML autocontenido (sin CDN, sin imports).
// Uso: node scripts/compilar2.js
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const src = path.join(raiz, 'src', 'smartart2');
const ui = path.join(raiz, 'src', 'smartart2-ui.html');
const destinoDir = path.join(raiz, 'smartart-v2');
const destino = path.join(destinoDir, 'index.html');

const partes = ['logos.js', 'nucleo.js', 'layouts.js', 'ejemplos.js'].map(f => {
  const p = path.join(src, f);
  if (!fs.existsSync(p)) { console.error('FALTA ' + p); process.exit(1); }
  return '/* ==== ' + f + ' ==== */\n' + fs.readFileSync(p, 'utf8');
});

let html = fs.readFileSync(ui, 'utf8');
if (html.indexOf('/*MOTOR2*/') < 0) { console.error('La plantilla no tiene el marcador /*MOTOR2*/'); process.exit(1); }
html = html.replace('/*MOTOR2*/', partes.join('\n'));
// el HTML publicado no puede llevar referencias externas
if (/(src|href)="https?:\/\//i.test(html)) { console.error('El HTML generado tiene referencias externas'); process.exit(1); }

fs.mkdirSync(destinoDir, { recursive: true });
fs.writeFileSync(destino, html);
console.log('smartart-v2/index.html generado: ' + (html.length / 1024).toFixed(1) + ' KB');
