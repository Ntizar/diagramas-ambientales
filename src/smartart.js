// ============================================================
// SMARTART — 10 generadores de diagramas estilo 2026.
// Cada generador recibe (esq, textos, logo) donde logo = { concepto,
// variante, estilo } o null. Devuelven el cuerpo SVG 900x560.
// Todas las filas llevan chip circular con logo incrustado.
// ============================================================

const { GRISES, textoSVG, tinte } = require('./paleta');
const { G } = require('./generadores');
const { cssEstilo, defsEstilo } = require('./catalogo-estilos');
// cssEstiloPara/defsEstilo viven en catalogo.js (mismo scope en el bundle)
const cssEstiloPara = typeof cssEstilo !== 'undefined' ? cssEstilo : null;

// Chip circular con logo: círculo con degradado + logo escalado dentro
function chipLogo(esq, logo, cx, cy, r, uid) {
  if (!logo || !G[logo.concepto]) {
    // sin logo: círculo con número no — degradado suave
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gchip${uid})"/>`;
  }
  const genLogo = G[logo.concepto];
  const escala = (r * 2 * 0.78) / 512;
  const despl = r - 512 * escala / 2;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="${tinte(esq.primario, 0.85)}" stroke-width="2"/>
  <g transform="translate(${cx - r + despl} ${cy - r + despl}) scale(${escala})">
    <style>${cssEstiloPara(logo.estilo || 'plano', esq, 'c' + uid)}</style>
    ${defsEstilo(logo.estilo || 'plano', esq, 'c' + uid)}
    ${genLogo(esq, logo.variante || 1, 'c' + uid)}
  </g>`;
}

const S = {};

// ---------- 1. PROCESO HORIZONTAL (5 pasos) ----------
S['proceso-horizontal'] = (esq, t, logo, uid) => {
  const n = t.length, W = 900, H = 560;
  const cardW = Math.min(150, (W - 120 - (n - 1) * 24) / n), cardH = 200;
  const x0 = (W - (n * cardW + (n - 1) * 24)) / 2;
  const y = 210;
  let s = '';
  t.forEach((txt, i) => {
    const x = x0 + i * (cardW + 24);
    const grad = i % 2 === 0 ? `url(#gp${uid}a)` : `url(#gp${uid}b)`;
    s += `<g data-i="${i}">
      <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="22" fill="${grad}"/>
      ${chipLogo(esq, logo, x + cardW / 2, y + 52, 34, uid + i)}
      ${textoSVG(x + cardW / 2, y + 118, txt, { color: '#fff', size: 14, peso: 700, maxAncho: cardW - 18 })}
      <rect x="${x + cardW / 2 - 22}" y="${y + cardH - 40}" width="44" height="6" rx="3" fill="#fff" opacity="0.45"/>
    </g>`;
    if (i < n - 1) s += `<path d="M${x + cardW + 4} ${y + cardH / 2} h16" stroke="${GRISES.claro}" stroke-width="3" marker-end="url(#punta)"/>`;
  });
  return s;
};

// ---------- 2. PROCESO VERTICAL (6 pasos) ----------
S['proceso-vertical'] = (esq, t, logo, uid) => {
  const n = t.length, H = 560;
  const rowH = Math.min(74, (H - 120) / n - 8);
  const gap = (H - 100 - n * rowH) / Math.max(1, n - 1);
  const y0 = 60;
  let s = `<line x1="196" y1="${y0 + 24}" x2="196" y2="${y0 + (n - 1) * (rowH + gap) + 40}" stroke="${tinte(esq.primario, 0.8)}" stroke-width="3"/>`;
  t.forEach((txt, i) => {
    const y = y0 + i * (rowH + gap);
    const grad = i % 2 === 0 ? `url(#gp${uid}a)` : `url(#gp${uid}b)`;
    s += `<g data-i="${i}">
      <rect x="160" y="${y}" width="640" height="${rowH}" rx="${rowH / 2}" fill="${i % 2 ? tinte(esq.secundario, 0.9) : tinte(esq.primario, 0.92)}"/>
      ${chipLogo(esq, logo, 196, y + rowH / 2, rowH / 2 - 8, uid + i)}
      ${textoSVG(240, y + rowH / 2 + 5, txt, { color: GRISES.texto, ancla: 'start', size: 15, peso: 600, maxAncho: 540 })}
    </g>`;
  });
  return s;
};

