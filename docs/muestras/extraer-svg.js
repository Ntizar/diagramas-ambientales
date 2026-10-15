// Extrae el SVG ya construido del prototipo (se genera por JS) para poder incrustarlo en el PDF
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = '/home/nan/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const LIBS = '/home/nan/.chrome-libs/usr/lib/x86_64-linux-gnu';
const U = 'file:///home/nan/.hermes/cache/scratch/audit-smartart/prototipo-v5.html';
const SALIDA = '/home/nan/.hermes/cache/scratch/audit-smartart/prototipo.svg';
const PORT = 9399;
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const chrome = spawn(CHROME, ['--remote-debugging-port=' + PORT, '--headless=new', '--no-sandbox', '--disable-gpu', 'about:blank'],
    { env: { ...process.env, LD_LIBRARY_PATH: LIBS }, stdio: 'ignore' });
  for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:' + PORT + '/json/version')).ok) break; } catch { } await sleep(300); }
  const tab = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?' + encodeURIComponent(U), { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(m.error) : p.res(m.result); } });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable'); await send('Runtime.enable');
  await send('Page.navigate', { url: U });
  await sleep(1800);
  const r = await send('Runtime.evaluate', { returnByValue: true, expression: `(function(){
    var s=document.querySelector('svg'); if(!s) return '';
    return s.outerHTML;
  })()` });
  const svg = r.result.value;
  if (!svg || svg.length < 1000) { console.log('FALLO: SVG vacío o ausente (' + (svg || '').length + ' chars)'); process.exit(1); }
  fs.writeFileSync(SALIDA, svg);
  console.log('SVG extraído:', svg.length, 'chars ·', (svg.match(/<text/g) || []).length, 'textos · guardado en', SALIDA);
  chrome.kill(); await sleep(300); process.exit(0);
})().catch(e => { console.log('ERROR', (e && e.message) || e); process.exit(1); });
