// Auditoría SmartArt — capturas + medición objetiva vía CDP puro (sin playwright)
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = '/home/nan/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const LIBS = '/home/nan/.chrome-libs/usr/lib/x86_64-linux-gnu';
const U = 'file:///home/nan/Projects/diagramas-ambientales/smartart/index.html';
const OUT = '/home/nan/.hermes/cache/scratch/audit-smartart';
const PORT = 9311;
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const chrome = spawn(CHROME, ['--remote-debugging-port=' + PORT, '--headless=new', '--no-sandbox',
    '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2', 'about:blank'],
    { env: { ...process.env, LD_LIBRARY_PATH: LIBS }, stdio: 'ignore' });
  let ok = false;
  for (let i = 0; i < 60; i++) { try { const r = await fetch('http://127.0.0.1:' + PORT + '/json/version'); if (r.ok) { ok = true; break; } } catch { } await sleep(300); }
  if (!ok) { console.log('CHROME NO ARRANCO'); process.exit(1); }

  const tab = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?' + encodeURIComponent(U), { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0; const pend = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(m.error) : p.res(m.result); } });
  await new Promise(r => ws.addEventListener('open', r));
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
  const ev = async (e) => { const r = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) return { __err: JSON.stringify(r.exceptionDetails).slice(0, 300) }; return r.result ? r.result.value : null; };
  const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(r.data, 'base64')); };

  const medidas = {};
  // ---------- MEDICIÓN GENÉRICA ----------
  const MEDIR = `(function(){
    var d=document.scrollingElement, svg=document.querySelector('#svgwrap svg');
    var hits=document.querySelectorAll('#svgwrap .hit').length;
    var wrap=document.getElementById('svgwrap');
    var m=wrap?wrap.style.transform:null;
    var k=1; var mm=/scale\\(([0-9.]+)\\)/.exec(m||''); if(mm) k=parseFloat(mm[1]);
    var tidos={}; ['cg','cbg','kbg','kg','numGrad','cierre'].forEach(function(x){ var n=document.querySelectorAll('[id="'+x+'"]').length; if(n>1) tidos[x]=n; });
    var todos={}; document.querySelectorAll('defs [id]').forEach(function(el){ todos[el.id]=(todos[el.id]||0)+1; });
    var dup=Object.keys(todos).filter(function(x){return todos[x]>1;});
    var cuerpos=[]; document.querySelectorAll('#svgwrap text').forEach(function(t){ var r=t.getBoundingClientRect(); cuerpos.push({t:t.textContent.slice(0,28), fs:parseFloat(t.getAttribute('font-size')||'0'), fx:+(parseFloat(t.getAttribute('font-size')||'0')*k).toFixed(2), w:+r.width.toFixed(1), h:+r.height.toFixed(1)}); });
    var tapados=cuerpos.filter(function(c){return c.fx<9;}).length;
    return JSON.stringify({ localidad:location.href.split('/').pop()+' | layout='+(window.__LAY||'?'),
      viewport:{w:innerWidth,h:innerHeight},
      docScroll:{sw:d.scrollWidth,cw:d.clientWidth,desborde:d.scrollWidth-d.clientWidth},
      svg:{vbW:svg?svg.viewBox.baseVal.width:null, vbH:svg?svg.viewBox.baseVal.height:null},
      escala:+(k.toFixed(3)), hits:hits,
      nodosTexto:cuerpos.length, textosBajo9pxEfectivos:tapados,
      minTextoEfectivo:+(Math.min.apply(null,cuerpos.map(function(c){return c.fx;}))||0).toFixed(2),
      idsDuplicados:dup, tabs4xmas:[], tabSize:document.querySelectorAll('header .btn').length,
      storageSize:(localStorage.getItem('smartart')||'').length
    });
  })()`;

  const ir = async (w, h, mobile, nombre, prep) => {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: !!mobile });
    await send('Page.navigate', { url: U }); await sleep(1400);
    if (prep) { await ev(prep); await sleep(900); }
    const r = await ev(MEDIR); medidas[nombre] = r;
    await shot(nombre);
  };

  const setLay = (lay) => `(function(){ try{ localStorage.removeItem('smartart'); }catch(e){}; ` +
    `var E=window.EJEMPLOS['${lay}']; var st=JSON.parse(JSON.stringify(E)); ` +
    `st.nodos=(st.nodos||[]).map(function(n){return {label:n.label,icono:n.icono||'',color:'',desc:n.desc||'',subs:(n.subs||[]).slice()};}); ` +
    `['ciclo','concepto','infografia'].forEach(function(k){ if(k!=='${lay}'){} }); ` +
    `localStorage.setItem('smartart', JSON.stringify(st)); location.reload(); })()`;

  // 1) vertical por defecto
  await ir(1440, 900, false, '01-desktop-vertical', null);
  // 2) cada layout en desktop
  for (const lay of ['horizontal', 'radial', 'cards', 'ciclo', 'concepto']) {
    await ir(1440, 900, false, '02-desktop-' + lay, setLay(lay));
  }
  // 3) INFOGRAFÍA desktop y móvil (el caso estrella)
  await ir(1600, 1000, false, '03-desktop-infografia', setLay('infografia'));
  await ir(390, 844, true, '04-movil-infografia', setLay('infografia'));
  await ir(390, 844, true, '05-movil-concepto', setLay('concepto'));
  await ir(390, 844, true, '06-movil-ciclo', setLay('ciclo'));
  await ir(390, 844, true, '07-movil-vertical', setLay('vertical'));
  // 4) galería abierta (ids duplicados)
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await send('Page.navigate', { url: U }); await sleep(1400);
  await ev("document.getElementById('bTipo').click()"); await sleep(800);
  medidas['08-desktop-galeria'] = await ev(MEDIR + '');
  await shot('08-desktop-galeria');
  // 5) colisión de gradientes: lienzo ciclo con color naranja + galeria abierta
  await ev(setLay('ciclo')); await sleep(1400);
  await ev("(function(){ var s=JSON.parse(localStorage.getItem('smartart')); s.color='#F97316'; localStorage.setItem('smartart',JSON.stringify(s)); location.reload(); })()"); await sleep(1400);
  await ev("document.getElementById('galeria').classList.add('on')"); await sleep(600);
  medidas['09-colision-ids'] = await ev(`(function(){
     var g=document.querySelectorAll('[id="cg"]');
     var primero=g[0]?g[0].closest('.thumb')?'MINIATURA':g[0].closest('#svgwrap')?'LIENZO':'?':'?';
     var stops=g[0]?Array.from(g[0].querySelectorAll('stop')).map(function(s){return s.getAttribute('stop-color');}):[];
     var hub=document.querySelector('#svgwrap svg');
     return JSON.stringify({n_cg:g.length, ganaPrimero:primero, stopsDelQueGana:stops,
       colorEstado:JSON.parse(localStorage.getItem('smartart')).color});
  })()`);
  await shot('09-colision-ciclo-naranja');

  // 6) accesibilidad / teclado / a11y básica
  await send('Page.navigate', { url: U }); await sleep(1400);
  medidas['10-a11y'] = await ev(`(function(){
    var svg=document.querySelector('#svgwrap svg');
    var focusables=document.querySelectorAll('#svgwrap [tabindex],#svgwrap a,#svgwrap button').length;
    var l=document.querySelector('link[rel=stylesheet]');
    var inp=document.querySelectorAll('input,textarea,select').length;
    var sinLabel=0; document.querySelectorAll('input,textarea,select').forEach(function(i){ if(!i.id||!document.querySelector('label[for="'+i.id+'"]')) sinLabel++; });
    return JSON.stringify({focusablesEnLienzo:focusables, hojasExternas:l?l.href:'(ninguna)',
      camposFormulario:inp, camposSinLabelAsociado:sinLabel,
      userScalableNo: /user-scalable=no/.test(document.querySelector('meta[name=viewport]').content),
      fuentesWeb: (document.fonts&&document.fonts.size)||0, svgTextoSeleccionable: (function(){ return typeof svg.createTextRange==='undefined'; })() });
  })()`);

  console.log(JSON.stringify(medidas, null, 1));
  chrome.kill();
  await sleep(400);
  process.exit(0);
})().catch(e => { console.log('ERROR', e && e.message || e); process.exit(1); });
