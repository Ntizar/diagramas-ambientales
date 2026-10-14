#!/usr/bin/env node
// COMPILADOR — genera index.html autocontenido con ambos motores
// (SmartArt 2026 + logos) embebidos. Sin CDN ni archivos externos.
// Orden: paleta → generadores (logos) → smartart (usa G de logos) → catalogo.
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const leer = f => fs.readFileSync(path.join(raiz, f), 'utf8');

const limpiar = codigo =>
  codigo
    .replace(/module\.exports = \{[^}]*\};?/g, '')
    .replace(/const \{[^}]*\} = require\([^)]*\);\n?/g, '');

const bundle = ['paleta.js', 'generadores.js', 'catalogo-estilos.js', 'catalogo.js']
  .map(f => limpiar(leer('src/' + f)))
  .join('\n');

if (/require\(/.test(bundle)) throw new Error('Bundle con require() pendiente');

const ui = leer('src/app-ui.html');
const html = ui.replace('/*BUNDLE*/', bundle);
if (html.includes('/*BUNDLE*/')) throw new Error('Bundle no inyectado');
if (!html.includes('CONCEPTOS')) throw new Error('CONCEPTOS no está en el HTML');

fs.writeFileSync(path.join(raiz, 'index.html'), html);
console.log('index.html generado: ' + (fs.statSync(path.join(raiz, 'index.html')).size / 1024).toFixed(1) + ' KB');
