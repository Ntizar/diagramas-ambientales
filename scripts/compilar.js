#!/usr/bin/env node
// ============================================================
// COMPILADOR — genera index.html autocontenido:
// paleta.js + catalogo.js + generadores.js embebidos + UI.
// Sin CDN, sin archivos externos: funciona con doble clic
// y desde GitHub Pages.
// ============================================================
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const leer = f => fs.readFileSync(path.join(raiz, f), 'utf8');

const paleta = leer('src/paleta.js');
const generadores = leer('src/generadores.js');
const catalogo = leer('src/catalogo.js');
const ui = leer('src/app-ui.html');

// Convertir los módulos CommonJS a código embebido en el navegador.
// Cada archivo termina en module.exports = {...}; lo sustituimos por
// declaraciones const compartiendo el mismo ámbito del IIFE.
function aNavegador(codigo, nombre) {
  // quitar requires
  codigo = codigo.replace(/const \{[^}]*\} = require\([^)]*\);\n?/g, '');
  // quitar module.exports
  codigo = codigo.replace(/module\.exports = \{[^}]*\};?/g, '');
  // los const de nivel superior deben compartirse: envolver cada archivo
  // en un bloque que declaraciones suban al ámbito común vía eval no;
  // mejor: sustituir const XX por var XX no hace falta — al concatenar
  // en el mismo <script> con IIFE única, los const de nivel de archivo
  // chocarían con "const GRISES" duplicado. Solución: envolver cada
  // módulo en { } no funciona con const para uso externo.
  // Estrategia: usar un objeto de módulos.
  return codigo;
}

// Enfoque robusto: concatenar en un solo scope usando nombres únicos ya
// garantizados (paleta y generadores comparten GRISES — definido en ambos).
// Eliminamos la definición duplicada de GRISES en generadores.js embebido.
const genSinGris = generadores
  .replace(/const \{ tinte, textoSVG \} = require\('\.\/paleta'\);\n?/, '')
  .replace(/const GRISES = \{[\s\S]*?\n\};\n/, '');

const genLimpio = genSinGris
  .replace(/const \{[^}]*\} = require\([^)]*\);\n?/g, '')
  .replace(/module\.exports = \{[^}]*\};?/g, '');

const palLimpio = paleta.replace(/module\.exports = \{[^}]*\};?/g, '');

const catLimpio = catalogo
  .replace(/const \{ ESQUEMAS, CATEGORIAS, TIPOS, textosDefault \} = require\('\.\/paleta'\);\n?/, '')
  .replace(/const \{ G \} = require\('\.\/generadores'\);\n?/, '')
  .replace(/function render\(plantilla\) \{[\s\S]*?\n\}\n/, '')
  .replace(/module\.exports = \{[^}]*\};?/g, '');

const bundle = `
${palLimpio}
${genLimpio}
${catLimpio}
const MINIMOS = { 'relacion-venn-3': 3, 'comparativa-solapes': 3, 'comparativa-2col': 4, 'matriz-2x2': 4, 'matriz-eisenhower': 4, 'ciclo-4': 4, 'piramide-4': 4, 'piramide-invertida': 4 };
const MAXIMOS = { 'relacion-venn-3': 3, 'comparativa-solapes': 3, 'comparativa-2col': 8, 'matriz-2x2': 4, 'matriz-eisenhower': 4, 'ciclo-4': 6, 'ciclo-6': 8, 'piramide-4': 6, 'piramide-invertida': 6 };
function render(p) {
  const esq = ESQUEMAS.find(e => e.id === p.esquema);
  const gen = G[p.tipo];
  if (!esq) throw new Error('Esquema desconocido: ' + p.esquema);
  if (!gen) throw new Error('Generador desconocido: ' + p.tipo);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">' + gen(esq, p.textos);
}
`;

const html = ui.replace('/*BUNDLE*/', bundle);

if (!html.includes('CATALOGO')) throw new Error('Bundle roto: CATALOGO no está en el HTML');
if (html.includes('require(')) throw new Error('Bundle roto: queda un require()');
if (html.includes('/*BUNDLE*/')) throw new Error('Bundle no inyectado');

fs.writeFileSync(path.join(raiz, 'index.html'), html);
console.log(`index.html generado: ${(fs.statSync(path.join(raiz, 'index.html')).size / 1024).toFixed(1)} KB`);
console.log('Plantillas incluidas: ' + (palLimpio.match(/id: '/g) || []).length);
