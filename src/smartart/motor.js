// ============================================================
// MOTOR 2026 — estética premium (dark + light)
// Dark: fondo profundo con glows, glass cards, números fantasma,
//       conectores finos, UN acento esmeralda.
// Light: papel cálido, hairlines, sombra suave, tinta rica.
// ============================================================
(function (root) {
  'use strict';

  const ACCENT = {
    esmeralda: { hi: '#34D399', lo: '#059669', glow: 'rgba(52,211,153,0.16)' },
    teal:      { hi: '#2DD4BF', lo: '#0D9488', glow: 'rgba(45,212,191,0.16)' },
    lima:      { hi: '#A3E635', lo: '#65A30D', glow: 'rgba(163,230,53,0.13)' },
    ambar:     { hi: '#FBBF24', lo: '#D97706', glow: 'rgba(251,191,36,0.13)' },
    cielo:     { hi: '#38BDF8', lo: '#0284C7', glow: 'rgba(56,189,248,0.15)' }
  };

  const LOGOS = {
    hoja: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zm-1.7-2.2c.5-.3 1.1-.8 1.7-1.4-2 .4-4.2.2-6.3-.6 1.2 1.2 2.9 1.9 4.6 2z',
    gota: 'M12 2C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-13z',
    montana: 'M3 20h18L14 7l-3.5 6L8 9l-5 11z',
    arbol: 'M12 2L6 10h3l-4 6h5v4h4v-4h5l-4-6h3L12 2z',
    onda: 'M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2v3c-2.5 0-2.5-2-5-2s-2.5 2-5 2-2.5-2-5-2-2.5 2-5 2v-3zm0-6c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2v3c-2.5 0-2.5-2-5-2s-2.5 2-5 2-2.5-2-5-2-2.5 2-5 2V6zm0 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2v3c-2.5 0-2.5-2-5-2s-2.5 2-5 2-2.5-2-5-2-2.5 2-5 2v-3z',
    pajaro: 'M21 6c-1 0-2 .5-2.5 1.2C17.8 6.5 17 6 16 6c-1.7 0-3 1.3-3 3 0 .3 0 .5.1.8C9 9.5 5.5 7.5 3.5 4.5c-1 2-.5 4.5 1.2 5.8-.7 0-1.3-.2-1.7-.5 0 1.8 1.3 3.5 3.2 3.9-.5.2-1.1.2-1.7.1.5 1.5 1.9 2.5 3.5 2.6-1.3 1-3 1.6-4.7 1.6H2c1.7 1.1 3.8 1.7 6 1.7 7.2 0 11.2-6 11.2-11.2v-.5c.8-.6 1.4-1.3 1.8-2z',
    escudo: 'M12 2L4 5v6c0 5.5 3.4 9.7 8 11 4.6-1.3 8-5.5 8-11V5l-8-3zm-2 14l-4-4 1.4-1.4L10 13.2l6.6-6.6L18 8l-8 8z',
    chispa: 'M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z',
    lupa: 'M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z',
    mapa: 'M20.5 3l-.2 0-4.8 1.9L9.5 3 3.9 4.9c-.5.2-.9.6-.9 1.1v15.1c0 .5.4.9.9.9l.2-.1 4.8-1.9 6 1.9 5.6-1.9c.5-.2.9-.6.9-1.1V3.9c0-.5-.4-.9-.9-.9zM15 19.9l-6-1.9V4.1l6 1.9v13.9z',
    documento: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    barras: 'M4 21h16v-2H4v2zM6 17h3V8H6v9zm5.5 0h3V4h-3v13zM17 17h3v-6h-3v6z',
    portapapeles: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm-6 2h4V4h-4v2zm-2 6h8v2H8v-2zm0 4h6v2H8v-2z',
    pin: 'M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z',
    nube: 'M19.4 10a7 7 0 0 0-13.1-2A4.5 4.5 0 0 0 6.5 17h12.4a3.5 3.5 0 0 0 .5-7z',
    bd: 'M12 2C7.6 2 4 3.8 4 6v12c0 2.2 3.6 4 8 4s8-1.8 8-4V6c0-2.2-3.6-4-8-4zm0 2c3.9 0 6 1.3 6 2s-2.1 2-6 2-6-1.3-6-2 2.1-2 6-2zm6 14c0 .7-2.1 2-6 2s-6-1.3-6-2v-3.1c1.5.8 3.7 1.1 6 1.1s4.5-.3 6-1.1V18zm0-5c0 .7-2.1 2-6 2s-6-1.3-6-2v-3.1c1.5.8 3.7 1.1 6 1.1s4.5-.3 6-1.1V13z',
    bombilla: 'M9 21h6v-1H9v1zm3-19a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z',
    camara: 'M9 3L7.5 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    micro: 'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2z',
    casa: 'M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3l9-8z',
    ojo: 'M12 5C6.5 5 2.3 9.1 1 12c1.3 2.9 5.5 7 11 7s9.7-4.1 11-7c-1.3-2.9-5.5-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'
  };

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
  const esc = s => String(s).replace(/[&<>"]/g, c => ESCAPES[c]);
  const FONT = "'Helvetica Neue', 'Segoe UI', Arial, sans-serif";
  function av(cfg, msg){ if (cfg && Array.isArray(cfg._avisos) && cfg._avisos.indexOf(msg) < 0) cfg._avisos.push(msg); }

  // utilidades editor: hit zones + color por nodo
  function luminancia(hex) {
    const n = parseInt(hex.slice(1), 16);
    const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
  }
  function textoPara(hex) { return luminancia(hex) > 0.45 ? '#0B1220' : '#FFFFFF'; }
  function hit(i, x, y, w, h) {
    return `<rect class="hit" data-i="${i}" x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent" style="cursor:pointer"/>`;
  }
  function hitC(i, cx, cy, r) {
    return `<circle class="hit" data-i="${i}" cx="${cx}" cy="${cy}" r="${r}" fill="transparent" style="cursor:pointer"/>`;
  }

  function wrap(texto, maxChars) {
    const palabras = String(texto).split(/\s+/);
    const lineas = []; let linea = '';
    for (const p of palabras) {
      if ((linea + ' ' + p).trim().length > maxChars && linea) { lineas.push(linea); linea = p; }
      else linea = (linea + ' ' + p).trim();
    }
    if (linea) lineas.push(linea);
    return lineas;
  }

  // -------- temas --------
  // -------- tema (acepta objeto de acento ya resuelto) --------
  function tema(style, accentKey) {
    const A = (typeof accentKey === 'object' && accentKey !== null) ? accentKey : (ACCENT[accentKey] || ACCENT.esmeralda);
    if (style === 'light') {
      return {
        A, oscuro: false,
        bg1: '#FBFBF9', bg2: '#F3F4F0',
        ink: '#101418', ink2: '#5B6572',
        card: '#FFFFFF', cardBorder: 'rgba(16,20,24,0.09)',
        cardText: '#101418', cardText2: '#5B6572',
        hairline: 'rgba(16,20,24,0.10)',
        glowA: 'rgba(5,150,105,0.05)', glowB: 'rgba(45,212,191,0.05)',
        fillHi: A.lo, fillHiText: '#FFFFFF',
        connector: 'rgba(16,20,24,0.22)', ghost: 'rgba(16,20,24,0.05)',
        chipBg: 'rgba(5,150,105,0.10)', chipText: A.lo
      };
    }
    return {
      A, oscuro: true,
      bg1: '#0B1220', bg2: '#0F1A2E',
      ink: '#F2F6FB', ink2: '#8B98AB',
      card: 'rgba(255,255,255,0.045)', cardBorder: 'rgba(255,255,255,0.10)',
      cardText: '#E8EEF6', cardText2: '#9AA7B8',
      hairline: 'rgba(255,255,255,0.14)',
      glowA: A.glow, glowB: 'rgba(56,189,248,0.07)',
      fillHi: `url(#accFill)`, fillHiText: '#06281C',
      connector: 'rgba(255,255,255,0.20)', ghost: 'rgba(255,255,255,0.05)',
      chipBg: 'rgba(255,255,255,0.07)', chipText: A.hi
    };
  }

  function defs(T, uid) {
    let s = `<defs>
      <linearGradient id="acc${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${T.A.hi}"/><stop offset="1" stop-color="${T.A.lo}"/>
      </linearGradient>
      <linearGradient id="bg${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${T.bg1}"/><stop offset="1" stop-color="${T.bg2}"/>
      </linearGradient>
      <radialGradient id="glowA${uid}" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="${T.glowA}"/><stop offset="1" stop-color="${T.glowA}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glowB${uid}" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="${T.glowB}"/><stop offset="1" stop-color="${T.glowB}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="accFill${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${T.A.hi}"/><stop offset="1" stop-color="${T.A.lo}"/>
      </linearGradient>
    </defs>`;
    return s;
  }

  function fondo(W, H, T, uid) {
    let s = `<rect width="${W}" height="${H}" fill="url(#bg${uid})"/>`;
    s += `<circle cx="${W * 0.85}" cy="${H * 0.12}" r="${W * 0.42}" fill="url(#glowA${uid})"/>`;
    s += `<circle cx="${W * 0.08}" cy="${H * 0.9}" r="${W * 0.38}" fill="url(#glowB${uid})"/>`;
    return s;
  }

  function logoSVG(tipo, color, x, y, size) {
    const d = LOGOS[tipo] || LOGOS.hoja;
    return `<g transform="translate(${x},${y}) scale(${size / 24})"><path d="${d}" fill="${color}"/></g>`;
  }

  function cabecera(W, cfg, T) {
    const A = T.A;
    let s = '';
    // chip del logo con borde de acento sutil
    const L = 54, x = 44, y = 40;
    s += `<rect x="${x}" y="${y}" width="${L}" height="${L}" rx="15" fill="${T.chipBg}" stroke="${T.hairline}" stroke-width="1"/>`;
    s += logoSVG(cfg.logo || 'hoja', A.hi, x + 12, y + 12, 30);
    // kicker + título
    s += `<text x="${x + L + 18}" y="${y + 15}" font-family="${FONT}" font-size="11" font-weight="700" letter-spacing="3.2" fill="${A.hi}">${esc((cfg.kicker || 'DIAGRAMA').toUpperCase())}</text>`;
    const maxC = Math.floor((W - (x + L + 18) - 60) / 14);
    const _tl = wrap(cfg.titulo || '', maxC);
    if (_tl.length > 2) av(cfg, 'El titulo no cabe entero: se ha recortado a 2 lineas');
    const lineas = _tl.slice(0, 2);
    lineas.forEach((l, i) => {
      s += `<text x="${x + L + 18}" y="${y + 42 + i * 26}" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="-0.3" fill="${T.ink}">${esc(l)}</text>`;
    });
    s += hit(-1, 0, 0, W, y + L + 34);  // tocar la cabecera abre el editor del documento
    return s;
  }

  function pie() { return ''; }

  // conector fino: línea + punto de origen + flecha pequeña
  function conector(x1, y1, x2, y2, T) {
    const A = T.A;
    let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2 - 8}" stroke="${T.connector}" stroke-width="1.5"/>`;
    s += `<circle cx="${x1}" cy="${y1}" r="3.5" fill="${A.hi}"/>`;
    s += `<polygon points="${x2},${y2} ${x2 - 5},${y2 - 8} ${x2 + 5},${y2 - 8}" fill="${A.hi}"/>`;
    return s;
  }

  // número fantasma gigante detrás de la card (con margen de seguridad)
  function fantasma(x, y, num, T) {
    return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="86" font-weight="800" fill="${T.ghost}" text-anchor="middle">${num}</text>`;
  }

  // -------- LAYOUT VERTICAL --------
  function lVertical(cfg, T, uid) {
    const W = 780;
    const AW = cfg.anchoNodo || 460;
    const GAP = 40;
    const TOP = 170, BOTTOM = 120;
    let y = TOP;
    const items = cfg.nodos.map(n => {
      const lineas = wrap(n.label, Math.floor((AW - 96) / 8.6));
      const h = Math.max(58, lineas.length * 22 + 30);
      const it = { n, lineas, y, h };
      y += h + GAP;
      return it;
    });
    const H = y - GAP + BOTTOM;
    const cx = W / 2;

    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    s += defs(T, uid) + fondo(W, H, T, uid) + cabecera(W, cfg, T);

    items.forEach((it, i) => {
      const x = cx - AW / 2;
      const esPrimero = i === 0, esUltimo = i === items.length - 1;
      const destacada = esPrimero || esUltimo;
      // número fantasma a la izquierda (dentro de lienzo: nunca a menos de 70px del borde)
      const gx = Math.max(cx - AW / 2 - 52, 70);
      s += fantasma(gx, it.y + it.h / 2 + 26, i + 1, T);
      const cp = it.n.color;
      if (destacada || cp) {
        s += `<rect x="${x}" y="${it.y}" width="${AW}" height="${it.h}" rx="16" fill="${cp || `url(#accFill${uid})`}"/>`;
        s += textoCard(cx, it.y + it.h / 2, AW - 40, it.lineas, cp ? textoPara(cp) : T.fillHiText, 15, 650);
      } else {
        s += `<rect x="${x}" y="${it.y}" width="${AW}" height="${it.h}" rx="16" fill="${T.card}" stroke="${T.cardBorder}" stroke-width="1"/>`;
        s += `<rect x="${x}" y="${it.y + 14}" width="3.5" height="${it.h - 28}" rx="1.75" fill="${T.A.hi}" opacity="0.85"/>`;
        s += textoCard(cx + 8, it.y + it.h / 2, AW - 40, it.lineas, T.cardText, 14.5, 550);
      }
      s += hit(i, x, it.y, AW, it.h);
      if (!esUltimo) s += conector(cx, it.y + it.h + 3, cx, items[i + 1].y - 2, T);
    });

    s += pie(W, H, T) + '</svg>';
    return s;

    function textoCard(x, y, w, lineas, color, tam, peso) {
      const lh = tam + 6;
      const h0 = y - (lineas.length - 1) * lh / 2;
      let o = '';
      lineas.forEach((l, i) => {
        o += `<text x="${x}" y="${h0 + i * lh}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-size="${tam}" font-weight="${peso}" letter-spacing="-0.1" fill="${color}">${esc(l)}</text>`;
      });
      return o;
    }
  }

  // -------- LAYOUT CARDS (grid con acento en una) --------
  function lCards(cfg, T, uid) {
    const nodos = cfg.nodos;
    const COLS = Math.min(3, nodos.length);
    const FILAS = Math.ceil(nodos.length / COLS);
    const CW = 350, CH = 190, GX = 30, GY = 30;
    const W = 60 + COLS * CW + (COLS - 1) * GX + 60;
    const H = 150 + FILAS * CH + (FILAS - 1) * GY + 110;
    const destacada = cfg.destacada != null ? cfg.destacada : 0;

    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    s += defs(T, uid) + fondo(W, H, T, uid) + cabecera(W, cfg, T);

    nodos.forEach((nd, i) => {
      const col = i % COLS, fila = Math.floor(i / COLS);
      const x = 60 + col * (CW + GX);
      const y = 150 + fila * (CH + GY);
      const esAcc = i === destacada;
      const cp = nd.color;
      s += fantasma(x + CW - 44, y + CH - 18, String(i + 1).padStart(2, '0'), T);
      if (esAcc || cp) {
        s += `<rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="20" fill="${cp || `url(#accFill${uid})`}"/>`;
        const tc = cp ? textoPara(cp) : T.fillHiText;
        s += `<text x="${x + 28}" y="${y + 52}" font-family="${FONT}" font-size="12" font-weight="700" letter-spacing="2.5" fill="${tc}" opacity="0.75">${String(i + 1).padStart(2, '0')}</text>`;
        s += textoTarjeta(x, y, tc, true);
      } else {
        s += `<rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="20" fill="${T.card}" stroke="${T.cardBorder}" stroke-width="1"/>`;
        s += `<text x="${x + 28}" y="${y + 52}" font-family="${FONT}" font-size="12" font-weight="700" letter-spacing="2.5" fill="${T.A.hi}">${String(i + 1).padStart(2, '0')}</text>`;
        s += textoTarjeta(x, y, T.cardText, false);
      }
      s += hit(i, x, y, CW, CH);
      function textoTarjeta(x0, y0, color, acc) {
        const _l = wrap(nd.label, Math.floor((CW - 56) / 8));
        if (_l.length > 4) av(cfg, 'Tarjeta ' + (i + 1) + ': el texto se ha recortado a 4 lineas');
        const lineas = _l.slice(0, 4);
        const tam = 15.5, lh = 23;
        const yTxt = y0 + 100 - (lineas.length - 1) * lh / 2;
        let o = '';
        lineas.forEach((l, j) => {
          o += `<text x="${x0 + 28}" y="${yTxt + j * lh}" font-family="${FONT}" font-size="${tam}" font-weight="600" letter-spacing="-0.2" fill="${color}">${esc(l)}</text>`;
        });
        return o;
      }
    });

    s += pie(W, H, T) + '</svg>';
    return s;
  }

  // -------- LAYOUT RADIAL --------
  function lRadial(cfg, T, uid) {
    const W = 980, H = 960;
    const cx = W / 2, cy = 170 + (H - 250) / 2;
    const R = 310;
    const hub = cfg.nodos[0], sat = cfg.nodos.slice(1);
    const n = sat.length, SW = 250, SH = 100;

    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    s += defs(T, uid) + fondo(W, H, T, uid) + cabecera(W, cfg, T);

    // órbita
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${T.hairline}" stroke-width="1.5" stroke-dasharray="1 10" stroke-linecap="round"/>`;

    const pos = sat.map((nd, i) => {
      const ang = -Math.PI / 2 + i * 2 * Math.PI / n;
      return { px: cx + R * Math.cos(ang), py: cy + R * Math.sin(ang) };
    });
    // conectores finos con punto
    pos.forEach(({ px, py }) => {
      const ux = (px - cx) / R, uy = (py - cy) / R;
      s += `<line x1="${cx + ux * 128}" y1="${cy + uy * 128}" x2="${px - ux * (SW / 2 + 6)}" y2="${py - uy * (SH / 2 + 4)}" stroke="${T.connector}" stroke-width="1.5"/>`;
      s += `<circle cx="${cx + ux * 128}" cy="${cy + uy * 128}" r="3.5" fill="${T.A.hi}"/>`;
    });
    // satélites (i+1: el 0 es el hub)
    sat.forEach((nd, i) => {
      const { px, py } = pos[i];
      const x = px - SW / 2, y = py - SH / 2;
      s += `<rect x="${x}" y="${y}" width="${SW}" height="${SH}" rx="18" fill="${T.card}" stroke="${T.cardBorder}" stroke-width="1"/>`;
      const _l = wrap(nd.label, Math.floor((SW - 52) / 7.6));
      if (_l.length > 3) av(cfg, 'Satelite ' + (i + 1) + ': el texto se ha recortado a 3 lineas');
      const lineas = _l.slice(0, 3);
      const lh = 19, y0 = py - (lineas.length - 1) * lh / 2;
      lineas.forEach((l, j) => {
        s += `<text x="${px}" y="${y0 + j * lh}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-size="13" font-weight="550" fill="${T.cardText}">${esc(l)}</text>`;
      });
      s += hit(i + 1, x, y, SW, SH);
    });
    // hub
    const HR = 122;
    s += `<circle cx="${cx + 3}" cy="${cy + 4}" r="${HR}" fill="${T.oscuro ? '#000' : '#101418'}" opacity="${T.oscuro ? 0.35 : 0.10}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${HR}" fill="url(#accFill${uid})"/>`;
    const _h = wrap(hub.label, 18);
    if (_h.length > 3) av(cfg, 'El centro del radial se ha recortado a 3 lineas');
    const hl = _h.slice(0, 3);
    const hlh = 22, hy0 = cy - (hl.length - 1) * hlh / 2;
    hl.forEach((l, j) => {
      s += `<text x="${cx}" y="${hy0 + j * hlh}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-size="17" font-weight="700" fill="${T.fillHiText}">${esc(l)}</text>`;
    });
    s += hitC(0, cx, cy, HR);

    s += pie(W, H, T) + '</svg>';
    return s;
  }

  // -------- LAYOUT HORIZONTAL --------
  function lHorizontal(cfg, T, uid) {
    const nodos = cfg.nodos, n = nodos.length;
    const BW = 268, BH = 150, GAPX = 58;
    const W = 70 + n * BW + (n - 1) * GAPX + 70;
    const H = 560;
    const cy = 330;

    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    s += defs(T, uid) + fondo(W, H, T, uid) + cabecera(W, cfg, T);

    nodos.forEach((nd, i) => {
      const x = 70 + i * (BW + GAPX);
      const esUltimo = i === n - 1;
      const cpH = nd.color;
      // número fantasma sobre la card
      s += `<text x="${x + BW / 2}" y="${cy - BH / 2 - 18}" text-anchor="middle" font-family="${FONT}" font-size="72" font-weight="800" fill="${T.ghost}">${i + 1}</text>`;
      if (esUltimo || cpH) {
        s += `<rect x="${x}" y="${cy - BH / 2}" width="${BW}" height="${BH}" rx="20" fill="${cpH || `url(#accFill${uid})`}"/>`;
        s += texto(nd, cpH ? textoPara(cpH) : T.fillHiText);
      } else {
        s += `<rect x="${x}" y="${cy - BH / 2}" width="${BW}" height="${BH}" rx="20" fill="${T.card}" stroke="${T.cardBorder}" stroke-width="1"/>`;
        s += texto(nd, T.cardText);
      }
      s += hit(i, x, cy - BH / 2, BW, BH);
      function texto(nd, color) {
        const _l = wrap(nd.label, Math.floor((BW - 48) / 8));
        if (_l.length > 4) av(cfg, 'Nodo ' + (i + 1) + ': el texto se ha recortado a 4 lineas');
        const lineas = _l.slice(0, 4);
        const lh = 21, y0 = cy - (lineas.length - 1) * lh / 2;
        let o = '';
        lineas.forEach((l, j) => {
          o += `<text x="${x + BW / 2}" y="${y0 + j * lh}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-size="14.5" font-weight="600" letter-spacing="-0.2" fill="${color}">${esc(l)}</text>`;
        });
        return o;
      }
      if (!esUltimo) {
        const x1 = x + BW + 6, x2 = x + BW + GAPX - 6;
        s += `<line x1="${x1}" y1="${cy}" x2="${x2 - 8}" y2="${cy}" stroke="${T.connector}" stroke-width="1.5"/>`;
        s += `<circle cx="${x1}" cy="${cy}" r="3.5" fill="${T.A.hi}"/>`;
        s += `<polygon points="${x2},${cy} ${x2 - 8},${cy - 5} ${x2 - 8},${cy + 5}" fill="${T.A.hi}"/>`;
      }
    });

    s += pie(W, H, T) + '</svg>';
    return s;
  }

  // -------- DISPATCH --------
  function render(cfg) {
    // color personalizable: cfg.color = '#RRGGBB' o nombre del acento
    let A;
    if (cfg.color && cfg.color.startsWith('#')) {
      A = { hi: cfg.color, lo: oscurecer(cfg.color, 0.62), glow: hexGlow(cfg.color) };
    } else {
      A = ACCENT[cfg.acento || 'esmeralda'];
    }
    const T = tema(cfg.style || 'dark', A);
    const uid = Math.abs(hash((cfg.titulo || '') + (cfg.nodos || []).length)) % 9973;
    switch (cfg.layout) {
      case 'cards': return lCards(cfg, T, uid);
      case 'radial': return lRadial(cfg, T, uid);
      case 'horizontal': return lHorizontal(cfg, T, uid);
      default: return lVertical(cfg, T, uid);
    }
  }
  function oscurecer(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
  }
  function hexGlow(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r},${g},${b},0.16)`;
  }
  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return h;
  }

  const Motor2026 = { render, ACCENT, LOGOS };
  if (typeof module !== 'undefined' && module.exports) module.exports = Motor2026;
  else root.Motor2026 = Motor2026;
})(typeof window !== 'undefined' ? window : globalThis);
