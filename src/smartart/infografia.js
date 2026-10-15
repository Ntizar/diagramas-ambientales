// LAYOUT INFOGRAFÍA — formato institucional apaisado, alta densidad jerarquizada
// Bandas: cabecera+intro → fuentes transversales → pasos (desc+bullets) → notas clave → cierre
(function (root) {
  'use strict';

  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
  const esc = s => String(s).replace(/[&<>"]/g, c => ESCAPES[c]);
  const FONT = "'Helvetica Neue', 'Segoe UI', Arial, sans-serif";
  const M26 = root.Motor2026 || (typeof require !== 'undefined' ? require('./motor.js') : null);
  const LOGOS = M26.LOGOS;

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
  function textoBloque(x, y, w, lineas, tam, lh, color, peso, anchor) {
    let o = '';
    lineas.forEach((l, i) => {
      o += `<text x="${x}" y="${y + i * lh}" text-anchor="${anchor || 'start'}" font-family="${FONT}" font-size="${tam}" font-weight="${peso || 400}" fill="${color}">${esc(l)}</text>`;
    });
    return o;
  }
  function logoIcon(tipo, color, x, y, size) {
    const d = LOGOS[tipo] || LOGOS.hoja;
    return `<g transform="translate(${x},${y}) scale(${size / 24})"><path d="${d}" fill="${color}"/></g>`;
  }
  function av(cfg, msg){ if (cfg && Array.isArray(cfg._avisos) && cfg._avisos.indexOf(msg) < 0) cfg._avisos.push(msg); }
  function hit(i, x, y, w, h) {
    return `<rect class="hit" data-i="${i}" x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent" style="cursor:pointer"/>`;
  }

  function render(cfg) {
    const A = { hi: '#1FA971', lo: '#0E7A50' };           // verde institucional
    const AZUL = '#132A3E';                                // tinta azul marino
    const AZUL2 = '#51677C';
    const CARD = '#FFFFFF', BORDE = 'rgba(19,42,62,0.12)';
    const TINTA = { bg: '#F7FAF7', cajaIntro: '#E9F4EC', chevron: '#B9CFC2' };
    const W = 2240;
    const MARGEN = 70;
    const GAP = 26;                                        // gap entre tarjetas de paso
    const N = cfg.pasos.length;
    const CW = Math.floor((W - 2 * MARGEN - (N - 1) * GAP) / N);
    const CH = 470;
    let y = 0;

    // ---- alturas ----
    const introH = 130;
    const fuentesH = 120;
    const notasN = (cfg.notas || []).length;
    const notasH = notasN ? 100 : 0;
    const cierreH = 96;
    const H = 60 + introH + 24 + fuentesH + 24 + CH + 24 + notasH + 24 + cierreH + 60;

    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    s += `<defs>
      <linearGradient id="cierre" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${A.lo}"/><stop offset="1" stop-color="${A.hi}"/>
      </linearGradient>
      <linearGradient id="numGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${A.hi}"/><stop offset="1" stop-color="${A.lo}"/>
      </linearGradient>
    </defs>`;
    s += `<rect width="${W}" height="${H}" fill="${TINTA.bg}"/>`;

    // ================= CABECERA: título+subtítulo (izq) + intro (der) =================
    y = 60;
    s += `<text x="${MARGEN}" y="${y + 44}" font-family="${FONT}" font-size="38" font-weight="750" fill="${AZUL}">${esc(cfg.titulo || '')}</text>`;
    if (cfg.subtitulo) s += `<text x="${MARGEN}" y="${y + 82}" font-family="${FONT}" font-size="19" font-weight="500" fill="${A.lo}">${esc(cfg.subtitulo)}</text>`;
    if (cfg.intro) {
      const BW = 760, BX = W - MARGEN - BW;
      const lineas = wrap(cfg.intro, Math.floor((BW - 44) / 8.2));
      s += `<rect x="${BX}" y="${y}" width="${BW}" height="${introH}" rx="14" fill="${TINTA.cajaIntro}"/>`;
      s += textoBloque(BX + 22, y + 34, BW, lineas, 14.5, 22, AZUL2, 450);
    }
    s += hit(-1, 0, 0, W, 60 + introH);  // cabecera editable (título + intro)

    // ================= BANDA DE FUENTES TRANSVERSALES =================
    y += introH + 24;
    const fuentes = cfg.fuentes || [];
    if (fuentes.length) {
      const FW = Math.floor((W - 2 * MARGEN - 260) / fuentes.length);
      s += textoBloque(MARGEN, y + 26, 300, ['FUENTES Y', 'HERRAMIENTAS'], 13, 20, A.lo, 750);
      // nota con wrap en 3 líneas dentro de su columna
      if (wrap(cfg.fuentesNota || '', 24).length > 4) av(cfg, 'La nota de fuentes se ha recortado a 4 lineas');
      wrap(cfg.fuentesNota || 'Combinadas en todas las etapas', 24).slice(0, 4).forEach((l, i) => {
        s += `<text x="${MARGEN}" y="${y + 56 + i * 17}" font-family="${FONT}" font-size="11" font-style="italic" fill="${AZUL2}">${esc(l)}</text>`;
      });
      fuentes.forEach((f, i) => {
        const fx = MARGEN + 220 + i * FW;
        s += `<rect x="${fx}" y="${y + 8}" width="${FW - 18}" height="96" rx="12" fill="${CARD}" stroke="${BORDE}" stroke-width="1"/>`;
        s += logoIcon(f.icono, A.lo, fx + 16, y + 30, 30);
        s += textoBloque(fx + 58, y + 42, FW - 80, wrap(f.label, Math.floor((FW - 90) / 8.4)), 13.5, 18, AZUL, 650);
      });
    }

    // ================= PASOS =================
    y += fuentesH + 24;
    const pasosY = y;
    cfg.pasos.forEach((p, i) => {
      const x = MARGEN + i * (CW + GAP);
      const last = i === N - 1;
      // tarjeta
      s += `<rect x="${x}" y="${pasosY}" width="${CW}" height="${CH}" rx="18" fill="${CARD}" stroke="${BORDE}" stroke-width="1.2"/>`;
      // barra superior de acento en la primera y última
      if (i === 0 || last) s += `<rect x="${x + 18}" y="${pasosY}" width="${CW - 36}" height="6" rx="3" fill="url(#numGrad)"/>`;
      // número en círculo
      s += `<circle cx="${x + 42}" cy="${pasosY + 56}" r="24" fill="url(#numGrad)"/>`;
      s += `<text x="${x + 42}" y="${pasosY + 57}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-size="19" font-weight="750" fill="#fff">${i + 1}</text>`;
      // título (hasta 2 líneas)
      const maxT = Math.floor((CW - 92) / 9.4);
      s += textoBloque(x + 78, pasosY + 48, CW, wrap(p.titulo, maxT).slice(0, 2), 16.5, 21, AZUL, 720);
      // icono del paso
      if (p.icono) s += logoIcon(p.icono, A.lo, x + 30, pasosY + 108, 34);
      // descripción (después del icono)
      const maxD = Math.floor((CW - 56) / 7.3);
      const _d = wrap(p.desc || '', maxD);
      if (_d.length > 6) av(cfg, 'Paso ' + (i + 1) + ': la descripcion se ha recortado a 6 lineas');
      const desc = _d.slice(0, 6);
      s += textoBloque(x + 28, pasosY + 190, CW, desc, 12.5, 18.5, AZUL2, 450);
      // separador + herramientas — ALTURA FIJA en todas las tarjetas (alineadas)
      const hy = pasosY + 190 + 6 * 18.5 + 22;
      if (p.bullets && p.bullets.length) {
        s += `<line x1="${x + 28}" y1="${hy - 10}" x2="${x + CW - 28}" y2="${hy - 10}" stroke="${BORDE}" stroke-width="1"/>`;
        s += textoBloque(x + 28, hy + 18, CW, ['HERRAMIENTAS / INFORMACIÓN'], 10.5, 16, A.lo, 750);
        let by = hy + 44;
        if ((p.bullets || []).length > 3) av(cfg, 'Paso ' + (i + 1) + ': solo caben 3 sub-elementos');
        (p.bullets || []).slice(0, 3).forEach(b => {
          const bl = wrap(b, Math.floor((CW - 62) / 6.9)).slice(0, 2);
          s += `<circle cx="${x + 34}" cy="${by - 5}" r="3" fill="${A.hi}"/>`;
          s += textoBloque(x + 48, by, CW, bl, 11.5, 17, AZUL2, 500);
          by += bl.length * 17 + 8;
        });
      }
      // chevron hacia la siguiente
      if (!last) {
        const cxh = x + CW + GAP / 2, cyh = pasosY + CH / 2;
        s += `<path d="M${cxh - 7},${cyh - 12} L${cxh + 7},${cyh} L${cxh - 7},${cyh + 12}" fill="none" stroke="${TINTA.chevron}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      s += hit(i, x, pasosY, CW, CH);
    });

    // ================= NOTAS CLAVE =================
    y = pasosY + CH + 24;
    if (notasN) {
      const NW = Math.floor((W - 2 * MARGEN - (notasN - 1) * GAP) / notasN);
      (cfg.notas || []).forEach((n, i) => {
        const nx = MARGEN + i * (NW + GAP);
        s += `<rect x="${nx}" y="${y}" width="${NW}" height="${notasH}" rx="14" fill="${TINTA.cajaIntro}" opacity="0.85"/>`;
        s += logoIcon(n.icono || 'chispa', A.lo, nx + 22, y + 26, 26);
        s += textoBloque(nx + 62, y + 36, NW, wrap(n.texto, Math.floor((NW - 90) / 7.6)), 12.5, 18, AZUL2, 500);
      });
    }

    // ================= CIERRE =================
    y += notasH + 24;
    s += `<rect x="${MARGEN}" y="${y}" width="${W - 2 * MARGEN}" height="${cierreH}" rx="18" fill="url(#cierre)"/>`;
    s += logoIcon('hoja', '#FFFFFF', MARGEN + 34, y + cierreH / 2 - 19, 38);
    s += `<text x="${MARGEN + 96}" y="${y + cierreH / 2}" dominant-baseline="middle" font-family="${FONT}" font-size="23" font-weight="700" fill="#FFFFFF">${esc(cfg.cierre || '')}</text>`;

    // pie sin firma (la tool no mete atribución automática)
    s += '</svg>';
    return s;
  }

  const LayoutInfografia = { render };
  if (typeof module !== 'undefined' && module.exports) module.exports = LayoutInfografia;
  else root.LayoutInfografia = LayoutInfografia;
})(typeof window !== 'undefined' ? window : globalThis);
