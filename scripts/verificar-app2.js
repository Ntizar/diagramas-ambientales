// Verifica la APP compilada (smartart-v2/index.html) a varios anchos:
// carga, renderiza, audita en vivo y comprueba que la edición cambia la lámina.
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const CHROME = process.env.CHROME || '/home/nan/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const LIBS = process.env.CHROME_LIBS || '/home/nan/.chrome-libs/usr/lib/x86_64-linux-gnu';
const RAIZ = path.join(__dirname, '..');
const U = 'file://' + process.argv[2] || ('file://' + path.join(RAIZ, 'smartart-v2', 'index.html'));
const PORT = +(process.env.PORT || 9455);
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const chrome = spawn(CHROME, ['--remote-debugging-port=' + PORT, '--headless=new', '--no-sandbox', '--disable-gpu', 'about:blank'],
    { env: { ...process.env, LD_LIBRARY_PATH: LIBS }, stdio: 'ignore' });
  let ok = false;
  for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:' + PORT + '/json/version')).ok) { ok = true; break; } } catch { } await sleep(300); }
  if (!ok) { console.log('CHROMIUM NO ARRANCÓ'); process.exit(2); }
  const tab = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?' + encodeURIComponent('file://' + (process.argv[2] || path.join(RAIZ, 'smartart-v2', 'index.html'))), { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  const excepciones = [];
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data);
    if (m.method === 'Runtime.exceptionThrown') excepciones.push(JSON.stringify(m.params.exceptionDetails).slice(0, 260));
    if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(m.error) : p.res(m.result); }
  });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable'); await send('Runtime.enable');
  const ev = async (expr) => { const r = await send('Runtime.evaluate', { returnByValue: true, expression: expr, awaitPromise: true }); return r.exceptionDetails ? { __err: JSON.stringify(r.exceptionDetails).slice(0, 240) } : (r.result ? r.result.value : null); };

  const ANCHOS = [[1440, 900], [1100, 900], [768, 1000], [390, 844], [320, 780]];
  let fallos = 0;
  for (const [w, h] of ANCHOS) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 800 });
    await send('Page.navigate', { url: 'file://' + (process.argv[2] || path.join(RAIZ, 'smartart-v2', 'index.html')) });
    await sleep(1500);
    const info = await ev(`(function(){
      var svg=document.querySelector('#lienzoWrap svg'); if(!svg) return JSON.stringify({error:'sin svg'});
      var err = Motor2.auditar(svg, {aireMin:3});
      var t = svg.querySelectorAll('text').length;
      var edit = svg.querySelectorAll('[data-e]').length;
      var desborde = document.scrollingElement.scrollWidth - document.scrollingElement.clientWidth;
      return JSON.stringify({ancho:+document.getElementById('lienzoWrap').getBoundingClientRect().width.toFixed(0),
        textos:t, editables:edit, desbordePagina:desborde,
        choques:err.choques.length, fuera:err.fuera.length, nan:err.nan.length, peso:err.textoPeso.length, aire:err.aireJusto.length,
        tipo:document.getElementById('nombreTipo').textContent});
    })()`);
    const d = typeof info === 'string' ? JSON.parse(info) : info;
    if (d.__err || d.error) { console.log('  ✗ ' + w + 'px → ' + (d.__err || d.error)); fallos++; continue; }
    const malo = d.choques || d.fuera || d.nan || d.peso || d.aire || d.desbordePagina > 0;
    if (malo) fallos++;
    console.log('  ' + (malo ? '✗' : '·') + ' ventana ' + String(w).padStart(4) + 'px → lienzo ' + String(d.ancho).padStart(4) +
      'px | ' + d.tipo.padEnd(10) + ' | textos ' + String(d.textos).padStart(3) + ' edit ' + String(d.editables).padStart(2) +
      ' | choques ' + d.choques + ' fuera ' + d.fuera + ' nan ' + d.nan + ' peso ' + d.peso + ' aire ' + d.aire +
      ' | desborde ' + d.desbordePagina);
  }

  // --- los 8 tipos dentro de la app, a 3 anchos ---
  console.log('\n  TIPOS EN LA APP:');
  for (const [w, h] of [[1440, 900], [900, 1000], [390, 844]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 800 });
    await send('Page.navigate', { url: 'file://' + (process.argv[2] || path.join(RAIZ, 'smartart-v2', 'index.html')) });
    await sleep(1400);
    const lista = await ev('JSON.stringify(Object.keys(Motor2.LAYOUTS))');
    for (const t of JSON.parse(lista)) {
      await ev('window.__cambiarTipo(' + JSON.stringify(t) + ')');
      await sleep(320);
      const d = await ev(`(function(){
        var svg=document.querySelector('#lienzoWrap svg'); if(!svg) return JSON.stringify({error:'sin svg'});
        var err=Motor2.auditar(svg,{aireMin:3});
        return JSON.stringify({t:${JSON.stringify(t)}, textos:svg.querySelectorAll('text').length,
          choques:err.choques.length, fuera:err.fuera.length, nan:err.nan.length, peso:err.textoPeso.length, aire:err.aireJusto.length,
          desborde:document.scrollingElement.scrollWidth-document.scrollingElement.clientWidth});
      })()`);
      const x = typeof d === 'string' ? JSON.parse(d) : d;
      const malo = x.error || x.choques || x.fuera || x.nan || x.peso || x.aire || x.desborde > 0;
      if (malo) fallos++;
      console.log('    ' + (malo ? '✗' : '·') + ' ' + String(w).padStart(4) + 'px ' + String(x.t).padEnd(10) + ' textos ' + String(x.textos).padStart(3) +
        ' | choques ' + x.choques + ' fuera ' + x.fuera + ' nan ' + x.nan + ' peso ' + x.peso + ' aire ' + x.aire + ' desborde ' + x.desborde + (x.error ? ' ' + x.error : ''));
    }
  }

  // --- estructura: añadir 5 cajas, auditar, eliminar hasta 1, auditar ---
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file://' + (process.argv[2] || path.join(RAIZ, 'smartart-v2', 'index.html')) });
  await sleep(1500);
  console.log('\n  ESTRUCTURA (añadir / quitar cajas):');
  const estructura = await ev(`(async function(){
    var log=[];
    function medir(){ var svg=document.querySelector('#lienzoWrap svg'); var e=Motor2.auditar(svg,{aireMin:3});
      return {cajas:(window.__S().datos.nodos||[]).length, textos:svg.querySelectorAll('text').length,
        choques:e.choques.length, fuera:e.fuera.length, nan:e.nan.length, aire:e.aireJusto.length}; }
    window.__cambiarTipo('pasos');
    for (var i=0;i<5;i++){
      document.querySelector('#lienzoWrap [data-e]').dispatchEvent(new MouseEvent('click',{bubbles:true}));
      var b=document.getElementById('aAdd'); if(!b) return JSON.stringify({error:'sin botón añadir'});
      b.click();
      await new Promise(r=>setTimeout(r,220));
      log.push(Object.assign({paso:'+'+i}, medir()));
    }
    for (var j=0;j<10;j++){
      var d=document.getElementById('aDel'); if(!d || d.disabled) break;
      d.click(); await new Promise(r=>setTimeout(r,220));
      log.push(Object.assign({paso:'-'+j}, medir()));
    }
    return JSON.stringify(log);
  })()`);
  const est = typeof estructura === 'string' ? JSON.parse(estructura) : estructura;
  if (est.error) { console.log('    ✗ ' + est.error); fallos++; }
  else est.forEach(p => {
    const malo = p.choques || p.fuera || p.nan || p.aire || p.cajas < 1;
    if (malo) fallos++;
    console.log('    ' + (malo ? '✗' : '·') + ' ' + String(p.paso).padEnd(4) + ' cajas ' + String(p.cajas).padStart(2) + ' textos ' + String(p.textos).padStart(3) +
      ' | choques ' + p.choques + ' fuera ' + p.fuera + ' nan ' + p.nan + ' aire ' + p.aire);
  });

  // --- edición real: cambiar el título y ver que la lámina cambia ---
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file://' + (process.argv[2] || path.join(RAIZ, 'smartart-v2', 'index.html')) });
  await sleep(1500);
  const antes = await ev(`document.querySelector('#lienzoWrap svg text').textContent`);
  const edit = await ev(`(function(){
    // 1) clic en el primer elemento editable
    var el=document.querySelector('#lienzoWrap [data-e]'); el.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    var hayPanel = !!document.querySelector('#panel input, #panel textarea');
    // 2) escribir en el primer campo y comprobar que la lámina se re-renderiza
    var inp=document.querySelector('#panel input, #panel textarea');
    if(!inp) return JSON.stringify({error:'sin campo en el panel'});
    inp.value='PRUEBAX'; inp.dispatchEvent(new Event('input',{bubbles:true}));
    return JSON.stringify({hayPanel:hayPanel, campo:inp.id});
  })()`);
  await sleep(600);
  const despues = await ev(`document.querySelector('#lienzoWrap svg').innerHTML.indexOf('PRUEBAX')>=0`);
  const ed = typeof edit === 'string' ? JSON.parse(edit) : edit;
  const selOk = await ev("(function(){ var s=document.querySelector('#lienzoWrap [data-e].sel'); if(!s) return 'sin resaltar'; var r=s.getBoundingClientRect(); return JSON.stringify({resaltado:true, w:Math.round(r.width), h:Math.round(r.height), iconos:document.querySelectorAll('#panel .acciones svg').length}); })()");
  console.log('  resaltado del seleccionado: ' + selOk);
  if (String(selOk).indexOf('sin resaltar') >= 0 || String(selOk).indexOf('"iconos":4') < 0) { console.log('  ✗ falta el resaltado o los iconos de los botones'); fallos++; }

  // el menú debe ser un panel real (nada de prompt) con los botones de exportación
  const menuRaw = await ev("JSON.stringify({menu:!!document.getElementById('menu'), botones:document.querySelectorAll('#menu .op button').length, copiar:!!document.getElementById('mCopiar'), hayPrompt:/window.prompt\\(/.test(document.documentElement.innerHTML)})");
  const mo = typeof menuRaw === 'string' ? JSON.parse(menuRaw) : menuRaw;
  console.log('  menú: ' + JSON.stringify(mo));
  if (!mo.menu || mo.botones < 6 || !mo.copiar || mo.hayPrompt) { console.log('  ✗ menú incompleto (o queda un prompt)'); fallos++; }
  console.log('\n  edición: panel=' + (ed.hayPanel ? 'sí' : 'NO') + ' · campo=' + ed.campo + ' · ¿la lámina refleja el cambio? ' + (despues ? 'SÍ ✅' : 'NO ✗'));
  if (!ed.hayPanel || !despues) fallos++;

  if (excepciones.length) { console.log('\n  EXCEPCIONES (' + excepciones.length + '):'); excepciones.slice(0, 4).forEach(x => console.log('   ' + x)); fallos++; }
  console.log('\n' + (fallos ? 'RESULTADO: ' + fallos + ' problema(s)' : 'RESULTADO: la app funciona en todos los anchos ✅'));
  chrome.kill(); await sleep(200);
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.log('ERROR', (e && e.message) || e); process.exit(2); });
