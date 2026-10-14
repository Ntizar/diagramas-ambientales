#!/usr/bin/env node
// COMPILADOR — genera index.html autocontenido con ambos motores
// (diagramas SmartArt + logos) embebidos. Sin CDN ni archivos externos.
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const leer = f => fs.readFileSync(path.join(raiz, f), 'utf8');

const modulos = ['paleta.js', 'generadores.js'];
// smartart se fusiona con renombrado: su G pasa a GD (catalogo.js lo combina con Object.assign)
const smartartBruto = leer('src/smartart.js')
  .replace(/module\.exports = \{[^}]*\};?/g, '')
  .replace(/const \{[^}]*\} = require\([^)]*\);\n?/g, '')
  .replace(/const G = \{\};/, 'const GD = {};')
  .replace(/\bG\[/g, 'GD[')
  .replace(/G\[item/g, 'G[item'); // el acceso a G en catalogo no se toca aquí
const bundle = modulos.map(f =>
  leer('src/' + f)
    .replace(/module\.exports = \{[^}]*\};?/g, '')
    .replace(/const \{[^}]*\} = require\([^)]*\);\n?/g, '')
).join('\n') + '\n' + smartartBruto + '\n' + leer('src/catalogo.js')
  .replace(/module\.exports = \{[^}]*\};?/g, '')
  .replace(/const \{[^}]*\} = require\([^)]*\);\n?/g, '');

if (/require\(/.test(bundle)) throw new Error('Bundle con require() pendiente');

const ui = leer('src/app-ui.html');
const html = ui.replace('/*BUNDLE*/', bundle);
if (html.includes('/*BUNDLE*/')) throw new Error('Bundle no inyectado');
if (!html.includes('CATALOGO')) throw new Error('CATALOGO no está en el HTML');

fs.writeFileSync(path.join(raiz, 'index.html'), html);
console.log('index.html generado: ' + (fs.statSync(path.join(raiz, 'index.html')).size / 1024).toFixed(1) + ' KB');