// ---------- 3. CICLO (4-6 pasos) ----------
S['ciclo'] = (esq, t, logo, uid) => {
  const n = t.length, cx = 450, cy = 285;
  const rCaja = 205, w = 168, h = 62;
  let s = '';
  if (logo && G[logo.concepto]) {
    const genLogo = G[logo.concepto];
    const escala = 150 / 512;
    s += `<circle cx="${cx}" cy="${cy}" r="88" fill="#fff" stroke="${tinte(esq.primario, 0.85)}" stroke-width="2"/>
    <g transform="translate(${cx - 75} ${cy - 75}) scale(${escala})">
      <style>${cssEstiloPara(logo.estilo || 'plano', esq, 'c' + uid)}</style>
      ${defsEstilo(logo.estilo || 'plano', esq, 'c' + uid)}
      ${genLogo(esq, logo.variante || 1, 'c' + uid)}
    </g>`;
  } else {
    s += `<circle cx="${cx}" cy="${cy}" r="86" fill="url(#gchip${uid})"/>
    ${textoSVG(cx, cy + 6, 'Mejora continua', { color: '#fff', size: 15, peso: 700, maxAncho: 150 })}`;
  }
  t.forEach((txt, i) => {
    const ang = (-90 + (360 / n) * i) * Math.PI / 180;
    const x = cx + rCaja * Math.cos(ang) - w / 2;
    const y = cy + rCaja * Math.sin(ang) - h / 2;
    const grad = i % 2 === 0 ? `url(#gp${uid}a)` : `url(#gp${uid}b)`;
    s += `<g data-i="${i}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="31" fill="${grad}" filter="url(#som)"/>
      ${chipLogo(esq, logo, x + 34, y + h / 2, 22, uid + 'f' + i)}
      ${textoSVG(x + w / 2 + 16, y + h / 2 + 5, txt, { color: '#fff', size: 13, peso: 700, maxAncho: w - 80 })}
    </g>`;
    const am = (-90 + (360 / n) * (i + 0.55)) * Math.PI / 180;
    s += `<path d="M ${cx + 96 * Math.cos(am)} ${cy + 96 * Math.sin(am)} A 112 112 0 0 1 ${cx + 128 * Math.cos(am + 0.28)} ${cy + 128 * Math.sin(am + 0.28)}" fill="none" stroke="${GRISES.medio}" stroke-width="3" marker-end="url(#punta)"/>`;
  });
  return s;
};

// ---------- 4. COMPARATIVA 2 COLUMNAS ----------
S['comparativa'] = (esq, t, logo, uid) => {
  const half = Math.ceil(t.length / 2);
  const izq = t.slice(0, half), der = t.slice(half);
  let s = `
  <rect x="40" y="60" width="400" height="440" rx="26" fill="${tinte(esq.primario, 0.94)}"/>
  <rect x="460" y="60" width="400" height="440" rx="26" fill="${tinte(esq.secundario, 0.94)}"/>`;
  if (logo && G[logo.concepto]) {
    const genLogo = G[logo.concepto];
    s += `<g transform="translate(196 92) scale(0.19)">
      <style>${cssEstiloPara(logo.estilo || 'plano', esq, 'c' + uid)}</style>
      ${defsEstilo(logo.estilo || 'plano', esq, 'c' + uid)}
      ${genLogo(esq, logo.variante || 1, 'c' + uid)}
    </g>`;
  }
  s += textoSVG(240, 130, 'Opción A', { color: esq.primario, size: 19, peso: 700 });
  s += textoSVG(660, 130, 'Opción B', { color: esq.secundario, size: 19, peso: 700 });
  const fh = 64, gap = 16, y0 = 175;
  izq.forEach((txt, i) => {
    const y = y0 + i * (fh + gap);
    s += `<g data-i="${i}">
      ${chipLogo(esq, logo, 100, y + fh / 2, 22, uid + 'a' + i)}
      <rect x="136" y="${y}" width="272" height="${fh}" rx="18" fill="#fff"/>
      ${textoSVG(272, y + fh / 2 + 5, txt, { color: GRISES.texto, size: 13, peso: 600, maxAncho: 250 })}
    </g>`;
  });
  der.forEach((txt, i) => {
    const y = y0 + i * (fh + gap);
    s += `<g data-i="${i + izq.length}">
      ${chipLogo(esq, logo, 520, y + fh / 2, 22, uid + 'b' + i)}
      <rect x="556" y="${y}" width="272" height="${fh}" rx="18" fill="#fff"/>
      ${textoSVG(692, y + fh / 2 + 5, txt, { color: GRISES.texto, size: 13, peso: 600, maxAncho: 250 })}
    </g>`;
  });
  return s;
};

