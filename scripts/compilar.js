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

// ---------- SmartArt → smartart/index.html ----------
// El bundle de navegador: los require condicionales se resuelven al global
// y el par if(module.exports)/else root se reduce a su rama de ventana.
const limpiarSA = codigo => codigo
  .replace(/typeof require !== 'undefined' \? require\('\.\/motor\.js'\) : root\.Motor2026/g, 'root.Motor2026')
  .replace(/typeof require !== 'undefined' \? require\('\.\/motor\.js'\) : null/g, 'null')
  .replace(/if \(typeof module !== 'undefined' && module\.exports\) module\.exports = \w+;\n\s*else /g, '')
  .replace(/^if \(typeof module !== 'undefined' && module\.exports\) module\.exports = EJEMPLOS;$/gm, '');

const saBundle = ['motor.js', 'layouts.js', 'infografia.js', 'ejemplos.js']
  .map(f => limpiarSA(leer('src/smartart/' + f)))
  .join('\n');

if (/require\(/.test(saBundle)) throw new Error('Bundle SmartArt con require() pendiente');

const saUi = leer('src/smartart-ui.html');
const saHtml = saUi.replace('/*SMARTART*/', saBundle);
if (saHtml.includes('/*SMARTART*/')) throw new Error('Bundle SmartArt no inyectado');
if (!saHtml.includes('Motor2026')) throw new Error('Motor2026 no está en el HTML SmartArt');

fs.mkdirSync(path.join(raiz, 'smartart'), { recursive: true });
fs.writeFileSync(path.join(raiz, 'smartart', 'index.html'), saHtml);
console.log('smartart/index.html generado: ' + (fs.statSync(path.join(raiz, 'smartart', 'index.html')).size / 1024).toFixed(1) + ' KB');
