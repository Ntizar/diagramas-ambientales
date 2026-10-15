// Verificación del prototipo: bboxes REALES en mm (getScreenCTM, incluye transforms)
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = '/home/nan/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const LIBS = '/home/nan/.chrome-libs/usr/lib/x86_64-linux-gnu';
const U = 'file://' + (process.argv[2] || '/home/nan/.hermes/cache/scratch/audit-smartart/prototipo-v5.html');
const OUT = '/home/nan/.hermes/cache/scratch/audit-smartart';
const PNG = process.argv[3] || 'PROTOTIPO-v5';
const PORT = 9377;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const JS = `(function(){
  var svg=document.querySelector('svg');
  var inv=svg.getScreenCTM().inverse();
  function p2mm(px,py){ var p=svg.createSVGPoint(); p.x=px; p.y=py; var q=p.matrixTransform(inv); return {x:q.x,y:q.y}; }
  function bb(el){ var r=el.getBoundingClientRect(); var a=p2mm(r.left,r.top), b=p2mm(r.right,r.bottom);
    return {x:a.x,y:a.y,x2:b.x,y2:b.y,w:b.x-a.x,h:b.y-a.y}; }
  var items=[];
  svg.querySelectorAll('text,path,circle,rect,g').forEach(function(el){
    var tag=el.tagName.toLowerCase(); if(tag==='g' && el.querySelector('g')) return;
    var b=bb(el); if(!b||b.w<=0||b.h<=0) return;
    var tipo= tag==='text'?'texto':(tag==='g'?'icono':(tag==='rect'&&b.w>18?'caja':(tag==='circle'&&b.w>=18?'caja':'otro')));
    items.push({tipo:tipo,s:(tag==='text'?el.textContent.slice(0,44):tag),x:+b.x.toFixed(2),y:+b.y.toFixed(2),x2:+b.x2.toFixed(2),y2:+b.y2.toFixed(2),w:+b.w.toFixed(2),h:+b.h.toFixed(2)});
  });
  function ov(a,b){var ix=Math.min(a.x2,b.x2)-Math.max(a.x,b.x),iy=Math.min(a.y2,b.y2)-Math.max(a.y,b.y);return(ix>0.25&&iy>0.25)?{ix:+ix.toFixed(2),iy:+iy.toFixed(2)}:null;}
  var T=items.filter(function(i){return i.tipo==='texto';});
  var I=items.filter(function(i){return i.tipo==='icono';});
  var C=items.filter(function(i){return i.tipo==='caja';});
  var choques=[]; T.forEach(function(t){I.forEach(function(ic){var s=ov(t,ic); if(s) choques.push({texto:t.s,solape:s,icono:[ic.x,ic.y]});});});
  var fuera=[]; T.forEach(function(t){
    var host=C.filter(function(c){return t.x>=c.x-0.6&&t.x<=c.x2+0.6&&t.y>=c.y-0.6&&t.y<=c.y2+0.6;})
      .sort(function(a,b){return(a.w*a.h)-(b.w*b.h);})[0];
    if(host){var dr=t.x2-host.x2, db=t.y2-host.y2, iz=host.x-t.x;
      if(dr>0.15||db>0.15||iz>0.15) fuera.push({texto:t.s,derecha:+dr.toFixed(2),abajo:+db.toFixed(2),izquierda:+iz.toFixed(2)});} });
  var dmin=99,par='',cercanos=[];
  T.forEach(function(t){I.forEach(function(ic){
    var dx=Math.max(ic.x-t.x2,t.x-ic.x2,0), dy=Math.max(ic.y-t.y2,t.y-ic.y2,0);
    var d=Math.sqrt(dx*dx+dy*dy);
    if(d<dmin){dmin=d; par=t.s+'  ↔  icono@['+ic.x+','+ic.y+']';}
    if(d<3.5) cercanos.push({d:+d.toFixed(2), texto:t.s, icono:[ic.x,ic.y,t.w,ic.h], textoBox:[t.x,t.y,t.w,t.h]}); });});
  cercanos.sort(function(a,b){return a.d-b.d;});
  var nanTextos=[]; svg.querySelectorAll('text').forEach(function(t){ if(/NaN|undefined|null/.test(t.textContent)) nanTextos.push(t.textContent); });
  var minFs=99; svg.querySelectorAll('text').forEach(function(t){var f=parseFloat(t.getAttribute('font-size')); if(f<minFs) minFs=f;});
  return JSON.stringify({titulo:document.title,textos:T.length,iconos:I.length,cajas:C.length,
    choques:choques,fueraDeCaja:fuera,distanciaMin:+dmin.toFixed(2),parCercano:par,
    nanTextos:nanTextos,letraMinMM:minFs,letraMinPT:+(minFs*72/25.4).toFixed(1),cercanos:cercanos.slice(0,6),
    bloques:(window.__BLOQUES||[]).map(function(b){return b.alto;}).join('+')});
})()`;

