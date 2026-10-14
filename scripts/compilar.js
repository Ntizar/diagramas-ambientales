#!/usr/bin/env node
// ============================================================
// COMPILADOR — genera index.html autocontenido con el motor de
// logos embebido. Sin CDN, sin archivos externos: funciona con
// doble clic y en GitHub Pages.
// ============================================================
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const leer = f => fs.readFileSync(path.join(raiz, f), 'utf8');

const paleta = leer('src/paleta.js');
const generadores = leer('src/generadores.js');
const catalogo = leer('src/catalogo.js');
const ui = leer('src/app-ui.html');

// paleta: quitar module.exports
const palLimpio = paleta.replace(/module\.exports = \{[^}]*\};?/g, '');

// generadores: solo el objeto G (sin requires ni exports)
const genLimpio = generadores
  .replace(/const \{[^}]*\} = require\([^)]*\);\n?/g, '')
  .replace(/module\.exports = \{[^}]*\};?/g, '');

// catalogo: quitar requires y exports (SELECCION/CONCEPTOS/ESTILOS/render quedan)
const catLimpio = catalogo
  .replace(/const \{[^}]*\} = require\([^)]*\);\n?/g, '')
  .replace(/module\.exports = \{[^}]*\};?/g, '');

const bundle = `
${palLimpio}
${genLimpio}
${catLimpio}
`;

if (/require\(/.test(bundle)) throw new Error('Bundle con require() pendiente');

const html = ui.replace('/*BUNDLE*/', bundle);

if (html.includes('/*BUNDLE*/')) throw new Error('Bundle no inyectado');
if (!html.includes('CATALOGO')) throw new Error('CATALOGO no está en el HTML');

fs.writeFileSync(path.join(raiz, 'index.html'), html);
console.log(`index.html generado: ${(fs.statSync(path.join(raiz, 'index.html')).size / 1024).toFixed(1)} KB`);
