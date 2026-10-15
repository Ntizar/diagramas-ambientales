// HTML → PDF con Chrome headless (printToPDF)
const { spawn } = require('child_process');
const fs = require('fs');
const CHROME = '/home/nan/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const LIBS = '/home/nan/.chrome-libs/usr/lib/x86_64-linux-gnu';
const HTML = '/home/nan/.hermes/cache/scratch/audit-smartart/muestras.html';
const PDF = '/home/nan/.hermes/cache/scratch/audit-smartart/diagramas-una-de-cada-tipo.pdf';
const PORT = 9388;
const sleep = ms => new Promise(r => setTimeout(r, ms));
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
  await send('Page.enable');
  await send('Page.navigate', { url: 'file://' + HTML });
  await sleep(2500);
  // comprobar que hay 8 páginas y que los SVG se han renderizado
  const chk = await send('Runtime.evaluate', { returnByValue: true, expression: `(function(){
    var ps=document.querySelectorAll('.pagina'); var out=[];
    ps.forEach(function(p,i){
      var s=p.querySelector('svg'); if(!s){ out.push({p:i+1,error:'SIN SVG'}); return; }
      var r=s.getBoundingClientRect(); var pr=p.getBoundingClientRect();
      var nan=0; p.querySelectorAll('text').forEach(function(t){ if(/NaN|undefined/.test(t.textContent)) nan++; });
      var textos=p.querySelectorAll('text').length;
      // mm reales (1px = 1/96 in)
      out.push({p:i+1, titulo:(p.querySelector('h1')||{}).textContent, anchoMM:+(r.width/96*25.4).toFixed(0), altoMM:+(r.height/96*25.4).toFixed(0),
        anchoPagMM:+(pr.width/96*25.4).toFixed(0), textos:textos, nan:nan});
    });
    return JSON.stringify(out);
  })()` });
  JSON.parse(chk.result.value).forEach(function(o){
    if(o.error) console.log('  ✗ página '+o.p+': '+o.error);
    else console.log('  · p'+o.p+' '+String(o.titulo).padEnd(34)+' diagrama '+String(o.anchoMM).padStart(4)+'x'+String(o.altoMM).padStart(4)+' mm  textos='+String(o.textos).padStart(3)+'  NaN='+o.nan);
  });
  const r = await send('Page.printToPDF', {
    landscape: true, preferCSSPageSize: true, printBackground: true,
    marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0
  });
  fs.writeFileSync(PDF, Buffer.from(r.data, 'base64'));
  const st = fs.statSync(PDF);
  const head = fs.readFileSync(PDF).slice(0, 8).toString();
  console.log('PDF:', PDF, (st.size / 1024).toFixed(0), 'KB · cabecera:', head.replace(/\n/g, ' '));
  chrome.kill(); await sleep(300); process.exit(0);
})().catch(e => { console.log('ERROR', (e && e.message) || e); process.exit(1); });
