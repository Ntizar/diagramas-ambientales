// PDF de las 8 láminas con el MOTOR v2 + capturas de la app
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const CHROME = process.env.CHROME || '/home/nan/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const LIBS = process.env.CHROME_LIBS || '/home/nan/.chrome-libs/usr/lib/x86_64-linux-gnu';
const RAIZ = path.join(__dirname, '..');
const OUT = process.env.OUT || '/home/nan/.hermes/cache/scratch/audit-smartart';
const PORT = 9466;
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const chrome = spawn(CHROME, ['--remote-debugging-port=' + PORT, '--headless=new', '--no-sandbox', '--disable-gpu', 'about:blank'],
    { env: { ...process.env, LD_LIBRARY_PATH: LIBS }, stdio: 'ignore' });
  let ok = false;
  for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:' + PORT + '/json/version')).ok) { ok = true; break; } } catch { } await sleep(300); }
  if (!ok) { console.log('CHROMIUM NO ARRANCÓ'); process.exit(2); }
  const tab = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(m.error) : p.res(m.result); } });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable'); await send('Runtime.enable');
  const ev = async (e) => { const r = await send('Runtime.evaluate', { returnByValue: true, expression: e, awaitPromise: true }); return r.exceptionDetails ? { __err: JSON.stringify(r.exceptionDetails).slice(0, 200) } : (r.result ? r.result.value : null); };

  // ---------- 1) PDF de las 8 láminas (motor v2) ----------
  await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file://' + path.join(RAIZ, 'src', 'smartart2', 'muestras.html') });
  await sleep(2000);
  console.log('muestras:', await ev('document.title'));
  const pdf = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
  const pdfPath = path.join(OUT, 'diagramas-v2-a4.pdf');
  fs.writeFileSync(pdfPath, Buffer.from(pdf.data, 'base64'));
  console.log('PDF:', pdfPath, (fs.statSync(pdfPath).size / 1024).toFixed(0) + ' KB');

  // ---------- 2) capturas de la APP ----------
  const APP = 'file://' + path.join(RAIZ, 'smartart-v2', 'index.html');
  const shot = async (nombre, w, h, mobile) => {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: !!mobile });
    await send('Page.navigate', { url: APP }); await sleep(1600);
    const s = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT, nombre + '.png'), Buffer.from(s.data, 'base64'));
    return nombre;
  };
  await shot('app-desktop-informe', 1440, 900, false);
  // captura con un elemento seleccionado (se ve el panel de acciones)
  await ev('window.__cambiarTipo("pasos")'); await sleep(400);
  await ev('document.querySelectorAll("#lienzoWrap [data-e]")[1].dispatchEvent(new MouseEvent("click",{bubbles:true}))'); await sleep(500);
  await send('Page.captureScreenshot', { format: 'png' }).then(s => fs.writeFileSync(path.join(OUT, 'app-panel-elemento.png'), Buffer.from(s.data, 'base64')));
  // captura con muchas cajas (auto-adaptación)
  await ev(`(function(){ var S=window.__S(); S.datos.nodos=[]; for(var i=1;i<=12;i++) S.datos.nodos.push({label:'Caja '+i+' con un texto largo que obliga a que la tarjeta crezca sola', desc:'Descripción de la caja '+i+'.', subs:['uno','dos']}); window.__cambiarTipo(S.tipo); })()`); await sleep(600);
  await ev(`(function(){ var S=window.__S(); S.datos.nodos=[]; for(var i=1;i<=12;i++) S.datos.nodos.push({label:'Caja '+i+' con un texto largo que obliga a que la tarjeta crezca sola', desc:'Descripción de la caja '+i+'.', subs:['uno','dos']}); })()`);
  await ev('document.getElementById("bAncho").click()'); await sleep(700);
  await send('Page.captureScreenshot', { format: 'png' }).then(s => fs.writeFileSync(path.join(OUT, 'app-12-cajas.png'), Buffer.from(s.data, 'base64')));
  // captura con otro tono y un elemento seleccionado (chips editables a la vista)
  await ev('window.__cambiarTipo("informe")'); await sleep(400);
  await ev(`(function(){ var f=document.getElementById('volverDoc'); if(f) f.click(); var p=document.querySelectorAll('#paleta .sw'); if(p[3]) p[3].click(); })()`); await sleep(700);
  await ev('document.querySelectorAll("#lienzoWrap [data-e]")[1].dispatchEvent(new MouseEvent("click",{bubbles:true}))'); await sleep(500);
  await send('Page.captureScreenshot', { format: 'png' }).then(s => fs.writeFileSync(path.join(OUT, 'app-tonos-chips.png'), Buffer.from(s.data, 'base64')));
  await ev('window.__cambiarTipo("radial3")'); await sleep(500);
  await send('Page.captureScreenshot', { format: 'png' }).then(s => fs.writeFileSync(path.join(OUT, 'app-desktop-radial3.png'), Buffer.from(s.data, 'base64')));
  await ev('document.getElementById("bTipo").click()'); await sleep(700);
  await send('Page.captureScreenshot', { format: 'png' }).then(s => fs.writeFileSync(path.join(OUT, 'app-galeria.png'), Buffer.from(s.data, 'base64')));
  await shot('app-movil', 390, 844, true);
  await ev('window.__cambiarTipo("informe")'); await sleep(400);
  await ev('document.querySelector("#lienzoWrap [data-e]").dispatchEvent(new MouseEvent("click",{bubbles:true}))'); await sleep(500);
  await send('Page.captureScreenshot', { format: 'png' }).then(s => fs.writeFileSync(path.join(OUT, 'app-movil-edicion.png'), Buffer.from(s.data, 'base64')));
  console.log('capturas: app-desktop-informe, app-desktop-radial3, app-galeria, app-movil, app-movil-edicion');
  chrome.kill(); await sleep(200); process.exit(0);
})().catch(e => { console.log('ERROR', (e && e.message) || e); process.exit(2); });