// ---------- 5. PILARES / TARJETAS ----------
S['tarjetas'] = (esq, t, logo, uid) => {
  const n = t.length, W = 900;
  const cols = n <= 4 ? n : 3;
  const rows = Math.ceil(n / cols);
  const cardW = Math.min(240, (W - 80 - (cols - 1) * 26) / cols);
  const cardH = Math.min(200, (520 - rows * 20) / rows);
  const x0 = (W - (cols * cardW + (cols - 1) * 26)) / 2;
  const y0 = (560 - (rows * cardH + (rows - 1) * 20)) / 2;
  let s = '';
  t.forEach((txt, i) => {
    const c = i % cols, f = Math.floor(i / cols);
    const x = x0 + c * (cardW + 26), y = y0 + f * (cardH + 20);
    const grad = i % 2 === 0 ? `url(#gp${uid}a)` : `url(#gp${uid}b)`;
    s += `<g data-i="${i}">
      <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="24" fill="#fff" stroke="${GRISES.claro}" stroke-width="1.5"/>
      ${chipLogo(esq, logo, x + cardW / 2, y + 62, 40, uid + i)}
      ${textoSVG(x + cardW / 2, y + 132, txt, { color: GRISES.texto, size: 14, peso: 700, maxAncho: cardW - 30 })}
      <rect x="${x + cardW / 2 - 24}" y="${y + cardH - 28}" width="48" height="6" rx="3" fill="${tinte(esq.primario, 0.7)}"/>
    </g>`;
  });
  return s;
};

