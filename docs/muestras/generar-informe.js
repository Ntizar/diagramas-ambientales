// Inyecta los datos reales (EJEMPLOS + LOGOS del motor) en la plantilla y genera el PDF
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const SRC = '/home/nan/Projects/diagramas-ambientales/src/smartart';
const Motor2026 = require(path.join(SRC, 'motor.js'));
const EJEMPLOS = require(path.join(SRC, 'ejemplos.js'));
const SCRATCH = '/home/nan/.hermes/cache/scratch/audit-smartart';
const CHROME = '/home/nan/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const LIBS = '/home/nan/.chrome-libs/usr/lib/x86_64-linux-gnu';
const PORT = 9401;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 1) plantilla + datos
let html = fs.readFileSync(path.join(SCRATCH, 'informe-plantilla.html'), 'utf8');
html = html.replace('/*DATOS*/', JSON.stringify(EJEMPLOS)).replace('/*LOGOS*/', JSON.stringify(Motor2026.LOGOS));
fs.writeFileSync(path.join(SCRATCH, 'informe.html'), html);
console.log('informe.html escrito (' + Math.round(html.length / 1024) + ' KB)');

// 2) HTML → PDF + verificación por página
(async () => {
  const chrome = spawn(CHROME, ['--remote-debugging-port=' + PORT, '--headless=new', '--no-sandbox', '--disable-gpu', 'about:blank'],
    { env: { ...process.env, LD_LIBRARY_PATH: LIBS }, stdio: 'ignore' });
  let ok = false;
  for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:' + PORT + '/json/version')).ok) { ok = true; break; } } catch { } await sleep(300); }
  if (!ok) { console.log('CHROMIUM NO ARRANCÓ'); process.exit(1); }
  const tab = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(m.error) : p.res(m.result); } });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.navigate', { url: 'file://' + path.join(SCRATCH, 'informe.html') });
  await sleep(2500);

  const JS = `(function(){
    var out=[]; document.querySelectorAll('.pagina').forEach(function(pg,pi){
      var svg=pg.querySelector('svg'); if(!svg){ out.push({p:pi+1,error:'SIN SVG'}); return; }
      var inv=svg.getScreenCTM().inverse();
      function p2mm(px,py){ var q=svg.createSVGPoint(); q.x=px; q.y=py; return q.matrixTransform(inv); }
      function bb(el){ var r=el.getBoundingClientRect(); var a=p2mm(r.left,r.top), b=p2mm(r.right,r.bottom); return {x:a.x,y:a.y,x2:b.x,y2:b.y,w:b.x-a.x,h:b.y-a.y}; }
      var items=[];
      svg.querySelectorAll('text,path,circle,rect,g').forEach(function(el){
        var tag=el.tagName.toLowerCase(); if(tag==='g' && el.querySelector('g')) return;
        var b=bb(el); if(!b||b.w<=0||b.h<=0) return;
        var tipo= tag==='text'?'texto':(tag==='g'?'icono':'otro');
        items.push({tipo:tipo,s:(tag==='text'?el.textContent.slice(0,40):tag),x:b.x,y:b.y,x2:b.x2,y2:b.y2,w:b.w,h:b.h});
      });
      var T=items.filter(function(i){return i.tipo==='texto';}), I=items.filter(function(i){return i.tipo==='icono';});
      function ov(a,b){var ix=Math.min(a.x2,b.x2)-Math.max(a.x,b.x),iy=Math.min(a.y2,b.y2)-Math.max(a.y,b.y);return ix>0.25&&iy>0.25;}
      var choques=0, dmin=99, par='';
      T.forEach(function(t){ I.forEach(function(ic){ if(ov(t,ic)) choques++;
        var dx=Math.max(ic.x-t.x2,t.x-ic.x2,0), dy=Math.max(ic.y-t.y2,t.y-ic.y2,0), d=Math.sqrt(dx*dx+dy*dy);
        if(d<dmin){dmin=d;par=t.s;} }); });
      var fuera=0, fueraLista=[];
      T.forEach(function(t){ if(t.x<1||t.x2>209||t.y<1||t.y2>296){ fuera++; fueraLista.push(t.s.slice(0,26)+'@'+t.x.toFixed(0)+','+t.y.toFixed(0)); } });
      var nan=0, nanList=[]; svg.querySelectorAll('text').forEach(function(t){ if(/NaN|undefined/.test(t.textContent)){ nan++; if(nanList.length<5) nanList.push(t.textContent.slice(0,24)); } });
      var fs=[]; var sospechosos=[];
      svg.querySelectorAll('text').forEach(function(t){ fs.push(parseFloat(t.getAttribute('font-size')));
        if(/^(100|200|300|400|500|600|700|800|900)$/.test(t.textContent.trim())) sospechosos.push(t.textContent.trim()); });
      out.push({p:pi+1, textos:T.length, iconos:I.length, choques:choques, distanciaMin:+dmin.toFixed(2), parCercano:par,
        textoFueraPagina:fuera, ejemplosFuera:fueraLista.slice(0,3), nan:nan, nanList:nanList, textoPeso:sospechosos,
        letraMinMM:+Math.min.apply(null,fs).toFixed(2), letraMinPT:+(Math.min.apply(null,fs)*72/25.4).toFixed(1)});
    });
    return JSON.stringify({paginas:out.length, detalle:out, avisos:(window.__AVISOS||[])});
  })()`;
  const r = await send('Runtime.evaluate', { returnByValue: true, expression: JS });
  const d = JSON.parse(r.result.value);
  let fallos = 0;
  d.detalle.forEach(function (o) {
    if (o.error) { console.log('  ✗ p' + o.p + ': ' + o.error); fallos++; return; }
    const malo = o.choques > 0 || o.textoFueraPagina > 0 || o.nan > 0 || o.distanciaMin < 2.4 || (o.textoPeso && o.textoPeso.length > 0);
    if (malo) fallos++;
    console.log('  ' + (malo ? '✗' : '·') + ' p' + o.p + '  textos=' + String(o.textos).padStart(3) +
      '  choques=' + o.choques + '  fuera=' + o.textoFueraPagina + '  NaN=' + o.nan +
      '  distMin=' + o.distanciaMin + 'mm  letraMin=' + o.letraMinPT + 'pt' +
      (o.ejemplosFuera.length ? '  [' + o.ejemplosFuera.join(' | ') + ']' : '') + (o.nanList && o.nanList.length ? '  NaN:[' + o.nanList.join(' | ') + ']' : '') + (o.textoPeso && o.textoPeso.length ? '  ⚠ texto-peso:[' + o.textoPeso.join(',') + ']' : ''));
  });
  console.log('AVISOS de recorte:', d.avisos.length ? d.avisos.join(' ; ') : 'ninguno');

  const pdf = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
  const salida = path.join(SCRATCH, 'diagramas-informe-a4.pdf');
  fs.writeFileSync(salida, Buffer.from(pdf.data, 'base64'));
  console.log('PDF:', salida, (fs.statSync(salida).size / 1024).toFixed(0) + ' KB');
  console.log(fallos ? 'RESULTADO: ' + fallos + ' página(s) con problema' : 'RESULTADO: todas las páginas limpias');
  chrome.kill(); await sleep(300); process.exit(fallos ? 1 : 0);
})().catch(e => { console.log('ERROR', (e && e.message) || e); process.exit(2); });
