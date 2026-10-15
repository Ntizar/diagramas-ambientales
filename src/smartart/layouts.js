// LAYOUTS CICLO (proceso circular de mejora continua) y CONCEPTO (mapa de herramientas 2 niveles)
(function (root) {
  'use strict';
  const M26 = typeof require !== 'undefined' ? require('./motor.js') : root.Motor2026;
  const LOGOS = M26.LOGOS;
  const FONT = "'Helvetica Neue', 'Segoe UI', Arial, sans-serif";
  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
  const esc = s => String(s).replace(/[&<>"]/g, c => ESCAPES[c]);

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
  function logoIcon(tipo, color, x, y, size) {
    const d = LOGOS[tipo] || LOGOS.hoja;
    return `<g transform="translate(${x},${y}) scale(${size / 24})"><path d="${d}" fill="${color}"/></g>`;
  }
  function hit(i, x, y, w, h) {
    return `<rect class="hit" data-i="${i}" x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent" style="cursor:pointer"/>`;
  }
  function av(cfg, msg){ if (cfg && Array.isArray(cfg._avisos) && cfg._avisos.indexOf(msg) < 0) cfg._avisos.push(msg); }
  function hitC(i, cx, cy, r) {
    return `<circle class="hit" data-i="${i}" cx="${cx}" cy="${cy}" r="${r}" fill="transparent" style="cursor:pointer"/>`;
  }
  function multi(tx, y, w, lineas, tam, lh, color, peso, anchor) {
    let o = '';
    lineas.forEach((l, i) => {
      o += `<text x="${tx}" y="${y + i * lh}" text-anchor="${anchor || 'middle'}" font-family="${FONT}" font-size="${tam}" font-weight="${peso || 500}" fill="${color}">${esc(l)}</text>`;
    });
    return o;
  }

  // arco con punta de flecha (para el ciclo, sentido horario)
  function arcoFlecha(cx, cy, r, a1, a2, color, grosor) {
    const p1 = { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) };
    const p2 = { x: cx + r * Math.cos(a2), y: cy + r * Math.sin(a2) };
    const large = (a2 - a1) > Math.PI ? 1 : 0;
    const s = `<path d="M${p1.x},${p1.y} A${r},${r} 0 ${large} 1 ${p2.x},${p2.y}" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round"/>`;
    // punta tangente en p2
    const tx = -Math.sin(a2), ty = Math.cos(a2); // tangente horaria
    const L = 13;
    const bx = p2.x + tx * L, by = p2.y + ty * L;
    const nx = Math.cos(a2) * 5.5, ny = Math.sin(a2) * 5.5;
    const tri = `<polygon points="${p2.x + tx * L * 1.35},${p2.y + ty * L * 1.35} ${bx + nx},${by + ny} ${bx - nx},${by - ny}" fill="${color}"/>`;
    return s + tri;
  }

  // ================= CICLO =================
  function ciclo(cfg) {
    const T = M26.render; // solo para utilidades; colores propios:
    const A = cfg.color ? { hi: cfg.color, lo: shade(cfg.color, 0.62) }
      : (cfg.acento === 'teal' ? { hi: '#2DD4BF', lo: '#0D9488' }
        : cfg.acento === 'cielo' ? { hi: '#38BDF8', lo: '#0284C7' }
          : { hi: '#34D399', lo: '#059669' });
    const dark = (cfg.style !== 'light');
    const bg1 = dark ? '#0B1220' : '#FBFBF9', bg2 = dark ? '#0F1A2E' : '#F3F4F0';
    const ink = dark ? '#F2F6FB' : '#101418', ink2 = dark ? '#8B98AB' : '#5B6572';
    const card = dark ? 'rgba(255,255,255,0.05)' : '#FFFFFF';
    const cardBorder = dark ? 'rgba(255,255,255,0.11)' : 'rgba(16,20,24,0.10)';
    const pasos = cfg.pasos || [];
    const n = pasos.length;

    const W = 1180, H = 1180;
    const cx = W / 2, cy = H / 2 + 20;
    const R = 400;
    const CR = 92;                 // radio de cada tarjeta circular
    const HR = 168;                // radio del hub

    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    s += `<defs>
      <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${A.hi}"/><stop offset="1" stop-color="${A.lo}"/>
      </linearGradient>
      <radialGradient id="cglow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="${A.hi}" stop-opacity="${dark ? 0.20 : 0.10}"/>
        <stop offset="1" stop-color="${A.hi}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="cbg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
      </linearGradient>
    </defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#cbg)"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="330" fill="url(#cglow)"/>`;

    // radios finos
    const pos = pasos.map((p, i) => {
      const ang = -Math.PI / 2 + i * 2 * Math.PI / n;
      return { ang, x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
    });
    pos.forEach(({ x, y }) => {
      const ux = (x - cx) / R, uy = (y - cy) / R;
      s += `<line x1="${cx + ux * (HR + 14)}" y1="${cy + uy * (HR + 14)}" x2="${x - ux * (CR + 8)}" y2="${y - uy * (CR + 8)}" stroke="${dark ? 'rgba(255,255,255,0.16)' : 'rgba(16,20,24,0.14)'}" stroke-width="1.5"/>`;
    });

    // arcos de ciclo con flechas (entre tarjetas, sentido horario)
    for (let i = 0; i < n; i++) {
      const a1 = pos[i].ang + 0.42, a2 = pos[(i + 1) % n].ang - 0.42;
      let a2x = a2;
      if (i === n - 1) a2x = pos[0].ang - 0.42 + 2 * Math.PI; // cierre del ciclo
      s += arcoFlecha(cx, cy, R, a1, a2x, A.hi, 5);
    }

    // tarjetas circulares
    pasos.forEach((p, i) => {
      const { x, y } = pos[i];
      s += `<circle cx="${x}" cy="${y}" r="${CR}" fill="${p.color || card}" stroke="${cardBorder}" stroke-width="1.5"/>`;
      // insignia numerada arriba
      s += `<circle cx="${x}" cy="${y - CR + 6}" r="20" fill="url(#cg)"/>
            <text x="${x}" y="${y - CR + 7}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-size="15" font-weight="750" fill="#fff">${i + 1}</text>`;
      // icono
      s += logoIcon(p.icono || 'chispa', p.color ? '#fff' : A.hi, x - 19, y - 46, 38);
      // etiqueta (hasta 3 líneas)
      if (wrap(p.label, 15).length > 3) av(cfg, 'Paso ' + (i + 1) + ': el texto se ha recortado a 3 lineas');
      s += multi(x, y + 24, CR * 1.6, wrap(p.label, 15).slice(0, 3), 12.5, 16, p.color ? textoSobre(p.color) : (dark ? '#E8EEF6' : '#101418'), 600);
      s += hitC(i, x, y, CR);
    });

    // hub central
    s += `<circle cx="${cx + 4}" cy="${cy + 5}" r="${HR}" fill="#000" opacity="${dark ? 0.4 : 0.08}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${HR}" fill="url(#cg)"/>`;
    if (cfg.logoIcono) s += logoIcon(cfg.logoIcono, 'rgba(255,255,255,0.9)', cx - 26, cy - HR + 42, 52);
    if (wrap(cfg.titulo || '', 26).length > 3) av(cfg, 'El centro del ciclo se ha recortado a 3 lineas');
    s += multi(cx, cy - 6, HR * 1.5, wrap(cfg.titulo || '', 26).slice(0, 3), 17, 23, '#FFFFFF', 750);
    if (cfg.subtitulo) {
      s += `<text x="${cx}" y="${cy + 58}" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="700" letter-spacing="3.5" fill="rgba(255,255,255,0.85)">${esc(cfg.subtitulo.toUpperCase())}</text>`;
    }
    s += hitC(-1, cx, cy, HR);  // hub editable = índice -1

    s += '</svg>';
    return s;
  }

  // ================= CONCEPTO (2 niveles radiales) =================
  function concepto(cfg) {
    const dark = (cfg.style !== 'light');
    const A = cfg.color ? { hi: cfg.color, lo: shade(cfg.color, 0.62) }
      : (cfg.acento === 'teal' ? { hi: '#2DD4BF', lo: '#0D9488' }
        : cfg.acento === 'cielo' ? { hi: '#38BDF8', lo: '#0284C7' }
          : { hi: '#34D399', lo: '#059669' });
    const bg1 = dark ? '#0B1220' : '#FBFBF9', bg2 = dark ? '#0F1A2E' : '#F3F4F0';
    const ink = dark ? '#F2F6FB' : '#101418', ink2 = dark ? '#8B98AB' : '#5B6572';
    const card = dark ? 'rgba(255,255,255,0.05)' : '#FFFFFF';
    const cardBorder = dark ? 'rgba(255,255,255,0.11)' : 'rgba(16,20,24,0.10)';

    const cats = cfg.categorias || [];
    const n = cats.length;
    const W = 1660, H = 1150;
    const cx = W / 2, cy = H / 2 + 30;
    const RX = 430, RY = 340;
    const CW = 300, CH = 118;      // tarjeta categoría
    const SW = 224, SH = 44;       // chip sub-elemento

    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
    s += `<defs>
      <linearGradient id="kg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${A.hi}"/><stop offset="1" stop-color="${A.lo}"/>
      </linearGradient>
      <linearGradient id="kbg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
      </linearGradient>
      <radialGradient id="kglow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="${A.hi}" stop-opacity="${dark ? 0.18 : 0.09}"/>
        <stop offset="1" stop-color="${A.hi}" stop-opacity="0"/>
      </radialGradient>
    </defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#kbg)"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="360" fill="url(#kglow)"/>`;
    // cabecera
    s += `<text x="54" y="66" font-family="${FONT}" font-size="13" font-weight="700" letter-spacing="3" fill="${A.hi}">${esc((cfg.kicker || 'MAPA').toUpperCase())}</text>`;
    s += `<text x="54" y="104" font-family="${FONT}" font-size="26" font-weight="750" fill="${ink}">${esc(cfg.titulo || '')}</text>`;

    // posiciones de categorías en elipse
    const pos = cats.map((c, i) => {
      const ang = -Math.PI / 2 + i * 2 * Math.PI / n;
      return { ang, x: cx + RX * Math.cos(ang), y: cy + RY * Math.sin(ang) };
    });

    // líneas centro→categoría y categoría→subs
    pos.forEach(({ x, y }, i) => {
      const ux = (x - cx) / Math.hypot(x - cx, y - cy), uy = (y - cy) / Math.hypot(x - cx, y - cy);
      s += `<line x1="${cx + ux * 170}" y1="${cy + uy * 74}" x2="${x - ux * (CW / 2 + 8)}" y2="${y - uy * (CH / 2 + 6)}" stroke="${dark ? 'rgba(255,255,255,0.15)' : 'rgba(16,20,24,0.14)'}" stroke-width="1.5"/>`;
      s += `<circle cx="${cx + ux * 170}" cy="${cy + uy * 74}" r="4" fill="${A.hi}"/>`;
      // subs hacia fuera (dirección radial)
      const cat = cats[i];
      if ((cat.subs || []).length > 3) av(cfg, 'Categoria ' + (i + 1) + ': solo caben 3 sub-elementos');
      const subs = (cat.subs || []).slice(0, 3);
      const dirx = Math.cos(pos[i].ang), diry = Math.sin(pos[i].ang);
      subs.forEach((sub, j) => {
        const off = (j - (subs.length - 1) / 2) * (SH + 14) * Math.abs(diry > 0.55 || diry < -0.55 ? 0 : 1)
          + 0; // separación perpendicular
        const px = x + dirx * (CW / 2 + 30 + j * 0);
        const py = y + (j - (subs.length - 1) / 2) * (SH + 16) * (diry >= 0 ? 1 : 1) + (diry >= 0 ? 0 : 0);
        // colocación: apiladas verticalmente hacia el lado exterior
        const sx = x + dirx * (CW / 2 + 26) + (diry > 0.55 || diry < -0.55 ? (j - (subs.length - 1) / 2) * (SW + 16) : dirx * 0);
        const sy = y + (diry > 0.55 || diry < -0.55 ? diry * (CH / 2 + 40) : (j - (subs.length - 1) / 2) * (SH + 16));
        s += `<line x1="${(x + dirx * (CW / 2 + 4))}" y1="${y + (diry > 0.55 || diry < -0.55 ? diry * (CH / 2 + 4) : (j - (subs.length - 1) / 2) * (SH + 16))}" x2="${sx + SW / 2 - (diry > 0.55 || diry < -0.55 ? 0 : dirx * SW / 2)}" y2="${sy}" stroke="${dark ? 'rgba(255,255,255,0.12)' : 'rgba(16,20,24,0.12)'}" stroke-width="1"/>`;
        s += `<rect x="${sx - SW / 2 + (diry > 0.55 || diry < -0.55 ? 0 : dirx * SW / 2)}" y="${sy - SH / 2}" width="${SW}" height="${SH}" rx="22" fill="${dark ? 'rgba(255,255,255,0.04)' : '#F0F2EE'}" stroke="${cardBorder}" stroke-width="1"/>`;
        s += `<text x="${sx - SW / 2 + (diry > 0.55 || diry < -0.55 ? 0 : dirx * SW / 2) + SW / 2}" y="${sy}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-size="12" font-weight="550" fill="${ink2}">${esc(String(sub).slice(0, 30))}</text>`;
      });
    });

    // tarjetas de categoría
    cats.forEach((c, i) => {
      const { x, y } = pos[i];
      const cc = c.color;
      s += `<rect x="${x - CW / 2}" y="${y - CH / 2}" width="${CW}" height="${CH}" rx="18" fill="${cc || 'url(#kg)'}"/>`;
      if (c.icono) s += logoIcon(c.icono, cc ? textoSobre(cc) : 'rgba(255,255,255,0.95)', x - CW / 2 + 20, y - CH / 2 + 18, 30);
      if (wrap(c.label, Math.floor((CW - 60) / 8.4)).length > 3) av(cfg, 'Categoria ' + (i + 1) + ': el texto se ha recortado a 3 lineas');
      s += multi(x, y + 14, CW - 56, wrap(c.label, Math.floor((CW - 60) / 8.4)).slice(0, 3), 14.5, 20, cc ? textoSobre(cc) : '#FFFFFF', 700);
      s += hit(i, x - CW / 2, y - CH / 2, CW, CH);
    });

    // hub central (caja redondeada con gradiente)
    const HW = 340, HH = 130;
    s += `<rect x="${cx - HW / 2 + 5}" y="${cy - HH / 2 + 6}" width="${HW}" height="${HH}" rx="22" fill="#000" opacity="${dark ? 0.4 : 0.08}"/>`;
    s += `<rect x="${cx - HW / 2}" y="${cy - HH / 2}" width="${HW}" height="${HH}" rx="22" fill="url(#kg)"/>`;
    if (wrap(cfg.tituloCentral || cfg.titulo || '', 24).length > 3) av(cfg, 'El centro del mapa se ha recortado a 3 lineas');
    s += multi(cx, cy - 4, HW - 56, wrap(cfg.tituloCentral || cfg.titulo || '', 24).slice(0, 3), 16.5, 22, '#FFFFFF', 750);
    if (cfg.subtitulo) s += `<text x="${cx}" y="${cy + 44}" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="700" letter-spacing="3" fill="rgba(255,255,255,0.8)">${esc(cfg.subtitulo.toUpperCase())}</text>`;
    s += hit(-1, cx - HW / 2, cy - HH / 2, HW, HH);  // hub editable

    s += '</svg>';
    return s;
  }

  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
  }
  function textoSobre(hex) {
    const n = parseInt(hex.slice(1), 16);
    const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const L = 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
    return L > 0.45 ? '#0B1220' : '#FFFFFF';
  }

  const LayoutsExtra = { render(cfg) {
    if (cfg.layout === 'ciclo') return ciclo(cfg);
    if (cfg.layout === 'concepto') return concepto(cfg);
    return M26.render(cfg);
  }, LOGOS };
  if (typeof module !== 'undefined' && module.exports) module.exports = LayoutsExtra;
  else root.LayoutsExtra = LayoutsExtra;
})(typeof window !== 'undefined' ? window : globalThis);
