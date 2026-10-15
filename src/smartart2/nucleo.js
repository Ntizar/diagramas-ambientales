/* ============================================================================
   Motor2 — núcleo del editor de diagramas (v2)
   Principios:
   1. NO se escala: se recompone. El motor recibe el ANCHO disponible y ahí
      decide cuántas columnas y qué tamaños de letra (la letra no encoge).
   2. Nada se estima: el texto se mide con getComputedTextLength() cuando hay
      DOM; fuera del navegador se usa un factor conservador.
   3. Nada se dibuja en coordenadas "a ojo": todo lo coloca el compositor en
      flujo vertical y el icono va SIEMPRE en su propia columna con aire mínimo.
   4. Auditor propio: detecta solapes, desbordes, NaN y textos que son un peso.
   ============================================================================ */
(function (root) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const FONT = "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif";

  const TEMA = {
    verde: '#1FA971', verdeOsc: '#0E7A50', verdeClaro: '#EBF5EF', verdeSuave: '#F6FBF8',
    tinta: '#132A3E', tinta2: '#4E657A', borde: '#DFE6E0', blanco: '#FFFFFF', fondo: '#FFFFFF'
  };

  /* ---- escalas por tamaño de pantalla: la LETRA no encoge, crece el lienzo ---- */
  const ESCALAS = {
    compacto: { h1: 25, h2: 19, h3: 16, cuerpo: 14, micro: 11.5, pad: 14, gap: 12, col: 1, radio: 11 },
    medio: { h1: 30, h2: 21.5, h3: 17, cuerpo: 15, micro: 12, pad: 18, gap: 16, col: 2, radio: 14 },
    amplio: { h1: 34, h2: 24, h3: 18, cuerpo: 15.5, micro: 12.5, pad: 22, gap: 20, col: 2, radio: 16 }
  };
  function escalaPara(ancho) { return ancho < 620 ? ESCALAS.compacto : (ancho < 1024 ? ESCALAS.medio : ESCALAS.amplio); }

  /* ---- medición real de texto ---- */
  let tMed = null;
  function initMedidor() {
    if (tMed || typeof document === 'undefined') return !!tMed;
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 1000 100');
    s.setAttribute('style', 'position:absolute;left:-9999px;top:0;width:1000px;height:100px');
    const t = document.createElementNS(NS, 'text'); s.appendChild(t);
    document.body.appendChild(s); tMed = t; return true;
  }
  function anchoTexto(txt, fs, peso, tracking) {
    const t = String(txt == null ? '' : txt);
    if (!t) return 0;
    if (initMedidor()) {
      tMed.setAttribute('font-family', FONT);
      tMed.setAttribute('font-size', fs);
      tMed.setAttribute('font-weight', peso || 400);
      tMed.setAttribute('letter-spacing', tracking || '0');
      tMed.textContent = t;
      const w = tMed.getComputedTextLength();
      if (w > 0) return w;
    }
    // fuera del navegador: estimación deliberadamente conservadora (se pasa, no se queda corta)
    return t.length * fs * 0.565;
  }
  function wrapTexto(texto, anchoMax, fs, peso, maxLin, tracking) {
    const palabras = String(texto == null ? '' : texto).split(/\s+/).filter(Boolean);
    const lineas = []; let l = '';
    for (const p of palabras) {
      const c = l ? l + ' ' + p : p;
      if (anchoTexto(c, fs, peso, tracking) > anchoMax && l) { lineas.push(l); l = p; } else l = c;
    }
    if (l) lineas.push(l);
    if (!lineas.length) lineas.push('');
    return { lineas: maxLin ? lineas.slice(0, maxLin) : lineas, cortado: !!(maxLin && lineas.length > maxLin) };
  }

  /* ---- utilidades de dibujo ---- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const n2 = v => (Math.round(v * 100) / 100);
  const txt = (x, y, fs, s, c, w, a, tr) =>
    `<text x="${n2(x)}" y="${n2(y)}" font-family="${FONT}" font-size="${n2(fs)}" font-weight="${w || 400}" fill="${c}" text-anchor="${a || 'start'}"${tr ? ` letter-spacing="${n2(tr)}"` : ''}>${esc(s)}</text>`;
  const blk = (x, y, fs, lh, ls, c, w, a) => ls.map((l, i) => txt(x, y + i * lh, fs, l, c, w, a)).join('');
  const rect = (x, y, w, h, o) => { o = o || {}; return `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}" rx="${n2(o.rx == null ? 3 : o.rx)}" fill="${o.fill || TEMA.blanco}" stroke="${o.borde || TEMA.borde}" stroke-width="${o.grosor == null ? 1 : o.grosor}"${o.sombra ? ' filter="url(#sombra)"' : ''}/>`; };
  const circulo = (cx, cy, r, o) => { o = o || {}; return `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="${o.fill || 'url(#gradAcento)'}"${o.borde ? ` stroke="${o.borde}" stroke-width="1"` : ''}${o.sombra ? ' filter="url(#sombra)"' : ''}/>`; };
  const icono = (nombre, x, y, tam, color, LOGOS) => `<g class="ico" transform="translate(${n2(x)},${n2(y)}) scale(${n2(tam / 24)})"><path d="${(LOGOS && LOGOS[nombre]) || (LOGOS && LOGOS.hoja) || ''}" fill="${color}"/></g>`;
  const chip = (x, y, w, h, o) => { o = o || {}; return `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}" rx="${n2(h / 2)}" fill="${o.fill || TEMA.verdeSuave}" stroke="${o.borde || TEMA.borde}" stroke-width="1"/>`; };
  const flechaV = (x, y1, y2, color, g) => `<line x1="${n2(x)}" y1="${n2(y1)}" x2="${n2(x)}" y2="${n2(y2 - g)}" stroke="${color}" stroke-width="1.4" stroke-dasharray="3 3" opacity="0.5"/><polygon points="${n2(x)},${n2(y2)} ${n2(x - g * 0.52)},${n2(y2 - g)} ${n2(x + g * 0.52)},${n2(y2 - g)}" fill="${color}"/>`;
  const flechaH = (x1, x2, y, color, g) => `<line x1="${n2(x1)}" y1="${n2(y)}" x2="${n2(x2 - g)}" y2="${n2(y)}" stroke="${color}" stroke-width="1.4" stroke-dasharray="3 3" opacity="0.5"/><polygon points="${n2(x2)},${n2(y)} ${n2(x2 - g)},${n2(y - g * 0.52)} ${n2(x2 - g)},${n2(y + g * 0.52)}" fill="${color}"/>`;

  /* ---- DEFS comunes ---- */
  const defs = () => `<defs>
    <linearGradient id="gradAcento" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="${TEMA.verde}"/><stop offset="1" stop-color="${TEMA.verdeOsc}"/></linearGradient>
    <filter id="sombra" x="-12%" y="-12%" width="124%" height="124%"><feDropShadow dx="0" dy="1" stdDeviation="1.4" flood-color="#0d1f17" flood-opacity="0.10"/></filter>
  </defs>`;

  /* ---- cabecera y pie de la lámina ---- */
  function cabecera(datos, ctx) {
    const e = ctx.esc, W = ctx.ancho;
    const tl = wrapTexto(datos.titulo, W - 2 * e.pad - 10, e.h1, 700, 3);
    const sl = datos.subtitulo ? wrapTexto(datos.subtitulo, W - 2 * e.pad - 10, e.cuerpo, 500, 3) : { lineas: [] };
    const kicker = (datos.kicker || datos.tipo || '').toUpperCase();
    const alto = e.pad * 0.7 + e.micro * 1.6 + 6 + tl.lineas.length * (e.h1 * 1.16) + (sl.lineas.length ? 8 + sl.lineas.length * (e.cuerpo * 1.35) : 0) + 6;
    let o = '';
    o += rect(e.pad, 0, 4, alto - 8, { fill: 'url(#gradAcento)', rx: 2, borde: 'none' });
    let y = e.micro * 1.5;
    o += txt(e.pad + 14, y, e.micro, kicker, TEMA.verdeOsc, 700, 'start', 0.9); y += e.micro * 1.2 + 6;
    o += blk(e.pad + 14, y + e.h1 * 0.86, e.h1, e.h1 * 1.16, tl.lineas, TEMA.tinta, 700);
    y += tl.lineas.length * e.h1 * 1.16;
    if (sl.lineas.length) o += blk(e.pad + 14, y + e.cuerpo * 1.02, e.cuerpo, e.cuerpo * 1.35, sl.lineas, TEMA.verdeOsc, 500);
    return { svg: o, alto: alto };
  }
  function pie(datos, ctx, alto) {
    const e = ctx.esc, W = ctx.ancho;
    const t = ctx.figura ? 'Figura ' + ctx.figura + ' · ' + datos.titulo : datos.titulo;
    const izq = wrapTexto(t, W - 2 * e.pad - 110, e.micro, 600, 1);
    let o = `<line x1="${n2(e.pad)}" y1="0.5" x2="${n2(W - e.pad)}" y2="0.5" stroke="${TEMA.borde}" stroke-width="1"/>`;
    o += txt(e.pad, e.micro * 1.5, e.micro, izq.lineas[0], TEMA.tinta2, 600);
    o += txt(W - e.pad, e.micro * 1.5, e.micro, 'Elaboración propia', TEMA.tinta2, 400, 'end');
    return { svg: o, alto: e.micro * 2.4 };
  }

  /* ---- compositor vertical: coloca bloques y garantiza separación ---- */
  function componer(bloques, ctx, topY) {
    const e = ctx.esc, GAP = Math.max(6, e.gap * 0.55);
    let y = topY, svg = '';
    bloques.forEach((b, i) => {
      svg += mover(b.svg, 0, y);
      y += b.alto + (i < bloques.length - 1 ? GAP : 0);
    });
    return { svg: svg, alto: y - topY };
  }
  // reubica un bloque dibujado desde y=0 (mueve también los transform de los iconos)
  function mover(s, dx, dy) {
    if (!dy && !dx) return s;
    return s.replace(/translate\((-?[\d.]+),\s*(-?[\d.]+)\)/g, (m, a, b) => `translate(${n2(+a + dx)},${n2(+b + dy)})`)
      .replace(/\b(x|y|cx|cy)="(-?[\d.]+)"/g, (m, k, v) => ((k === 'x' || k === 'cx') ? k + '="' + n2(+v + dx) + '"' : k + '="' + n2(+v + dy) + '"'));
  }

  /* ---- AUDITOR: mide el SVG renderizado y detecta lo que no debe pasar ---- */
  function auditar(svgEl, opts) {
    opts = opts || {};
    const errores = { choques: [], fuera: [], nan: [], textoPeso: [], aireJusto: [] };
    if (!svgEl || !svgEl.getScreenCTM) return errores;
    const inv = svgEl.getScreenCTM().inverse();
    const p2u = (px, py) => { const p = svgEl.createSVGPoint(); p.x = px; p.y = py; return p.matrixTransform(inv); };
    const bb = el => { const r = el.getBoundingClientRect(); const a = p2u(r.left, r.top), b = p2u(r.right, r.bottom); return { x: a.x, y: a.y, x2: b.x, y2: b.y, w: b.x - a.x, h: b.y - a.y }; };
    const caja = svgEl.viewBox.baseVal;
    const textos = [], iconos = [];
    svgEl.querySelectorAll('text').forEach(t => { const b = bb(t); if (b.w > 0) textos.push({ s: t.textContent, b: b, el: t }); });
    svgEl.querySelectorAll('g.ico').forEach(g => { const b = bb(g); if (b.w > 0 && b.h > 0) iconos.push({ b: b }); });
    textos.forEach(t => {
      if (/NaN|undefined|null/.test(t.s)) errores.nan.push(t.s);
      if (/^(100|200|300|400|500|600|700|800|900)$/.test(t.s.trim())) errores.textoPeso.push(t.s.trim());
      if (t.b.x < -1 || t.b.y < -1 || t.b.x2 > caja.width + 1 || t.b.y2 > caja.height + 1) errores.fuera.push(t.s);
      iconos.forEach(ic => {
        const ix = Math.min(t.b.x2, ic.b.x2) - Math.max(t.b.x, ic.b.x);
        const iy = Math.min(t.b.y2, ic.b.y2) - Math.max(t.b.y, ic.b.y);
        if (ix > 0.4 && iy > 0.4) { errores.choques.push({ texto: t.s, solape: [n2(ix), n2(iy)] }); return; }
        const dx = Math.max(ic.b.x - t.b.x2, t.b.x - ic.b.x2, 0), dy = Math.max(ic.b.y - t.b.y2, t.b.y - ic.b.y2, 0);
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < (opts.aireMin || 3)) errores.aireJusto.push({ texto: t.s, distancia: n2(d) });
      });
    });
    return errores;
  }

  /* ---- API ---- */
  function render(peticion) {
    const { tipo, datos } = peticion;
    const ancho = Math.max(280, Math.round(peticion.ancho || 900));
    const est = peticion.estilo || {};
    const ctx = {
      ancho: ancho, esc: escalaPara(ancho), tema: TEMA, LOGOS: peticion.logos || {},
      figura: peticion.figura || 0, avisos: [],
      medir: anchoTexto, wrap: wrapTexto,
      dibujar: { rect, circulo, icono, chip, txt, blk, flechaV, flechaH, n2 },
      hit: peticion.hit || null,
      compacto: ancho < 620, medio: ancho >= 620 && ancho < 1024, amplio: ancho >= 1024
    };
    if (est.acento) { TEMA.verde = est.acento; TEMA.verdeOsc = oscurecer(est.acento, 0.62); }
    const L = LAYOUTS[tipo] || LAYOUTS.pasos;
    const cab = cabecera(datos, ctx);
    const cuerpo = L.cuerpo(datos, ctx);
    const comp = componer(cuerpo.bloques, ctx, cab.alto + ctx.esc.gap);
    const p = pie(datos, ctx);
    const altoTotal = cab.alto + ctx.esc.gap + comp.alto + ctx.esc.gap * 1.4 + p.alto + ctx.esc.pad * 0.6;
    const pieY = altoTotal - p.alto - ctx.esc.pad * 0.4;
    const svg = `<svg xmlns="${NS}" viewBox="0 0 ${ancho} ${n2(altoTotal)}" width="100%" preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:auto">`
      + defs()
      + `<rect width="${ancho}" height="${n2(altoTotal)}" fill="${TEMA.fondo}"/>`
      + cab.svg + comp.svg + mover(p.svg, 0, pieY)
      + `</svg>`;
    return { svg: svg, ancho: ancho, alto: n2(altoTotal), avisos: ctx.avisos,
      _debug: peticion.debug ? { cabecera: n2(cab.alto), pie: n2(p.alto), bloques: cuerpo.bloques.map(b => n2(b.alto)) } : null };
  }
  function oscurecer(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
  }

  const LAYOUTS = {};
  const Motor2 = {
    TEMA: TEMA, ESCALAS: ESCALAS, escalaPara: escalaPara, anchoTexto: anchoTexto, wrapTexto: wrapTexto,
    defs: defs, cabecera: cabecera, pie: pie, componer: componer, mover: mover, auditar: auditar,
    render: render, LAYOUTS: LAYOUTS, dib: { rect, circulo, icono, chip, txt, blk, flechaV, flechaH, n2, esc }, TEMA_REF: TEMA
  };
  root.Motor2 = Motor2;
  if (typeof module !== 'undefined' && module.exports) module.exports = Motor2;
})(typeof window !== 'undefined' ? window : globalThis);
