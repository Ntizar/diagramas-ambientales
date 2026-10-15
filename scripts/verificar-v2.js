#!/usr/bin/env node
// Verificación del Motor2: renderiza los 8 tipos a 5 anchos y audita cada lámina.
// Falla (exit 1) si hay solapes, textos fuera, NaN, textos-peso o aire insuficiente.
const { spawn } = require('child_process');
const path = require('path');
const CHROME = process.env.CHROME || '/home/nan/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const LIBS = process.env.CHROME_LIBS || '/home/nan/.chrome-libs/usr/lib/x86_64-linux-gnu';
const RAIZ = path.join(__dirname, '..');
const U = 'file://' + path.join(RAIZ, 'src', 'smartart2', 'prueba.html');
const PORT = +(process.env.PORT || 9412);
const AIRE_MIN = +(process.env.AIRE_MIN || 3);
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const chrome = spawn(CHROME, ['--remote-debugging-port=' + PORT, '--headless=new', '--no-sandbox', '--disable-gpu', 'about:blank'],
    { env: { ...process.env, LD_LIBRARY_PATH: LIBS }, stdio: 'ignore' });
  let ok = false;
  for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:' + PORT + '/json/version')).ok) { ok = true; break; } } catch { } await sleep(300); }
  if (!ok) { console.log('CHROMIUM NO ARRANCÓ (revisa CHROME/CHROME_LIBS)'); process.exit(2); }
  const tab = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?' + encodeURIComponent(U), { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(m.error) : p.res(m.result); } });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: U });
  await sleep(2000);
  const err0 = await send('Runtime.evaluate', { returnByValue: true, expression: 'typeof window.__renderizarTodo + "|" + typeof window.Motor2', awaitPromise: false });
  if (!/^function\|object/.test(err0.result.value || '')) { console.log('La página de prueba no cargó: ' + err0.result.value); process.exit(2); }
  // renderizar AHORA (con el documento ya cargado): evita medir con fuentes/layout a medio construir
  await send('Runtime.evaluate', { returnByValue: true, expression: 'window.__renderizarTodo()' });
  await sleep(1200);
  const r = await send('Runtime.evaluate', { returnByValue: true, expression: `JSON.stringify(window.__auditarTodo(${AIRE_MIN}))`, awaitPromise: false });
  if (r.exceptionDetails) { console.log('EXCEPCIÓN al auditar:', JSON.stringify(r.exceptionDetails).slice(0, 500)); process.exit(2); }
  const casos = JSON.parse(r.result.value);
  let fallos = 0;
  console.log('tipo           ancho | textos | edit | alto | choques/fuera/nan/peso/aire');
  casos.forEach(c => {
    const malo = c.errorRender || c.choques > 0 || c.fuera > 0 || c.nan > 0 || c.textoPeso > 0 || c.aireJusto > 0 || (c.avisos && c.avisos.length);
    if (malo) fallos++;
    console.log('  ' + (malo ? '✗' : '·') + ' ' + c.tipo.padEnd(12) +
      String(c.ancho).padStart(5) + ' | txt ' + String(c.textos).padStart(3) + ' | edit ' + String(c.editables).padStart(3) +
      ' | alto ' + String(c.alto).padStart(8) + ' | choques ' + c.choques + ' | fuera ' + c.fuera +
      ' | nan ' + c.nan + ' | peso ' + c.textoPeso + ' | aire ' + c.aireJusto);
    if (c.errorRender) console.log('        RENDER FALLA: ' + c.errorRender);
    if (c.alto > 8000) console.log('        ALTO SOSPECHOSO ' + c.alto + ' · bloques: ' + JSON.stringify(c.bloques) + ' · medicion: ' + JSON.stringify(c.medicion));
    if (malo && c.detalle) {
      if (c.detalle.choques.length) console.log('        choques: ' + JSON.stringify(c.detalle.choques));
      if (c.detalle.fuera.length) console.log('        fuera: ' + JSON.stringify(c.detalle.fuera));
      if (c.detalle.aire.length) console.log('        aire: ' + JSON.stringify(c.detalle.aire));
      if (c.avisos && c.avisos.length) console.log('        avisos: ' + c.avisos.join('; '));
    }
  });
  console.log('\n' + casos.length + ' casos (esperados ' + (8*5) + ') · ' + (fallos ? fallos + ' con problema' : 'TODOS LIMPIOS ✅'));
  chrome.kill(); await sleep(200);
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.log('ERROR', (e && e.message) || e); process.exit(2); });