(async () => {
  const chrome = spawn(CHROME, ['--remote-debugging-port=' + PORT, '--headless=new', '--no-sandbox', '--disable-gpu', '--force-device-scale-factor=2', 'about:blank'],
    { env: { ...process.env, LD_LIBRARY_PATH: LIBS }, stdio: 'ignore' });
  for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:' + PORT + '/json/version')).ok) break; } catch { } await sleep(300); }
  const tab = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?' + encodeURIComponent(U), { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(m.error) : p.res(m.result); } });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 900, height: 1300, deviceScaleFactor: 2, mobile: false });
  await send('Page.navigate', { url: U });
  await sleep(1500);
  const r = await send('Runtime.evaluate', { returnByValue: true, expression: JS });
  const d = JSON.parse(r.result.value);
  console.log('TITULO: ' + d.titulo);
  console.log('textos=' + d.textos + ' iconos=' + d.iconos + ' cajas=' + d.cajas + ' | letra mínima ' + d.letraMinMM + 'mm = ' + d.letraMinPT + 'pt');
  console.log('TEXTOS CON NaN/undefined: ' + (d.nanTextos.length? d.nanTextos.join(', ') : 'ninguno'));
console.log('ALTOS: ' + d.bloques);
  console.log('CHOQUES texto/icono: ' + d.choques.length);
  d.choques.forEach(c => console.log('   "' + c.texto + '" × icono@' + JSON.stringify(c.icono) + ' solape ' + JSON.stringify(c.solape)));
  console.log('TEXTOS FUERA DE CAJA: ' + d.fueraDeCaja.length);
  d.fueraDeCaja.forEach(c => console.log('   "' + c.texto + '" der=' + c.derecha + ' abajo=' + c.abajo + ' izq=' + c.izquierda));
  console.log('DISTANCIA MÍNIMA texto↔icono: ' + d.distanciaMin + ' mm');
(d.cercanos||[]).forEach(function(c){ console.log('   <3,5mm: ' + c.d + 'mm  "' + c.texto + '"  icono@' + JSON.stringify(c.icono.slice(0,2)) + '  textoBox@' + JSON.stringify(c.textoBox)); });
  const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync(OUT + '/' + PNG + '.png', Buffer.from(full.data, 'base64'));
  const z = async (n, c) => { const s = await send('Page.captureScreenshot', { format: 'png', clip: c, captureBeyondViewport: true }); fs.writeFileSync(OUT + '/' + n + '.png', Buffer.from(s.data, 'base64')); };
  await z(PNG + '-zoom-tarjetas', { x: 40, y: 330, width: 400, height: 260, scale: 3 });
  await z(PNG + '-zoom-pie', { x: 40, y: 930, width: 720, height: 230, scale: 2 });
  console.log('capturas OK → ' + OUT + '/' + PNG + '.png');
  chrome.kill(); await sleep(300); process.exit(0);
})().catch(e => { console.log('ERROR', (e && e.message) || e); process.exit(1); });
