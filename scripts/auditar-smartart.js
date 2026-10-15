#!/usr/bin/env node
// Auditoría medible del editor SmartArt: capturas + métricas objetivas en navegador real.
// Nace de la auditoría 2026-10 (AUDITORIA-2026-10.md): no "mirar y admirar", medir.
//
// Uso:  node scripts/auditar-smartart.js [dirSalida]
// Env:  CHROME (binario), CHROME_LIBS (LD_LIBRARY_PATH), PORT
// Devuelve exit 1 si algún texto queda por debajo del mínimo legible en móvil (12px efectivos).
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const CHROME = process.env.CHROME || '/home/nan/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const LIBS = process.env.CHROME_LIBS || '/home/nan/.chrome-libs/usr/lib/x86_64-linux-gnu';
const U = 'file://' + path.join(raiz, 'smartart', 'index.html');
const OUT = process.argv[2] || path.join(raiz, '.auditoria');
const PORT = +(process.env.PORT || 9311);
const MIN_TEXTO_MOVIL = 12;   // px efectivos exigidos en móvil
const sleep = ms => new Promise(r => setTimeout(r, ms));

if (!fs.existsSync(CHROME)) { console.log('FALTA el binario de Chromium: ' + CHROME); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });

const MEDIR = `(function(){
  var d=document.scrollingElement, svg=document.querySelector('#svgwrap svg');
  var wrap=document.getElementById('svgwrap'); var m=wrap?wrap.style.transform:null;
  var k=1; var mm=/scale\\(([0-9.]+)\\)/.exec(m||''); if(mm) k=parseFloat(mm[1]);
  var todos={}; document.querySelectorAll('defs [id]').forEach(function(el){ todos[el.id]=(todos[el.id]||0)+1; });
  var cuerpos=[]; document.querySelectorAll('#svgwrap text').forEach(function(t){ var fx=parseFloat(t.getAttribute('font-size')||'0')*k; cuerpos.push(fx); });
  return JSON.stringify({ viewport:{w:innerWidth,h:innerHeight},
    desborde:d.scrollWidth-d.clientWidth, escala:+k.toFixed(3), hits:document.querySelectorAll('#svgwrap .hit').length,
    textos:cuerpos.length, textosIlegibles:cuerpos.filter(function(x){return x<9;}).length,
    minTextoEfectivo:+(Math.min.apply(null,cuerpos.concat([99]))).toFixed(2),
    idsDuplicados:Object.keys(todos).filter(function(x){return todos[x]>1;}) });
})()`;

(async () => {
  const chrome = spawn(CHROME, ['--remote-debugging-port=' + PORT, '--headless=new', '--no-sandbox',
    '--disable-gpu', '--hide-scrollbars', 'about:blank'],
    { env: { ...process.env, LD_LIBRARY_PATH: LIBS }, stdio: 'ignore' });
  let ok = false;
  for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:' + PORT + '/json/version')).ok) { ok = true; break; } } catch { } await sleep(300); }
  if (!ok) { console.log('CHROMIUM NO ARRANCÓ'); process.exit(2); }

  const tab = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?' + encodeURIComponent(U), { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(m.error) : p.res(m.result); } });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
  const ev = async (e) => { const r = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); return r.exceptionDetails ? { __err: 1 } : (r.result ? r.result.value : null); };
  const shot = async (n) => { const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); fs.writeFileSync(path.join(OUT, n + '.png'), Buffer.from(r.data, 'base64')); };
  const setLay = (lay) => `(function(){ try{localStorage.removeItem('smartart');}catch(e){};var E=window.EJEMPLOS['${lay}'];var st=JSON.parse(JSON.stringify(E));` +
    `st.nodos=(st.nodos||[]).map(function(n){return {label:n.label,icono:n.icono||'',color:'',desc:n.desc||'',subs:(n.subs||[]).slice()};});` +
    `localStorage.setItem('smartart',JSON.stringify(st));location.reload();})()`;

  const res = {}; let fallos = 0;
  const vistas = [
    ['desktop-vertical', 1440, 900, false, null], ['desktop-horizontal', 1440, 900, false, 'horizontal'],
    ['desktop-radial', 1440, 900, false, 'radial'], ['desktop-cards', 1440, 900, false, 'cards'],
    ['desktop-ciclo', 1440, 900, false, 'ciclo'], ['desktop-concepto', 1440, 900, false, 'concepto'],
    ['desktop-infografia', 1600, 1000, false, 'infografia'],
    ['movil-vertical', 390, 844, true, 'vertical'], ['movil-infografia', 390, 844, true, 'infografia'],
    ['movil-concepto', 390, 844, true, 'concepto'], ['movil-ciclo', 390, 844, true, 'ciclo']
  ];
  for (const [nombre, w, h, movil, lay] of vistas) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: !!movil });
    await send('Page.navigate', { url: U }); await sleep(1200);
    if (lay) { await ev(setLay(lay)); await sleep(1000); }
    const raw = await ev(MEDIR); const m = typeof raw === 'string' ? JSON.parse(raw) : raw;
    m.vista = nombre; res[nombre] = m; await shot(nombre);
    const ilegible = movil && m.minTextoEfectivo < MIN_TEXTO_MOVIL;
    if (m.desborde > 0 || ilegible || (m.idsDuplicados || []).length) fallos++;
    console.log(`${ilegible ? '✗' : '·'} ${nombre.padEnd(20)} escala=${String(m.escala).padEnd(6)} textos=${String(m.textos).padEnd(4)} ilegibles=${String(m.textosIlegibles).padEnd(4)} min=${String(m.minTextoEfectivo).padEnd(6)} desborde=${m.desborde}${(m.idsDuplicados || []).length ? ' ids!:[' + m.idsDuplicados.join(',') + ']' : ''}`);
  }
  fs.writeFileSync(path.join(OUT, 'medidas.json'), JSON.stringify(res, null, 1));
  chrome.kill(); await sleep(300);
  console.log(`\nCapturas y medidas en ${OUT}`);
  console.log(fallos ? `AUDITORÍA: ${fallos} vista(s) con problema (texto ilegible en móvil, desborde o ids duplicados)` : 'AUDITORÍA: sin problemas medibles');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.log('ERROR', (e && e.message) || e); process.exit(2); });
