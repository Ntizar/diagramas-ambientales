/* ============================================================================
   Motor2 — layouts. Cada tipo es una función pura que devuelve bloques en
   flujo vertical; el compositor del núcleo los coloca. Los elementos editables
   van envueltos en <g data-e="N"> (el editor los detecta con closest()).
   El modo (compacto/medio/amplio) lo decide el ancho disponible.
   ============================================================================ */
(function (root) {
  'use strict';
  const M2 = root.Motor2 || (typeof require !== 'undefined' ? require('./nucleo.js') : null);
  const L = M2.LAYOUTS;
  const T = M2.TEMA;
  const d = M2.dib;

  /* ---------- helpers compartidos ---------- */
  // chips en flujo: caben los que quepan por fila, nunca se salen
  function flujoChips(ctx, chips, x0, y0, anchoMax, fs) {
    const e = ctx.esc, padCh = fs * 0.85, gapX = 6, gapY = 6;
    const filas = []; let fila = [], usado = 0;
    chips.forEach(c => {
      const w = M2.anchoTexto(c, fs, 500) + padCh * 2;
      if (usado + w > anchoMax && fila.length) { filas.push({ fila: fila, usado: usado }); fila = []; usado = 0; }
      fila.push(c); usado += w + gapX;
    });
    if (fila.length) filas.push({ fila: fila, usado: usado });
    const h = fs * 2.1;
    let o = '', y = y0;
    filas.forEach(f => {
      let x = x0;
      f.fila.forEach(c => {
        const w = M2.anchoTexto(c, fs, 500) + padCh * 2;
        o += d.chip(x, y, w, h, {});
        o += d.txt(x + w / 2, y + h / 2 + fs * 0.35, fs, c, T.tinta2, 500, 'middle');
        x += w + gapX;
      });
      y += h + gapY;
    });
    return { svg: o, alto: Math.max(0, y - y0 - gapY) };
  }
  // anchura natural de una fila de chips
  function anchoChips(ctx, chips, fs) { return chips.reduce((a, c) => a + M2.anchoTexto(c, fs, 500) + fs * 1.7 + 6, 0); }

  // tarjeta con marca (número y/o icono) + texto + chips. Alto SIEMPRE calculado.
  function tarjeta(ctx, it, W, o) {
    o = o || {};
    const e = ctx.esc, u = ctx.tema;
    const padX = Math.max(10, e.pad * 0.7), padY = Math.max(9, e.pad * 0.6);
    const rNum = e.cuerpo * 0.95, icoTam = rNum * 1.85;
    let marca = 0;
    if (o.numero != null) marca += rNum * 2;
    if (o.icono) marca += (o.numero != null ? 8 : 0) + icoTam;
    if (marca) marca += 12;   // aire garantizado marca → texto
    const anchoTxt = W - padX * 2 - marca;
    if (o.color) it.color = o.color;
    const t = ctx.wrap(it.titulo || it.label || '', anchoTxt, o.fsTitulo || e.h3, 700, 3);
    const desc = it.desc ? ctx.wrap(it.desc, anchoTxt, e.cuerpo, 400, 4) : { lineas: [] };
    const chips = (it.chips || []).filter(Boolean).slice(0, 5);
    const lhT = (o.fsTitulo || e.h3) * 1.24, lhD = e.cuerpo * 1.36;
    let altoTexto = t.lineas.length * lhT;
    if (desc.lineas.length) altoTexto += 5 + desc.lineas.length * lhD;
    let altoChips = 0, chipsSvg = '';
    if (chips.length) {
      const r = flujoChips(ctx, chips, 0, 0, W - padX * 2, e.micro);
      chipsSvg = r.svg; altoChips = r.alto + 7;
    }
    const alto = padY * 2 + Math.max(altoTexto, (o.numero != null || o.icono) ? Math.max(rNum * 2 + 4, icoTam) : 0) + altoChips;
    let o2 = `<g${o.editable != null ? ` data-e="${o.editable}"` : ''} class="tar">`;
    o2 += d.rect(0, 0, W, alto, { sombra: true, rx: e.radio });
    const rTar = e.radio, sangria = Math.max(2, rTar * 0.62);
    o2 += d.rect(0, sangria, 4, Math.max(6, alto - sangria * 2), { fill: it.color || 'url(#gradAcento)', rx: 2, borde: 'none' });
    let xTxt = padX + marca;
    if (o.numero != null) {
      const cx = padX + rNum, cy = padY + rNum + 2;
      o2 += d.circulo(cx, cy, rNum, it.color ? { fill: it.color } : {});
      o2 += d.txt(cx, cy + rNum * 0.34, rNum * 1.15, String(o.numero), '#FFF', 700, 'middle');
      if (o.icono) o2 += d.icono(o.icono, padX + rNum * 2 + 8, cy - icoTam / 2, icoTam, u.verdeOsc, ctx.LOGOS);
    } else if (o.icono) {
      o2 += d.icono(o.icono, padX, padY + 1, icoTam * 1.05, u.verdeOsc, ctx.LOGOS);
    }
    o2 += d.blk(xTxt, padY + (o.fsTitulo || e.h3) * 0.92, o.fsTitulo || e.h3, lhT, t.lineas, u.tinta, 700);
    if (desc.lineas.length) o2 += d.blk(xTxt, padY + t.lineas.length * lhT + 5 + e.cuerpo * 0.98, e.cuerpo, lhD, desc.lineas, u.tinta2, 400);
    if (chipsSvg) o2 += M2.mover(chipsSvg, padX, padY + altoTexto + 7);
    o2 += '</g>';
    return { svg: o2, alto: alto };
  }

  // rejilla de tarjetas: devuelve un bloque por fila (nunca columnas desalineadas)
  function rejilla(ctx, items, cols, gap, o) {
    const e = ctx.esc, W = ctx.ancho - e.pad * 2;
    const cw = (W - (cols - 1) * gap) / cols;
    const filas = [];
    for (let i = 0; i < items.length; i += cols) filas.push(items.slice(i, i + cols));
    return filas.map((fila, fi) => {
      const celdas = fila.map((it, j) => tarjeta(ctx, it, cw, Object.assign({}, o, {
        editable: it.__e != null ? it.__e : (o.primero + fi * cols + j),
        numero: (o.primero + fi * cols + j + 1),
        color: it.color
      })));
      const alto = Math.max.apply(null, celdas.map(c => c.alto));
      let svg = '';
      celdas.forEach((c, j) => { svg += M2.mover(c.svg, e.pad + j * (cw + gap), 0); });
      return { svg: svg, alto: alto };
    });
  }

  /* ============ 1. PASOS (proceso paso a paso) ============ */
  L.pasos = {
    nombre: 'Pasos',
    desc: 'Proceso paso a paso',
    cuerpo(datos, ctx) {
      const e = ctx.esc, n = datos.nodos.length;
      const cols = (ctx.amplio && n >= 5) ? 2 : 1;
      const items = datos.nodos.map((x, i) => ({ titulo: x.label, desc: x.desc, chips: x.subs, icono: x.icono, color: x.color, __e: i }));
      const gapV = e.gap * 0.7;
      if (cols === 1) {
        const W = ctx.ancho - e.pad * 2;
        const bloques = [];
        items.forEach((it, i) => {
          const bl = tarjeta(ctx, it, W, { numero: i + 1, icono: it.icono, editable: i });
          bloques.push(bl);
          if (i < items.length - 1) bloques.push({ svg: d.flechaV(W / 2, 0, gapV, T.verdeOsc, 8), alto: gapV });
        });
        return { bloques: bloques };
      }
      const filas = rejilla(ctx, items, 2, e.gap * 0.7, { primero: 0 });
      const out = [];
      filas.forEach((f, i) => { out.push(f); if (i < filas.length - 1) out.push({ svg: d.flechaV(ctx.ancho / 2 - e.pad, 0, gapV, T.verdeOsc, 8), alto: gapV }); });
      return { bloques: out };
    }
  };

  /* ============ 2. SECUENCIA (línea de hitos) ============ */
  L.secuencia = {
    nombre: 'Secuencia',
    desc: 'Línea temporal de fases',
    cuerpo(datos, ctx) {
      const e = ctx.esc, n = datos.nodos.length;
      const items = datos.nodos.map((x, i) => ({ titulo: x.label, desc: x.desc, chips: x.subs, icono: x.icono, color: x.color, __e: i }));
      const W = ctx.ancho - e.pad * 2;
      // compacto: columna con raíl lateral | amplio: serpentina de 2 filas
      if (ctx.compacto || n <= 2) {
        return L.pasos.cuerpo(datos, ctx);
      }
      const fila1 = Math.ceil(n / 2), fila2 = n - fila1;
      const cw = (W - (fila1 - 1) * e.gap * 0.7) / fila1;
      const bloques = [];
      const mk = (fila, primero, invertida) => {
        const celdas = fila.map((it, j) => tarjeta(ctx, it, cw, { numero: primero + j + 1, icono: it.icono, editable: it.__e }));
        const alto = Math.max.apply(null, celdas.map(c => c.alto));
        let svg = '';
        const orden = invertida ? celdas.slice().reverse() : celdas;
        orden.forEach((c, j) => {
          const col = invertida ? (fila.length - 1 - j) : j;
          svg += M2.mover(c.svg, e.pad + col * (cw + e.gap * 0.7), 0);
        });
        for (let j = 0; j < celdas.length - 1; j++) {
          const x1 = e.pad + j * (cw + e.gap * 0.7) + cw + 2, x2 = e.pad + (j + 1) * (cw + e.gap * 0.7) - 2;
          svg += d.flechaH(x1, x2, alto / 2, T.verdeOsc, 7);
        }
        return { svg: svg, alto: alto };
      };
      bloques.push(mk(items.slice(0, fila1), 0, false));
      const yCodo = e.gap * 1.5;
      const xDer = e.pad + (fila1 - 1) * (cw + e.gap * 0.7) + cw / 2;
      const xIzq2 = e.pad + (fila2 - 1) * (cw + e.gap * 0.7) + cw / 2;
      bloques.push({
        svg: `<path d="M${d.n2(xDer)},0 V${d.n2(yCodo * 0.55)} H${d.n2(xIzq2)} V${d.n2(yCodo - 7)}" fill="none" stroke="${T.verdeOsc}" stroke-width="1.4" stroke-dasharray="3 3" opacity="0.5"/>`
          + `<polygon points="${d.n2(xIzq2)},${d.n2(yCodo)} ${d.n2(xIzq2 - 3.6)},${d.n2(yCodo - 7)} ${d.n2(xIzq2 + 3.6)},${d.n2(yCodo - 7)}" fill="${T.verdeOsc}"/>`, alto: yCodo
      });
      bloques.push(mk(items.slice(fila1), fila1, false));
      return { bloques: bloques };
    }
  };

  /* ============ 3. TARJETAS (rejilla) ============ */
  L.tarjetas = {
    nombre: 'Tarjetas',
    desc: 'Rejilla de criterios',
    cuerpo(datos, ctx) {
      const e = ctx.esc, n = datos.nodos.length;
      const cols = ctx.ancho >= 1200 ? 3 : (ctx.ancho >= 620 ? 2 : 1);
      const items = datos.nodos.map((x, i) => ({ titulo: x.label, desc: x.desc, chips: x.subs, icono: x.icono, color: x.color, __e: i }));
      return { bloques: rejilla(ctx, items, cols, e.gap * 0.7, { primero: 0, icono: null }) };
    }
  };

  /* ============ 4. RADIAL (hub + satélites) ============ */
  L.radial = {
    nombre: 'Radial',
    desc: 'Hub central con satélites',
    cuerpo(datos, ctx) {
      const e = ctx.esc, W = ctx.ancho;
      if (ctx.compacto) return radialLista(datos, ctx);
      const hub = datos.nodos[0], sats = datos.nodos.slice(1), n = sats.length;
      const area = Math.min(W - e.pad * 2, 640);
      const cx = W / 2, R = area / 2 - 34, cw = Math.min(190, area / 2.6), ch = e.cuerpo * 2.6;
      const cyLocal = area / 2, HR = Math.min(78, R * 0.42);
      let svg = `<circle cx="${d.n2(cx)}" cy="${d.n2(cyLocal)}" r="${d.n2(R)}" fill="none" stroke="${T.borde}" stroke-width="1" stroke-dasharray="2 5"/>`;
      sats.forEach((nd, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / n, px = cx + R * Math.cos(a), py = cyLocal + R * Math.sin(a);
        const ux = Math.cos(a), uy = Math.sin(a);
        svg += `<line x1="${d.n2(cx + ux * HR)}" y1="${d.n2(cyLocal + uy * HR)}" x2="${d.n2(px - ux * cw / 2)}" y2="${d.n2(py - uy * ch / 2)}" stroke="${T.verdeOsc}" stroke-width="1" opacity="0.35"/>`;
        svg += `<circle cx="${d.n2(cx + ux * HR)}" cy="${d.n2(cyLocal + uy * HR)}" r="2.4" fill="${T.verde}"/>`;
        svg += `<g data-e="${i + 1}" class="sat">` + d.rect(px - cw / 2, py - ch / 2, cw, ch, { sombra: true, rx: e.radio })
          + d.blk(px, py + e.cuerpo * 0.36 - (ctx.wrap(nd.label, cw - 16, e.cuerpo, 600, 2).lineas.length - 1) * e.cuerpo * 1.3 / 2,
            e.cuerpo, e.cuerpo * 1.3, ctx.wrap(nd.label, cw - 16, e.cuerpo, 600, 2).lineas, T.tinta, 600, 'middle') + `</g>`;
      });
      svg += `<g data-e="-1" class="hub">` + d.circulo(cx, cyLocal, HR, { sombra: true })
        + d.blk(cx, cyLocal + e.cuerpo * 0.4 - (ctx.wrap(hub.label, HR * 1.5, e.cuerpo * 1.15, 700, 3).lineas.length - 1) * e.cuerpo * 1.5 / 2,
          e.cuerpo * 1.15, e.cuerpo * 1.5, ctx.wrap(hub.label, HR * 1.5, e.cuerpo * 1.15, 700, 3).lineas, '#FFF', 700, 'middle') + `</g>`;
      return { bloques: [{ svg: svg, alto: area }] };
    }
  };

  /* ============ 5. CICLO (mejora continua) ============ */
  L.ciclo = {
    nombre: 'Ciclo',
    desc: 'Circuito de mejora continua',
    cuerpo(datos, ctx) {
      const e = ctx.esc, W = ctx.ancho;
      const pasos = datos.nodos, n = pasos.length;
      if (ctx.compacto || n > 8) {
        // compacto: hub + lista numerada con los pasos (legible, sin anillo)
        const bloques = [];
        bloques.push(cajaHub(datos, ctx, W - e.pad * 2));
        pasos.forEach((p, i) => bloques.push(tarjeta(ctx, { titulo: p.label, icono: p.icono }, W - e.pad * 2, { numero: i + 1, icono: p.icono, editable: i })));
        return { bloques: bloques };
      }
      const area = Math.min(W - e.pad * 2, 660);
      const cx = W / 2, cy = area / 2, R = area / 2 - 46, CR = Math.min(40, R * 0.30), HR = CR * 1.28;
      let svg = '';
      pasos.forEach((p, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / n;
        const a1 = a + 0.42, a2 = (-Math.PI / 2 + ((i + 1) % n) * 2 * Math.PI / n) + (i === n - 1 ? 2 * Math.PI : 0) - 0.42;
        const p1 = { x: cx + R * Math.cos(a1), y: cy + R * Math.sin(a1) }, p2 = { x: cx + R * Math.cos(a2), y: cy + R * Math.sin(a2) };
        svg += `<path d="M${d.n2(p1.x)},${d.n2(p1.y)} A${d.n2(R)},${d.n2(R)} 0 0 1 ${d.n2(p2.x)},${d.n2(p2.y)}" fill="none" stroke="${T.verde}" stroke-width="2" opacity="0.45"/>`;
        const tx = -Math.sin(a2) * 7, ty = Math.cos(a2) * 7;
        svg += `<polygon points="${d.n2(p2.x + tx)},${d.n2(p2.y + ty)} ${d.n2(p2.x + tx * 0.15 + Math.cos(a2) * 3)},${d.n2(p2.y + ty * 0.15 + Math.sin(a2) * 3)} ${d.n2(p2.x + tx * 0.15 - Math.cos(a2) * 3)},${d.n2(p2.y + ty * 0.15 - Math.sin(a2) * 3)}" fill="${T.verde}"/>`;
      });
      pasos.forEach((p, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / n, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        svg += `<g data-e="${i}" class="paso">` + d.circulo(x, y, CR, { fill: T.blanco, borde: T.borde, sombra: true })
          + d.circulo(x, y - CR * 0.86, CR * 0.30, {})
          + d.txt(x, y - CR * 0.86 + CR * 0.11, CR * 0.42, String(i + 1), '#FFF', 700, 'middle')
          + (p.icono ? d.icono(p.icono, x - CR * 0.19, y - CR * 0.52, CR * 0.38, T.verdeOsc, ctx.LOGOS) : '')
          + d.blk(x, y + CR * 0.26, e.micro, e.micro * 1.28, ctx.wrap(p.label, CR * 1.72, e.micro, 600, 2).lineas, T.tinta, 600, 'middle') + `</g>`;
      });
      svg += `<g data-e="-1" class="hub">` + d.circulo(cx, cy, HR, { sombra: true })
        + d.blk(cx, cy + e.cuerpo * 0.4 - (ctx.wrap(datos.titulo, HR * 1.5, e.cuerpo, 700, 3).lineas.length - 1) * e.cuerpo * 1.35 / 2,
          e.cuerpo, e.cuerpo * 1.35, ctx.wrap(datos.titulo, HR * 1.5, e.cuerpo, 700, 3).lineas, '#FFF', 700, 'middle') + `</g>`;
      return { bloques: [{ svg: svg, alto: area }] };
    }
  };

  /* ============ 6. CONCEPTO (hub + categorías con subelementos) ============ */
  L.concepto = {
    nombre: 'Concepto',
    desc: 'Mapa de categorías y subelementos',
    cuerpo(datos, ctx) {
      const e = ctx.esc, W = ctx.ancho - e.pad * 2;
      const cols = ctx.ancho >= 1000 ? 2 : 1;
      const bloques = [];
      bloques.push(cajaHub(datos, ctx, W, datos.tituloCentral || datos.titulo));
      const cats = datos.nodos.map((c, i) => ({ titulo: c.label, icono: c.icono, chips: c.subs, color: c.color, __e: i }));
      const fr = rejilla(ctx, cats, cols, e.gap * 0.7, { primero: 0, fsTitulo: e.h3 });
      fr.forEach((f, i) => {
        if (i > 0) bloques.push({ svg: '', alto: e.gap * 0.35 });
        bloques.push(f);
      });
      return { bloques: bloques };
    }
  };

  /* ============ 7. INFORMES (página con intro + pasos + fuentes + notas) ============ */
  L.informe = {
    nombre: 'Informe',
    desc: 'Página de informe con bandas',
    cuerpo(datos, ctx) {
      const e = ctx.esc, W = ctx.ancho - e.pad * 2, bloques = [];
      const esq = (h, extra) => ({ svg: d.rect(0, 0, W, h, { fill: T.verdeClaro, rx: e.radio, borde: 'none' }) + d.rect(0, e.radio * 0.62, 4, Math.max(6, h - e.radio * 1.24), { fill: 'url(#gradAcento)', rx: 2, borde: 'none' }) + (extra || ''), alto: h });
      if (datos.intro) {
        const il = ctx.wrap(datos.intro, W - e.pad * 1.4, e.cuerpo, 400, 5);
        const h = e.pad * 0.8 + il.lineas.length * e.cuerpo * 1.4 + e.pad * 0.8;
        bloques.push(esq(h, d.blk(e.pad * 0.7, e.pad * 0.8 + e.cuerpo * 0.95, e.cuerpo, e.cuerpo * 1.4, il.lineas, T.tinta2, 400)));
      }
      const cols = ctx.ancho >= 900 ? 2 : 1;
      const pasos = datos.nodos.map((x, i) => ({ titulo: x.label, desc: x.desc, chips: x.subs, icono: x.icono, color: x.color, __e: i }));
      const fr = rejilla(ctx, pasos, cols, e.gap * 0.7, { primero: 0 });
      fr.forEach(f => bloques.push(f));
      if (datos.fuentes && datos.fuentes.length) {
        const fs2 = e.micro, r = flujoChips(ctx, datos.fuentes.map(f => f.label || f), 0, 0, W, fs2);
        const rotulo = 'FUENTES Y HERRAMIENTAS';
        const anchoRot = M2.anchoTexto(rotulo, fs2, 700, 0.9);
        const notaFuentes = 'se combinan en todas las etapas';
        const alLado = (anchoRot + 12 + M2.anchoTexto(notaFuentes, fs2, 400)) <= W;
        const cabFuentes = alLado
          ? d.txt(0, e.micro, fs2, rotulo, T.verdeOsc, 700, 'start', 0.9)
            + d.txt(anchoRot + 12, e.micro, fs2, notaFuentes, T.tinta2, 400)
          : d.txt(0, e.micro, fs2, rotulo, T.verdeOsc, 700, 'start', 0.9)
            + d.txt(0, e.micro * 2.3, fs2, notaFuentes, T.tinta2, 400);
        const yChips = alLado ? e.micro * 2.2 : e.micro * 3.5;
        bloques.push({
          svg: cabFuentes + M2.mover(r.svg, 0, yChips), alto: yChips + r.alto
        });
      }
      if (datos.notas && datos.notas.length) {
        const cols2 = ctx.ancho >= 900 ? 3 : 1;
        const gap = e.gap * 0.6, cw = (W - (cols2 - 1) * gap) / cols2;
        const trozos = datos.notas.map(n => ctx.wrap(n.texto || n, cw - e.pad * 1.2 - e.micro * 2.8, e.micro * 1.05, 500, 5));
        const lh = e.micro * 1.35;
        const altos = trozos.map(t => e.pad * 0.7 + e.micro * 1.9 + 3 + t.lineas.length * lh + e.pad * 0.7);
        const alto = Math.max.apply(null, altos);
        let svg = '';
        trozos.forEach((t, i) => {
          const x = i % cols2 * (cw + gap), yy = Math.floor(i / cols2) * (alto + gap);
          svg += d.rect(x, yy, cw, alto, { fill: T.verdeClaro, rx: e.radio, borde: 'none' });
          const icoTam = e.micro * 1.9, icoY = yy + e.pad * 0.7;
          svg += d.icono((datos.notas[i].icono) || 'chispa', x + e.pad * 0.6, icoY, icoTam, T.verdeOsc, ctx.LOGOS);
          svg += d.blk(x + e.pad * 0.6, icoY + icoTam + 4.5 + e.micro * 0.85, e.micro * 1.05, lh, t.lineas, T.tinta2, 500);
        });
        const filas = Math.ceil(trozos.length / cols2);
        bloques.push({ svg: svg, alto: filas * alto + (filas - 1) * gap });
      }
      return { bloques: bloques };
    }
  };

  /* ============ 8. RADIAL 3 NIVELES (anillos concéntricos) ============ */
  L.radial3 = {
    nombre: 'Radial 3 niveles',
    desc: 'Centro → nivel 1 → nivel 2',
    cuerpo(datos, ctx) {
      const e = ctx.esc, W = ctx.ancho;
      const cats = datos.nodos;
      if (ctx.compacto) return L.concepto.cuerpo(datos, ctx);
      const CH1 = e.cuerpo * 2.5, CW1 = Math.min(150, (W - 2 * e.pad) * 0.30), CH2 = e.micro * 2.4;
      const WUt = W - 2 * e.pad;
      // El radio se calcula para que los chips quepan EN HORIZONTAL y no se toquen entre grupos.
      // Si con 3 chips por categoría no cabe, se muestran 2; si tampoco, 1.
      const anchoChip = (x) => Math.max(CW1 * 0.6, M2.anchoTexto(x, e.micro, 500) + e.micro * 1.8);
      let R2 = 0, subsMostrar = 3, huecoMin = 8;
      for (let k = 3; k >= 1; k--) {
        let grupoMax = 0, chipMax = 0;
        cats.forEach(c => {
          const s = (c.subs || []).slice(0, k); let w = 0;
          s.forEach(x => { const a = anchoChip(x); w += a + huecoMin; chipMax = Math.max(chipMax, a); });
          grupoMax = Math.max(grupoMax, w);
        });
        const R2min = grupoMax * 1.12 * cats.length / (2 * Math.PI);
        const R2max = WUt / 2 - chipMax / 2 - 2;
        if (R2min <= R2max) { R2 = Math.min(R2max, Math.max(R2min, WUt * 0.40)); subsMostrar = k; break; }
        if (k === 1) { R2 = Math.max(40, R2max); subsMostrar = 1; }
      }
      const area = 2 * (R2 + CH2);
      const cx = W / 2, cy = area / 2;
      const HR = Math.max(40, Math.min(area * 0.115, R2 * 0.42));
      const R1 = HR + 8 + CH1 / 2 + Math.max(6, (R2 - CH2 / 2 - (HR + 8 + CH1 / 2)) / 2);
      let svg = '';
      svg += `<circle cx="${d.n2(cx)}" cy="${d.n2(cy)}" r="${d.n2(R1)}" fill="none" stroke="${T.borde}" stroke-width="1" stroke-dasharray="2 5"/>`;
      svg += `<circle cx="${d.n2(cx)}" cy="${d.n2(cy)}" r="${d.n2(R2)}" fill="none" stroke="${T.borde}" stroke-width="1" stroke-dasharray="2 5"/>`;
      const n = cats.length;
      const posC = cats.map((c, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return { a: a, x: cx + R1 * Math.cos(a), y: cy + R1 * Math.sin(a) }; });
      posC.forEach(p => {
        const ux = Math.cos(p.a), uy = Math.sin(p.a);
        svg += `<line x1="${d.n2(cx + ux * HR)}" y1="${d.n2(cy + uy * HR)}" x2="${d.n2(p.x - ux * CH1 / 2)}" y2="${d.n2(p.y - uy * CH1 / 2)}" stroke="${T.verdeOsc}" stroke-width="1" opacity="0.35"/>`;
        svg += `<circle cx="${d.n2(cx + ux * HR)}" cy="${d.n2(cy + uy * HR)}" r="2.4" fill="${T.verde}"/>`;
      });
      // nivel 2: chips agrupados bajo su categoría
      const maxSubs = Math.max.apply(null, cats.map(c => Math.min((c.subs || []).length, 3)));
      cats.forEach((c, i) => {
        const a = posC[i].a, subs = (c.subs || []).slice(0, subsMostrar);
        const anchos = subs.map(x => Math.max(CW1 * 0.6, M2.anchoTexto(x, e.micro, 500) + e.micro * 1.8));
        const angulares = anchos.map(w => (w + 8) / R2);          // ancho angular de cada chip
        const totalAng = angulares.reduce((s, v) => s + v, 0);
        subs.forEach((sub, j) => {
          // se centra el grupo en el ángulo de su categoría y se garantiza 8px entre chips
          const previo = angulares.slice(0, j).reduce((s, v) => s + v, 0);
          const aa = a + previo + angulares[j] / 2 - totalAng / 2;
          const px = cx + R2 * Math.cos(aa), py = cy + R2 * Math.sin(aa);
          const ancho = anchos[j];
          svg += `<line x1="${d.n2(posC[i].x)}" y1="${d.n2(posC[i].y)}" x2="${d.n2(px)}" y2="${d.n2(py)}" stroke="${T.verde}" stroke-width="0.9" opacity="0.3"/>`;
          svg += d.chip(px - ancho / 2, py - CH2 / 2, ancho, CH2, {});
          svg += d.txt(px, py + e.micro * 0.35, e.micro, sub, T.tinta2, 500, 'middle');
        });
      });
      cats.forEach((c, i) => {
        const x = posC[i].x - CW1 / 2, y = posC[i].y - CH1 / 2;
        svg += `<g data-e="${i}" class="cat">` + d.rect(x, y, CW1, CH1, { fill: 'url(#gradAcento)', borde: 'none', rx: e.radio * 0.7, sombra: true });
        const icT = e.micro * 1.9, txtX = x + 8 + (c.icono ? icT + 7 : 0), anchoLbl = CW1 - (txtX - x) - 8;
        if (c.icono) svg += d.icono(c.icono, x + 8, y + CH1 / 2 - icT / 2, icT, 'rgba(255,255,255,0.95)', ctx.LOGOS);
        const lbl = ctx.wrap(c.label, anchoLbl, e.micro * 1.05, 700, 2);
        svg += d.blk(txtX, y + CH1 / 2 - (lbl.lineas.length - 1) * e.micro * 1.35 / 2 + e.micro * 0.38,
          e.micro * 1.05, e.micro * 1.35, lbl.lineas, '#FFF', 700);
        svg += `</g>`;
      });
      svg += `<g data-e="-1" class="hub">` + d.circulo(cx, cy, HR, { sombra: true })
        + d.blk(cx, cy + e.cuerpo * 0.4 - (ctx.wrap(datos.tituloCentral || datos.titulo, HR * 1.7, e.cuerpo, 700, 4).lineas.length - 1) * e.cuerpo * 1.3 / 2,
          e.cuerpo, e.cuerpo * 1.3, ctx.wrap(datos.tituloCentral || datos.titulo, HR * 1.7, e.cuerpo, 700, 4).lineas, '#FFF', 700, 'middle') + `</g>`;
      return { bloques: [{ svg: svg, alto: area }] };
    }
  };

  /* ---------- auxiliares ---------- */
  function cajaHub(datos, ctx, W, texto) {
    const e = ctx.esc, u = ctx.tema;
    const t = ctx.wrap(texto || datos.titulo, W - e.pad * 1.6, e.h3, 700, 3);
    const h = e.pad * 0.9 + t.lineas.length * e.h3 * 1.25 + e.pad * 0.9;
    return {
      svg: `<g data-e="-1" class="hub">` + d.rect(0, 0, W, h, { fill: 'url(#gradAcento)', borde: 'none', rx: e.radio, sombra: true })
        + d.blk(W / 2, h / 2 - (t.lineas.length - 1) * e.h3 * 1.25 / 2 + e.h3 * 0.44, e.h3, e.h3 * 1.25, t.lineas, '#FFF', 700, 'middle') + `</g>`,
      alto: h
    };
  }
  function radialLista(datos, ctx) {
    const e = ctx.esc, W = ctx.ancho - e.pad * 2;
    const bloques = [cajaHub(datos, ctx, W, datos.nodos[0].label)];
    datos.nodos.slice(1).forEach((nd, i) => bloques.push(tarjeta(ctx, { titulo: nd.label, icono: nd.icono }, W, { numero: i + 1, icono: nd.icono, editable: i + 1 })));
    return { bloques: bloques };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = L;
})(typeof window !== 'undefined' ? window : globalThis);
