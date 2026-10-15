#!/usr/bin/env node
// Verificación ESTÁTICA del motor v2 (sin navegador → apta para CI).
// Comprueba, en el SVG generado: que no haya NaN/undefined, que ningún texto sea
// un peso de fuente, que las etiquetas estén balanceadas y que ninguna coordenada
// se salga del lienzo. La medición real se verifica aparte (scripts/verificar-v2.js).
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const M = require(path.join(RAIZ, 'src', 'smartart2', 'nucleo.js'));
require(path.join(RAIZ, 'src', 'smartart2', 'layouts.js'));
const E = require(path.join(RAIZ, 'src', 'smartart2', 'ejemplos.js'));
const G = require(path.join(RAIZ, 'src', 'smartart2', 'logos.js'));

const ANCHOS = [320, 390, 768, 1100, 1440];
const TIPOS = Object.keys(E);
let fallos = 0, casos = 0;

function atributos(svg, nombre) {
  const re = new RegExp('\\b' + nombre + '="(-?[\\d.]+)"', 'g');
  const out = []; let m;
  while ((m = re.exec(svg))) out.push(parseFloat(m[1]));
  return out;
}
TIPOS.forEach(tipo => {
  ANCHOS.forEach(ancho => {
    casos++;
    const errs = [];
    let r;
    try { r = M.render({ tipo, datos: JSON.parse(JSON.stringify(E[tipo])), ancho, logos: G, figura: 1 }); }
    catch (e) { console.log('  ✗ ' + tipo + '@' + ancho + ' → EXCEPCIÓN: ' + e.message); fallos++; return; }
    const svg = r.svg;
    if (/NaN|undefined|null/.test(svg)) errs.push('contiene NaN/undefined');
    const pesos = svg.match(/>\s*(100|200|300|400|500|600|700|800|900)\s*</g);
    if (pesos) errs.push('texto con forma de peso: ' + pesos.join(','));
    // etiquetas balanceadas
    const abre = (svg.match(/<(?!\/)(?!\?)[a-zA-Z]/g) || []).length;
    const cierra = (svg.match(/<\/[a-zA-Z]/g) || []).length;
    const autocierran = (svg.match(/\/>/g) || []).length;
    if (abre !== cierra + autocierran) errs.push('etiquetas desbalanceadas (' + abre + ' vs ' + cierra + '+' + autocierran + ')');
    // coordenadas dentro del lienzo
    const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
    if (!vb) errs.push('sin viewBox');
    else {
      const W = +vb[1], H = +vb[2];
      const fuera = [];
      atributos(svg, 'x').forEach(v => { if (v < -1 || v > W + 1) fuera.push('x=' + v); });
      atributos(svg, 'cx').forEach(v => { if (v < -1 || v > W + 1) fuera.push('cx=' + v); });
      atributos(svg, 'y').forEach(v => { if (v < -1 || v > H + 1) fuera.push('y=' + v); });
      atributos(svg, 'cy').forEach(v => { if (v < -1 || v > H + 1) fuera.push('cy=' + v); });
      if (fuera.length) errs.push(fuera.length + ' coordenadas fuera del lienzo: ' + fuera.slice(0, 4).join(','));
      if (r.alto < 120 || r.alto > 20000) errs.push('alto absurdo: ' + r.alto);
    }
    const ed = (svg.match(/data-e="/g) || []).length;
    if (ed < 2) errs.push('sin elementos editables (' + ed + ')');
    if (errs.length) { console.log('  ✗ ' + tipo.padEnd(10) + '@' + String(ancho).padStart(4) + ' → ' + errs.join(' · ')); fallos++; }
  });
});
console.log('\n' + casos + ' casos · ' + (fallos ? fallos + ' con problema' : 'TODO OK ✅'));
process.exit(fallos ? 1 : 0);