// ---------- 6. JERARQUÍA (organigrama) ----------
S['jerarquia'] = (esq, t, logo, uid) => {
  let s = `<g data-i="0">
    <rect x="330" y="40" width="240" height="76" rx="22" fill="url(#gp${uid}a)" filter="url(#som)"/>
    ${chipLogo(esq, logo, 374, 78, 24, uid + 'top')}
    ${textoSVG(474, 78 + 5, t[0], { color: '#fff', size: 15, peso: 700, maxAncho: 180 })}
  </g>`;
  const hijos = t.slice(1);
  const n = hijos.length;
  const w = Math.min(180, (820 - (n - 1) * 20) / n);
  const x0 = (900 - (n * w + (n - 1) * 20)) / 2;
  hijos.forEach((txt, i) => {
    const x = x0 + i * (w + 20), y = 250;
    const grad = i % 2 === 0 ? `url(#gp${uid}a)` : `url(#gp${uid}b)`;
    s += `<path d="M450 116 v40 H${x + w / 2} v${y - 156 - 44}" fill="none" stroke="${GRISES.claro}" stroke-width="2.5"/>
    <g data-i="${i + 1}">
      <rect x="${x}" y="${y}" width="${w}" height="180" rx="20" fill="${i % 2 ? `url(#gp${uid}b)` : `url(#gp${uid}a)`}" filter="url(#som)"/>
      ${chipLogo(esq, logo, x + w / 2, y + 54, 32, uid + 'h' + i)}
      ${textoSVG(x + w / 2, y + 118, txt, { color: '#fff', size: 13.5, peso: 700, maxAncho: w - 24 })}
    </g>`;
  });
  return s;
};

// ---------- 7. LÍNEA DE TIEMPO ----------
S['tiempo'] = (esq, t, logo, uid) => {
  const n = t.length, W = 900;
  const paso = (W - 160) / (n - 1);
  let s = `<path d="M80 285 H820" stroke="${tinte(esq.primario, 0.75)}" stroke-width="4" stroke-linecap="round"/>`;
  t.forEach((txt, i) => {
    const x = 80 + i * paso;
    const arriba = i % 2 === 0;
    const yCaja = arriba ? 90 : 320;
    const grad = i % 2 === 0 ? `url(#gp${uid}a)` : `url(#gp${uid}b)`;
    s += `<line x1="${x}" y1="${arriba ? 255 : 315}" x2="${x}" y2="${arriba ? 265 : 305}" stroke="${GRISES.claro}" stroke-width="2.5"/>
    <circle cx="${x}" cy="285" r="12" fill="url(#gchip${uid})"/>
    <g data-i="${i}">
      <rect x="${x - 66}" y="${yCaja}" width="132" height="130" rx="20" fill="#fff" stroke="${GRISES.claro}" stroke-width="1.5"/>
      ${chipLogo(esq, logo, x, yCaja + 42, 26, uid + i)}
      ${textoSVG(x, yCaja + 96, txt, { color: GRISES.texto, size: 12.5, peso: 700, maxAncho: 116 })}
    </g>`;
  });
  return s;
};

// ---------- 8. RELACIÓN RADIAL ----------
S['radial'] = (esq, t, logo, uid) => {
  const n = t.length, cx = 450, cy = 280;
  let s = '';
  if (logo && G[logo.concepto]) {
    const genLogo = G[logo.concepto];
    const escala = 140 / 512;
    s += `<circle cx="${cx}" cy="${cy}" r="82" fill="#fff" stroke="${tinte(esq.primario, 0.85)}" stroke-width="2"/>
    <g transform="translate(${cx - 70} ${cy - 70}) scale(${escala})">
      <style>${cssEstiloPara(logo.estilo || 'plano', esq, 'c' + uid)}</style>
      ${defsEstilo(logo.estilo || 'plano', esq, 'c' + uid)}
      ${genLogo(esq, logo.variante || 1, 'c' + uid)}
    </g>`;
  } else {
    s += `<circle cx="${cx}" cy="${cy}" r="80" fill="url(#gchip${uid})"/>
    ${textoSVG(cx, cy + 5, 'Núcleo', { color: '#fff', size: 16, peso: 700 })}`;
  }
  t.forEach((txt, i) => {
    const ang = (-90 + (360 / n) * i) * Math.PI / 180;
    const bx = cx + 235 * Math.cos(ang), by = cy + 235 * Math.sin(ang);
    const grad = i % 2 === 0 ? `url(#gp${uid}a)` : `url(#gp${uid}b)`;
    s += `<line x1="${cx + 88 * Math.cos(ang)}" y1="${cy + 88 * Math.sin(ang)}" x2="${bx - 90 * Math.cos(ang)}" y2="${by - 44 * Math.sin(ang)}" stroke="${GRISES.claro}" stroke-width="2.5"/>
    <g data-i="${i}">
      <rect x="${bx - 90}" y="${by - 42}" width="180" height="84" rx="20" fill="${grad}" filter="url(#som)"/>
      ${chipLogo(esq, logo, bx - 52, by, 22, uid + 'r' + i)}
      ${textoSVG(bx + 12, by + 5, txt, { color: '#fff', size: 13, peso: 700, maxAncho: 120 })}
    </g>`;
  });
  return s;
};

// ---------- 9. EMBUDO ----------
S['embudo'] = (esq, t, logo, uid) => {
  const n = t.length, h = 72, gap = 16;
  const y0 = 70, Wmax = 600, Wmin = 180;
  let s = '';
  t.forEach((txt, i) => {
    const y = y0 + i * (h + gap);
    const w1 = Wmax - ((Wmax - Wmin) / n) * i;
    const w2 = Wmax - ((Wmax - Wmin) / n) * (i + 1);
    const grad = i % 2 === 0 ? `url(#gp${uid}a)` : `url(#gp${uid}b)`;
    s += `<g data-i="${i}">
      <path d="M${450 - w1 / 2} ${y} h${w1} L${450 + w2 / 2} ${y + h} h-${w2} Z" fill="${grad}" filter="url(#som)"/>
      ${chipLogo(esq, logo, 450 - w2 / 2 + 44, y + h / 2, 24, uid + i)}
      ${textoSVG(450 + 30, y + h / 2 + 5, txt, { color: '#fff', size: 14, peso: 700, maxAncho: w2 - 130 })}
    </g>`;
  });
  return s;
};

// ---------- 10. LISTA CON CHECKS ----------
S['checklist'] = (esq, t, logo, uid) => {
  const n = t.length, h = 58, gap = 14;
  const y0 = (560 - (n * h + (n - 1) * gap)) / 2;
  let s = `<rect x="140" y="${y0 - 24}" width="620" height="${n * h + (n - 1) * gap + 48}" rx="24" fill="${tinte(esq.primario, 0.95)}"/>`;
  t.forEach((txt, i) => {
    const y = y0 + i * (h + gap);
    s += `<g data-i="${i}">
      <rect x="164" y="${y}" width="572" height="${h}" rx="16" fill="#fff"/>
      ${chipLogo(esq, logo, 200, y + h / 2, 20, uid + i)}
      <path d="M246 ${y + h / 2 - 8} l8 9 l16 -18" stroke="${esq.secundario}" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${textoSVG(286, y + h / 2 + 5, txt, { color: GRISES.texto, ancla: 'start', size: 14, peso: 600, maxAncho: 420 })}
    </g>`;
  });
  return s;
};


// ---------- 11. INFOGRAFÍA DE PROCESO (estilo informe consultoría) ----------
// Cada paso: "Título" en texts[]; párrafo y herramientas en textos extra:
// estructura texts[i] = título; textosPar[i] = párrafo; textosHerr[i] = "a;b;c"
S['infografia'] = (esq, t, logo, uid, par, herr) => {
  const n = t.length, W = 1400, H = 860;
  const colW = Math.min(180, (W - 140 - (n - 1) * 14) / n);
  const x0 = (W - (n * colW + (n - 1) * 14)) / 2;
  const usarPar = par && par.length;
  const usarHerr = herr && herr.length;
  const colH = usarHerr ? 520 : (usarPar ? 400 : 260);
  const y0 = 250;
  let s = '';
  // cabecera del lienzo
  s += textoSVG(70, 62, 'Proceso', { color: esq.primario, ancla: 'start', size: 30, peso: 700 });
  s += textoSVG(70, 96, 'Síntesis de las etapas del trabajo', { color: GRISES.medio, ancla: 'start', size: 15, peso: 400 });
  if (logo && G[logo.concepto]) {
    const genLogo = G[logo.concepto];
    s += '<g transform="translate(' + (W - 190) + ' 20) scale(0.24)">'
      + '<style>' + cssEstilo(logo.estilo || 'plano', esq, 'cab' + uid) + '</style>'
      + defsEstilo(logo.estilo || 'plano', esq, 'cab' + uid)
      + genLogo(esq, logo.variante || 1, 'cab' + uid) + '</g>';
  }
  // banda de fuentes
  s += '<rect x="70" y="126" width="' + (W - 140) + '" height="64" rx="16" fill="' + tinte(esq.primario, 0.94) + '"/>';
  s += textoSVG(W / 2, 165, 'Fuentes clave · información acústica, territorial, ambiental y participación', { color: esq.primario, size: 14.5, peso: 600, maxAncho: W - 260 });
  t.forEach((titulo, i) => {
    const x = x0 + i * (colW + 14);
    const grad = i % 2 === 0 ? `url(#gp${uid}a)` : `url(#gp${uid}b)`;
    // columna
    s += '<g data-i="' + i + '">';
    s += '<rect x="' + x + '" y="' + y0 + '" width="' + colW + '" height="' + colH + '" rx="18" fill="#fff" stroke="' + GRISES.claro + '" stroke-width="1.5" filter="url(#som)"/>';
    // banner número + título
    s += '<path d="M' + x + ' ' + (y0 + 18) + ' q0 -18 18 -18 h' + (colW - 36) + ' q18 0 18 18 v46 h-' + colW + ' Z" fill="' + grad + '"/>';
    s += '<circle cx="' + (x + 34) + '" cy="' + (y0 + 40) + '" r="16" fill="#fff" opacity="0.22"/>';
    s += textoSVG(x + 34, y0 + 45, String(i + 1), { color: '#fff', size: 15, peso: 700 });
    s += textoSVG(x + colW / 2 + 14, y0 + 45, titulo, { color: '#fff', size: 11.5, peso: 700, maxAncho: colW - 78 });
    // icono grande: el logo
    const genLogo = G[logo && logo.concepto];
    if (genLogo) {
      s += '<g transform="translate(' + (x + colW / 2 - 44) + ' ' + (y0 + 86) + ') scale(' + (88 / 512) + ')">'
        + '<style>' + cssEstilo(logo.estilo || 'plano', esq, 'ic' + uid + i) + '</style>'
        + defsEstilo(logo.estilo || 'plano', esq, 'ic' + uid + i)
        + genLogo(esq, logo.variante || 1, 'ic' + uid + i) + '</g>';
    }
    let yy = y0 + 200;
    // párrafo
    if (usarPar && par[i]) {
      s += textoSVG(x + colW / 2, yy + 8, par[i], { color: GRISES.texto, size: 10.5, peso: 400, maxAncho: colW - 26 });
      yy += 96;
    }
    // caja de herramientas
    if (usarHerr && herr[i]) {
      const items = String(herr[i]).split(';').filter(Boolean).slice(0, 3);
      const hCaja = 26 + items.length * 20;
      s += '<rect x="' + (x + 10) + '" y="' + (y0 + colH - hCaja - 12) + '" width="' + (colW - 20) + '" height="' + hCaja + '" rx="12" fill="' + tinte(esq.secundario, 0.88) + '"/>';
      let hy = y0 + colH - hCaja + 8;
      items.forEach(h => {
        s += '<circle cx="' + (x + 24) + '" cy="' + (hy + 4) + '" r="2.6" fill="' + esq.secundario + '"/>';
        s += textoSVG(x + 33, hy + 8, h.trim(), { color: esq.primario, ancla: 'start', size: 10, peso: 600, maxAncho: colW - 50 });
        hy += 20;
      });
    }
    s += '</g>';
    // chevron conector
    if (i < n - 1) {
      const xc = x + colW + 7;
      s += '<path d="M' + xc + ' ' + (y0 + colH / 2 - 10) + ' l8 10 l-8 10" fill="none" stroke="' + esq.secundario + '" stroke-width="3" stroke-linecap="round"/>';
    }
  });
  // banner pie
  s += '<rect x="70" y="' + (y0 + colH + 34) + '" width="' + (W - 140) + '" height="58" rx="16" fill="url(#gchip' + uid + ')"/>';
  s += textoSVG(W / 2, y0 + colH + 70, 'Aproximación integrada · síntesis por etapas', { color: '#fff', size: 15, peso: 700, maxAncho: W - 300 });
  return s;
};

const TIPOS_SMARTART = [
  { id: 'proceso-horizontal', nombre: 'Proceso en fila', cat: 'Procesos', pasos: 5, logoSi: true },
  { id: 'proceso-vertical', nombre: 'Proceso en lista', cat: 'Procesos', pasos: 6, logoSi: true },
  { id: 'ciclo', nombre: 'Ciclo de mejora', cat: 'Ciclos', pasos: 5, logoSi: true },
  { id: 'comparativa', nombre: 'Comparativa', cat: 'Comparativas', pasos: 4, logoSi: true },
  { id: 'tarjetas', nombre: 'Tarjetas', cat: 'Conceptos', pasos: 6, logoSi: true },
  { id: 'jerarquia', nombre: 'Organigrama', cat: 'Jerarquías', pasos: 5, logoSi: true },
  { id: 'tiempo', nombre: 'Línea de tiempo', cat: 'Tiempo', pasos: 6, logoSi: true },
  { id: 'radial', nombre: 'Radial central', cat: 'Relaciones', pasos: 6, logoSi: true },
  { id: 'embudo', nombre: 'Embudo', cat: 'Procesos', pasos: 5, logoSi: true },
  { id: 'checklist', nombre: 'Checklist', cat: 'Listas', pasos: 5, logoSi: true },
  { id: 'infografia', nombre: 'Infografía de proceso', cat: 'Procesos', pasos: 7, logoSi: true },
];

module.exports = { S, TIPOS_SMARTART, chipLogo };
