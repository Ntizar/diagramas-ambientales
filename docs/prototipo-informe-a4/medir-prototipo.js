// Captura + medida del prototipo A4
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = '/home/nan/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const LIBS = '/home/nan/.chrome-libs/usr/lib/x86_64-linux-gnu';
const U = 'file:///home/nan/.hermes/cache/scratch/audit-smartart/prototipo-a4.html';
const PORT = 9333;
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const chrome = spawn(CHROME, ['--remote-debugging-port=' + PORT, '--headless=new', '--no-sandbox', '--disable-gpu', '--force-device-scale-factor=2', 'about:blank'],
    { env: { ...process.env, LD_LIBRARY_PATH: LIBS }, stdio: 'ignore' });
  let ok = false;
  for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:' + PORT + '/json/version')).ok) { ok = true; break; } } catch { } await sleep(300); }
  const tab = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?' + encodeURIComponent(U), { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(m.error) : p.res(m.result); } });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 700, height: 1300, deviceScaleFactor: 2, mobile: false });
  await send('Page.navigate', { url: U }); await sleep(1200);
  const r = await send('Runtime.evaluate', { returnByValue: true, expression: `(function(){
    var svg=document.querySelector('svg');
    var fs=[]; svg.querySelectorAll('text').forEach(function(t){ fs.push(parseFloat(t.getAttribute('font-size'))); });
    // bounding box del contenido real
    var bb=svg.getBBox();
    var mm2pt=72/25.4;
    return JSON.stringify({ titulo:document.title, nTextos:fs.length,
      minMM:+Math.min.apply(null,fs).toFixed(2), minPT:+(Math.min.apply(null,fs)*mm2pt).toFixed(1),
      maxMM:+Math.max.apply(null,fs).toFixed(2),
      bajo8pt: fs.filter(function(x){return x*mm2pt<8;}).length,
      contenido:{x:+bb.x.toFixed(1),y:+bb.y.toFixed(1),w:+bb.width.toFixed(1),h:+bb.height.toFixed(1)},
      desbordaDerecha:+(bb.x+bb.width-210).toFixed(2), desbordaAbajo:+(bb.y+bb.height-297).toFixed(2) });
  })()` });
  console.log(r.result.value);
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync('/home/nan/.hermes/cache/scratch/audit-smartart/PROTOTIPO-a4.png', Buffer.from(shot.data, 'base64'));
  console.log('captura OK');
  chrome.kill(); await sleep(300); process.exit(0);
})().catch(e => { console.log('ERROR', (e && e.message) || e); process.exit(1); });
