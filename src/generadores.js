// ============================================================
// GENERADORES SVG — 30 tipos de diagrama.
// Cada generador recibe { esquema, textos } y devuelve un SVG
// string con viewBox 800x500, textos reales (editables) y
// data-attrs para la edición en la UI.
// ============================================================

const { tinte, textoSVG } = require('./paleta');

const GRISES = {
  oscuro: '#2B3440',
  texto: '#33404F',
  medio: '#8A94A0',
  claro: '#C9D0D8',
  fondo: '#F2F4F7',
  blanco: '#FFFFFF',
};

function fondo() {
  return `<rect width="800" height="500" fill="#FFFFFF"/>`;
}

function caja(x, y, w, h, fill, rx = 10, stroke = null) {
  const s = stroke ? ` stroke="${stroke}" stroke-width="2"` : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${s}/>`;
}

function flecha(x1, y1, x2, y2, color, ancho = 3) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${ancho}" marker-end="url(#punta)"/>`;
}

function defs() {
  return `<defs><marker id="punta" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#8A94A0"/></marker></defs>`;
}

const G = {};

// ---------- PROCESOS ----------

G['proceso-flechas'] = (e, t) => {
  const n = t.length, w = 128, h = 90, gap = (800 - n * w) / (n + 1);
  let s = fondo() + defs();
  t.forEach((txt, i) => {
    const x = gap + i * (w + gap), y = 205;
    const col = i % 2 === 0 ? e.primario : e.secundario;
    s += `<g data-i="${i}">${caja(x, y, w, h, col, 12)}${textoSVG(x + w / 2, y + h / 2 + 5, txt, { color: '#fff', maxAncho: w - 16 })}</g>`;
    if (i < n - 1) s += flecha(x + w + 4, y + h / 2, x + w + gap - 4, y + h / 2, GRISES.medio);
  });
  return s + '</svg>';
};

G['proceso-chevrons'] = (e, t) => {
  const n = t.length, w = 150, h = 320, solape = 20;
  const total = n * w - (n - 1) * solape, x0 = (800 - total) / 2;
  let s = fondo();
  t.forEach((txt, i) => {
    const x = x0 + i * (w - solape);
    const col = tinte(i % 2 === 0 ? e.primario : e.secundario, -i * 0.06);
    const punta = i < n - 1 ? 24 : 0;
    s += `<g data-i="${i}"><path d="M${x},90 L${x + w - punta},90 L${x + w},250 L${x + w - punta},410 L${x},410 L${x + (i > 0 ? 24 : 0)},250 Z" fill="${col}"/>`;
    s += textoSVG(x + w / 2 + (i > 0 ? 12 : 0), 250, txt, { color: '#fff', size: 15, maxAncho: w - 50 }) + '</g>';
  });
  return s + '</svg>';
};

G['proceso-escalera'] = (e, t) => {
  const n = t.length, w = 150, h = 74, paso = Math.min(90, 330 / (n - 1));
  let s = fondo() + defs();
  t.forEach((txt, i) => {
    const x = 60 + i * (w + 28), y = 380 - i * paso;
    const col = tinte(e.primario, i * 0.1);
    s += `<g data-i="${i}">${caja(x, y, w, h, col, 10)}${textoSVG(x + w / 2, y + h / 2 + 5, txt, { color: '#fff', maxAncho: w - 14 })}</g>`;
    if (i < n - 1) s += flecha(x + w + 2, y - 6, x + w + 26, y - paso + h + 6, GRISES.medio);
  });
  return s + '</svg>';
};

G['proceso-serpiente'] = (e, t) => {
  const n = t.length, w = 170, h = 80;
  const porFila = Math.ceil(n / 2);
  const gap = Math.min(40, (800 - 80 - porFila * w) / Math.max(1, porFila - 1));
  let s = fondo() + defs();
  t.forEach((txt, i) => {
    const fila = Math.floor(i / porFila), idx = i % porFila;
    const izq = fila % 2 === 0;
    const col = idxInFila => idxInFila % 2 === 0 ? e.primario : e.secundario;
    const x = izq ? 40 + idx * (w + gap) : 40 + (porFila - 1 - idx) * (w + gap);
    const y = fila === 0 ? 120 : 300;
    s += `<g data-i="${i}">${caja(x, y, w, h, col(idx), 12)}${textoSVG(x + w / 2, y + h / 2 + 5, txt, { color: '#fff', maxAncho: w - 16 })}</g>`;
  });
  // flechas serpiente
  for (let i = 0; i < n - 1; i++) {
    const fila = Math.floor(i / porFila), idx = i % porFila;
    const izq = fila % 2 === 0;
    const x = izq ? 40 + idx * (w + gap) : 40 + (porFila - 1 - idx) * (w + gap);
    const y = fila === 0 ? 120 : 300;
    if (idx < porFila - 1) {
      const sigIzq = izq;
      const xs = sigIzq ? x + w + 4 : x - 4;
      const xe = sigIzq ? x + w + gap - 4 : x - gap + 4;
      s += flecha(xs, y + h / 2, xe, y + h / 2, GRISES.medio);
    } else {
      s += flecha(x + w / 2, y + h + 4, x + w / 2, y + 160 - 4, GRISES.medio);
    }
  }
  return s + '</svg>';
};

G['proceso-pilares'] = (e, t) => {
  const n = t.length, w = 140, gap = (800 - 60 - n * w) / (n + 1);
  let s = fondo();
  t.forEach((txt, i) => {
    const x = 60 + gap + i * (w + gap);
    const col = tinte(e.primario, i * 0.08);
    const h = 200 + (i % 3) * 30, y = 400 - h;
    s += `<g data-i="${i}">${caja(x, y, w, h, col, 8)}${textoSVG(x + w / 2, y + 30, `${i + 1}. ${txt}`, { color: '#fff', size: 14, maxAncho: w - 14 })}</g>`;
  });
  return s + '</svg>';
};

// ---------- CICLOS ----------

function cicloCircular(e, t, anguloIni = -90) {
  const cx = 400, cy = 250, rCaja = 165, w = 150, h = 64;
  let s = fondo() + defs();
  s += `<circle cx="${cx}" cy="${cy}" r="58" fill="${e.acento}" opacity="0.92"/>`;
  s += textoSVG(cx, cy + 5, 'Mejora continua', { color: '#fff', size: 13, maxAncho: 100 });
  const n = t.length;
  t.forEach((txt, i) => {
    const ang = (anguloIni + (360 / n) * i) * Math.PI / 180;
    const x = cx + rCaja * Math.cos(ang) - w / 2;
    const y = cy + rCaja * Math.sin(ang) - h / 2;
    const col = i % 2 === 0 ? e.primario : e.secundario;
    s += `<g data-i="${i}">${caja(x, y, w, h, col, 32)}${textoSVG(x + w / 2, y + h / 2 + 5, txt, { color: '#fff', size: 13, maxAncho: w - 20 })}</g>`;
    const angMedio = (anguloIni + (360 / n) * (i + 0.5)) * Math.PI / 180;
    s += flecha(cx + 80 * Math.cos(angMedio), cy + 80 * Math.sin(angMedio),
                cx + (rCaja - 42) * Math.cos(angMedio), cy + (rCaja - 42) * Math.sin(angMedio), GRISES.medio);
  });
  return s + '</svg>';
}

G['ciclo-4'] = (e, t) => cicloCircular(e, t.slice(0, 4));
G['ciclo-6'] = (e, t) => cicloCircular(e, t.slice(0, 6));
G['ciclo-segmentos'] = (e, t) => {
  const n = t.length, cx = 400, cy = 250, r = 150;
  let s = fondo();
  t.forEach((txt, i) => {
    const a0 = (-90 + (360 / n) * i + 2) * Math.PI / 180, a1 = (-90 + (360 / n) * (i + 1) - 2) * Math.PI / 180;
    const col = i % 2 === 0 ? e.primario : e.secundario;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    s += `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${col}" stroke="#fff" stroke-width="3"/>`;
    const am = (-90 + (360 / n) * (i + 0.5)) * Math.PI / 180;
    const amx = cx + r * 0.62 * Math.cos(am), amy = cy + r * 0.62 * Math.sin(am);
    s += `<g data-i="${i}">` + textoSVG(amx, amy, txt, { color: '#fff', size: 12, maxAncho: 90 }) + '</g>';
  });
  return s + '</svg>';
};

G['ciclo-orbital'] = (e, t) => {
  const n = t.length, cx = 400, cy = 250, r = 140, w = 140, h = 52;
  let s = fondo();
  s += `<circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="${e.neutro}" stroke-width="2" stroke-dasharray="6 6"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="52" fill="${e.acento}"/>`;
  s += textoSVG(cx, cy + 5, 'Objetivo', { color: '#fff', size: 14 });
  t.forEach((txt, i) => {
    const ang = (-90 + (360 / n) * i) * Math.PI / 180;
    const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
    const col = i % 2 === 0 ? e.primario : e.secundario;
    s += `<g data-i="${i}"><circle cx="${x}" cy="${y}" r="26" fill="${col}"/>${textoSVG(x, y - 40, `${i + 1}`, { color: GRISES.medio, size: 12 })}`;
    const lx = cx + (r + 52) * Math.cos(ang), ly = cy + (r + 52) * Math.sin(ang);
    s += `<rect x="${lx - 52}" y="${ly - 22}" width="104" height="44" rx="22" fill="${tinte(col, 0.85)}" stroke="${col}" stroke-width="1.5"/>`;
    s += textoSVG(lx, ly + 5, txt, { color: GRISES.texto, size: 12, maxAncho: 94 }) + '</g>';
  });
  return s + '</svg>';
};

G['ciclo-espiral'] = (e, t) => {
  const n = t.length, cx = 400, cy = 250;
  let s = fondo() + defs();
  s += `<path d="M ${cx} ${cy} ${Array.from({length: 60}, (_, k) => {
    const ang = k * 0.16, r = 8 + k * 3.2;
    return `L ${(cx + r * Math.cos(ang)).toFixed(1)} ${(cy + r * Math.sin(ang)).toFixed(1)}`;
  }).join(' ')}" fill="none" stroke="${e.secundario}" stroke-width="3"/>`;
  t.forEach((txt, i) => {
    const ang = -0.6 + i * 1.15, r = 70 + i * 38;
    const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
    const col = i % 2 === 0 ? e.primario : e.acento;
    s += `<g data-i="${i}"><circle cx="${x}" cy="${y}" r="30" fill="${col}"/>${textoSVG(x, y + 5, `${i + 1}`, { color: '#fff', size: 16 })}`;
    s += textoSVG(x, y + 52, txt, { color: GRISES.texto, size: 13, maxAncho: 120 }) + '</g>';
  });
  return s + '</svg>';
};

// ---------- COMPARATIVAS ----------

G['comparativa-2col'] = (e, t) => {
  let s = fondo() + defs();
  const filas = Math.ceil(t.length / 2), fh = 78, gapY = 18;
  const y0 = 250 - (filas * fh + (filas - 1) * gapY) / 2;
  const Izq = t.slice(0, Math.ceil(t.length / 2)), Der = t.slice(Math.ceil(t.length / 2));
  Izq.forEach((txt, i) => {
    const y = y0 + i * (fh + gapY);
    s += `<g data-i="${i}">${caja(50, y, 320, fh, e.primario, 10)}${textoSVG(210, y + fh / 2 + 5, txt, { color: '#fff', maxAncho: 300 })}</g>`;
  });
  Der.forEach((txt, i) => {
    const y = y0 + i * (fh + gapY);
    s += `<g data-i="${i + Izq.length}">${caja(430, y, 320, fh, e.secundario, 10)}${textoSVG(590, y + fh / 2 + 5, txt, { color: '#fff', maxAncho: 300 })}</g>`;
  });
  s += textoSVG(210, 60, 'Opción A', { color: e.primario, size: 17, peso: 700 });
  s += textoSVG(590, 60, 'Opción B', { color: e.secundario, size: 17, peso: 700 });
  s += `<circle cx="400" cy="250" r="26" fill="${e.acento}"/>` + textoSVG(400, 255, 'VS', { color: '#fff', size: 15, peso: 700 });
  return s + '</svg>';
};

G['comparativa-vs'] = (e, t) => {
  let s = fondo();
  s += `<rect x="40" y="80" width="340" height="360" rx="14" fill="${tinte(e.primario, 0.88)}" stroke="${e.primario}" stroke-width="2"/>`;
  s += `<rect x="420" y="80" width="340" height="360" rx="14" fill="${tinte(e.secundario, 0.88)}" stroke="${e.secundario}" stroke-width="2"/>`;
  s += textoSVG(210, 130, 'Escenario A', { color: e.primario, size: 18, peso: 700 });
  s += textoSVG(590, 130, 'Escenario B', { color: e.secundario, size: 18, peso: 700 });
  const half = Math.ceil(t.length / 2);
  t.slice(0, half).forEach((txt, i) => {
    s += `<g data-i="${i}">${caja(65, 165 + i * 62, 290, 50, '#fff', 8, e.primario)}${textoSVG(210, 190 + i * 62, txt, { color: GRISES.texto, size: 13, maxAncho: 270 })}</g>`;
  });
  t.slice(half).forEach((txt, i) => {
    s += `<g data-i="${i + half}">${caja(445, 165 + i * 62, 290, 50, '#fff', 8, e.secundario)}${textoSVG(590, 190 + i * 62, txt, { color: GRISES.texto, size: 13, maxAncho: 270 })}</g>`;
  });
  return s + '</svg>';
};

G['comparativa-bascula'] = (e, t) => {
  let s = fondo() + defs();
  const half = Math.ceil(t.length / 2);
  s += `<polygon points="400,120 140,220 660,220" fill="${tinte(e.neutro, 0.7)}"/>`;
  s += `<polygon points="400,440 140,340 660,340" fill="${tinte(e.neutro, 0.7)}"/>`;
  s += textoSVG(400, 100, 'Decisión', { color: GRISES.texto, size: 16, peso: 700 });
  t.slice(0, half).forEach((txt, i) => {
    s += `<g data-i="${i}">${caja(70, 170 + i * 56, 240, 46, e.primario, 23)}${textoSVG(190, 193 + i * 56, txt, { color: '#fff', size: 13, maxAncho: 220 })}</g>`;
  });
  t.slice(half).forEach((txt, i) => {
    s += `<g data-i="${i + half}">${caja(490, 310 + i * 56, 240, 46, e.secundario, 23)}${textoSVG(610, 333 + i * 56, txt, { color: '#fff', size: 13, maxAncho: 220 })}</g>`;
  });
  return s + '</svg>';
};

G['comparativa-solapes'] = (e, t) => {
  let s = fondo();
  const t3 = t.slice(0, 3);
  s += `<circle cx="320" cy="220" r="120" fill="${e.primario}" opacity="0.75"/>`;
  s += `<circle cx="480" cy="220" r="120" fill="${e.secundario}" opacity="0.75"/>`;
  if (t3[0]) s += `<g data-i="0">` + textoSVG(270, 220, t3[0], { color: '#fff', size: 14, maxAncho: 130 }) + '</g>';
  if (t3[1]) s += `<g data-i="1">` + textoSVG(530, 220, t3[1], { color: '#fff', size: 14, maxAncho: 130 }) + '</g>';
  if (t3[2]) s += `<g data-i="2">` + textoSVG(400, 100, t3[2], { color: GRISES.texto, size: 14, maxAncho: 160 }) + '</g>';
  return s + '</svg>';
};

// ---------- JERARQUÍAS ----------

G['piramide-4'] = (e, t) => {
  let s = fondo();
  const n = t.length, h = 320, y0 = 70, W = 560;
  t.forEach((txt, i) => {
    const f1 = y0 + (h / n) * i, f2 = y0 + (h / n) * (i + 1);
    const w1 = (W / n) * i * 0.9 + 90, w2 = (W / n) * (i + 1) * 0.9 + 90;
    const col = tinte(e.primario, -(i * 0.07));
    s += `<g data-i="${i}"><polygon points="${400 - w1 / 2},${f1} ${400 + w1 / 2},${f1} ${400 + w2 / 2},${f2} ${400 - w2 / 2},${f2}" fill="${col}" stroke="#fff" stroke-width="2"/>`;
    s += textoSVG(400, (f1 + f2) / 2 + 5, txt, { color: '#fff', size: 14, maxAncho: Math.min(w2 - 30, 380) }) + '</g>';
  });
  return s + '</svg>';
};

G['piramide-invertida'] = (e, t) => {
  let s = fondo();
  const n = t.length, h = 320, y0 = 70, W = 560;
  t.forEach((txt, i) => {
    const f1 = y0 + (h / n) * i, f2 = y0 + (h / n) * (i + 1);
    const w1 = (W / n) * (n - i) * 0.9 + 90, w2 = (W / n) * (n - i - 1) * 0.9 + 90;
    const col = tinte(e.primario, i * 0.09);
    s += `<g data-i="${i}"><polygon points="${400 - w1 / 2},${f1} ${400 + w1 / 2},${f1} ${400 + w2 / 2},${f2} ${400 - w2 / 2},${f2}" fill="${col}" stroke="#fff" stroke-width="2"/>`;
    s += textoSVG(400, (f1 + f2) / 2 + 5, txt, { color: '#fff', size: 14, maxAncho: Math.min(w1 - 30, 380) }) + '</g>';
  });
  return s + '</svg>';
};

G['jerarquia-organica'] = (e, t) => {
  let s = fondo() + defs();
  s += `<g data-i="0">${caja(310, 50, 180, 62, e.acento, 10)}${textoSVG(400, 81, t[0], { color: '#fff', maxAncho: 160 })}</g>`;
  const hijos = t.slice(1);
  const w = 150, gap = Math.min(36, (720 - hijos.length * w) / Math.max(1, hijos.length - 1));
  hijos.forEach((txt, i) => {
    const x = 400 - ((hijos.length * w + (hijos.length - 1) * gap) / 2) + i * (w + gap);
    const y = 230;
    s += `<line x1="400" y1="112" x2="400" y2="170" stroke="${GRISES.claro}" stroke-width="2"/><line x1="400" y1="170" x2="${x + w / 2}" y2="170" stroke="${GRISES.claro}" stroke-width="2"/><line x1="${x + w / 2}" y1="170" x2="${x + w / 2}" y2="${y - 4}" stroke="${GRISES.claro}" stroke-width="2"/>`;
    const col = i % 2 === 0 ? e.primario : e.secundario;
    s += `<g data-i="${i + 1}">${caja(x, y, w, 130, col, 10)}${textoSVG(x + w / 2, y + 65, txt, { color: '#fff', maxAncho: w - 16 })}</g>`;
    if (i === 0) s += '';
  });
  return s + '</svg>';
};

G['jerarquia-arbol'] = (e, t) => {
  let s = fondo() + defs();
  s += `<g data-i="0">${caja(320, 40, 160, 56, e.acento, 10)}${textoSVG(400, 68, t[0], { color: '#fff', size: 13, maxAncho: 140 })}</g>`;
  const resto = t.slice(1);
  const mitad = Math.ceil(resto.length / 2);
  const ramas = [resto.slice(0, mitad), resto.slice(mitad)];
  ramas.forEach((rama, r) => {
    const cx = r === 0 ? 210 : 590;
    const col = r === 0 ? e.primario : e.secundario;
    s += `<line x1="400" y1="96" x2="${cx}" y2="150" stroke="${GRISES.claro}" stroke-width="2"/>`;
    rama.forEach((txt, i) => {
      const y = 180 + i * 92;
      s += `<g data-i="${1 + (r === 0 ? i : mitad + i)}">${caja(cx - 80, y, 160, 60, col, 10)}${textoSVG(cx, y + 30, txt, { color: '#fff', size: 12, maxAncho: 144 })}</g>`;
      if (i < rama.length - 1) s += `<line x1="${cx}" y1="${y + 60}" x2="${cx}" y2="${y + 92}" stroke="${GRISES.claro}" stroke-width="2"/>`;
    });
  });
  return s + '</svg>';
};

// ---------- LISTAS Y MATRICES ----------

G['lista-vertical'] = (e, t) => {
  let s = fondo();
  const n = t.length, h = 56, gap = Math.min(18, (380 - n * h) / Math.max(1, n - 1));
  const y0 = 250 - (n * h + (n - 1) * gap) / 2;
  t.forEach((txt, i) => {
    const y = y0 + i * (h + gap);
    const col = tinte(e.primario, i * 0.07);
    s += `<g data-i="${i}">${caja(80, y, 640, h, col, 28)}
      <circle cx="118" cy="${y + h / 2}" r="19" fill="#fff"/>
      ${textoSVG(118, y + h / 2 + 5, `${i + 1}`, { color: col, size: 15, peso: 700 })}
      ${textoSVG(160, y + h / 2 + 5, txt, { color: '#fff', ancla: 'start', size: 15, maxAncho: 520 })}</g>`;
  });
  return s + '</svg>';
};

G['lista-tarjetas'] = (e, t) => {
  let s = fondo();
  const cols = 3, w = 210, h = 150, gapX = 30, gapY = 30;
  const x0 = (800 - cols * w - (cols - 1) * gapX) / 2;
  t.forEach((txt, i) => {
    const c = i % cols, f = Math.floor(i / cols);
    const x = x0 + c * (w + gapX), y = 80 + f * (h + gapY);
    const col = i % 2 === 0 ? e.primario : e.secundario;
    s += `<g data-i="${i}">${caja(x, y, w, h, '#fff', 12, GRISES.claro)}
      <rect x="${x}" y="${y}" width="${w}" height="10" rx="5" fill="${col}"/>
      <circle cx="${x + 34}" cy="${y + 48}" r="17" fill="${col}"/>
      ${textoSVG(x + 34, y + 53, `${i + 1}`, { color: '#fff', size: 14, peso: 700 })}
      ${textoSVG(x + w / 2, y + 100, txt, { color: GRISES.texto, size: 13, maxAncho: w - 24 })}</g>`;
  });
  return s + '</svg>';
};

G['lista-checklist'] = (e, t) => {
  let s = fondo();
  const n = t.length, h = 54, gap = 20;
  const y0 = 250 - (n * h + (n - 1) * gap) / 2;
  s += `<rect x="110" y="${y0 - 26}" width="580" height="${n * h + (n - 1) * gap + 52}" rx="14" fill="${tinte(e.neutro, 0.9)}"/>`;
  t.forEach((txt, i) => {
    const y = y0 + i * (h + gap);
    s += `<g data-i="${i}"><rect x="135" y="${y}" width="530" height="${h}" rx="10" fill="#fff"/>
      <path d="M158 ${y + h / 2} l10 10 l20 -22" stroke="${e.acento}" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${textoSVG(210, y + h / 2 + 5, txt, { color: GRISES.texto, ancla: 'start', size: 14, maxAncho: 430 })}</g>`;
  });
  return s + '</svg>';
};

G['matriz-2x2'] = (e, t) => {
  let s = fondo();
  const w = 330, h = 180, x0 = 70, y0 = 60;
  const cols = [e.primario, e.secundario, tinte(e.primario, 0.35), tinte(e.secundario, 0.35)];
  t.slice(0, 4).forEach((txt, i) => {
    const x = x0 + (i % 2) * (w + 30), y = y0 + Math.floor(i / 2) * (h + 20);
    s += `<g data-i="${i}">${caja(x, y, w, h, cols[i], 12)}${textoSVG(x + w / 2, y + h / 2 + 5, txt, { color: '#fff', maxAncho: w - 30 })}</g>`;
  });
  return s + '</svg>';
};

G['matriz-eisenhower'] = (e, t) => {
  let s = fondo();
  const w = 330, h = 185, x0 = 70, y0 = 55;
  const etiq = ['Urgente', 'No urgente'];
  etiq.forEach((lab, i) => s += textoSVG(x0 + w / 2 + i * (w + 30), y0 - 22, lab, { color: GRISES.medio, size: 13, peso: 700 }));
  s += textoSVG(38, y0 + h / 2, 'Imp', { color: GRISES.medio, size: 12, peso: 700 });
  const cols = [e.primario, e.secundario, e.acento, tinte(e.neutro, 0.3)];
  t.slice(0, 4).forEach((txt, i) => {
    const x = x0 + (i % 2) * (w + 30), y = y0 + Math.floor(i / 2) * (h + 25);
    s += `<g data-i="${i}">${caja(x, y, w, h, cols[i], 12)}${textoSVG(x + w / 2, y + h / 2 + 5, txt, { color: '#fff', maxAncho: w - 30 })}</g>`;
  });
  return s + '</svg>';
};

// ---------- RELACIONES ----------

G['relacion-radial'] = (e, t) => {
  const n = t.length, cx = 400, cy = 250;
  let s = fondo() + defs();
  s += `<circle cx="${cx}" cy="${cy}" r="62" fill="${e.acento}"/>`;
  s += textoSVG(cx, cy + 5, 'Núcleo', { color: '#fff', size: 15, peso: 700 });
  t.forEach((txt, i) => {
    const ang = (-90 + (360 / n) * i) * Math.PI / 180;
    const x1 = cx + 66 * Math.cos(ang), y1 = cy + 66 * Math.sin(ang);
    const x2 = cx + 158 * Math.cos(ang), y2 = cy + 158 * Math.sin(ang);
    const col = i % 2 === 0 ? e.primario : e.secundario;
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="3" marker-end="url(#punta)"/>`;
    const bx = cx + 218 * Math.cos(ang), by = cy + 218 * Math.sin(ang);
    s += `<g data-i="${i}"><rect x="${bx - 62}" y="${by - 30}" width="124" height="60" rx="12" fill="${tinte(col, 0.85)}" stroke="${col}" stroke-width="2"/>`;
    s += textoSVG(bx, by + 5, txt, { color: GRISES.texto, size: 12, maxAncho: 112 }) + '</g>';
  });
  return s + '</svg>';
};

G['relacion-convergente'] = (e, t) => {
  let s = fondo() + defs();
  const filas = t.length - 1;
  t.slice(0, filas).forEach((txt, i) => {
    const y = 60 + i * (340 / Math.max(1, filas - 1)) - (filas > 1 ? 0 : 0);
    const yy = 55 + i * (330 / Math.max(1, filas));
    const col = i % 2 === 0 ? e.primario : e.secundario;
    s += `<g data-i="${i}">${caja(50, yy, 260, 58, col, 29)}${textoSVG(180, yy + 29 + 5, txt, { color: '#fff', maxAncho: 240 })}</g>`;
    s += `<path d="M310 ${yy + 29} C 420 ${yy + 29}, 480 250, 545 250" fill="none" stroke="${col}" stroke-width="2.5" marker-end="url(#punta)"/>`;
  });
  s += `<g data-i="${t.length - 1}">${caja(550, 190, 200, 120, e.acento, 14)}${textoSVG(650, 250, t[t.length - 1], { color: '#fff', maxAncho: 180 })}</g>`;
  return s + '</svg>';
};

G['relacion-venn-3'] = (e, t) => {
  let s = fondo();
  const t3 = t.slice(0, 3);
  const cols = [e.primario, e.secundario, e.acento];
  const pos = [[330, 190], [470, 190], [400, 310]];
  pos.forEach(([x, y], i) => s += `<circle cx="${x}" cy="${y}" r="105" fill="${cols[i]}" opacity="0.72"/>`);
  pos.forEach(([x, y], i) => {
    if (t3[i]) s += `<g data-i="${i}">` + textoSVG(x, y - 20, t3[i], { color: '#fff', size: 13, maxAncho: 120 }) + '</g>';
  });
  return s + '</svg>';
};

// ---------- LÍNEAS DE TIEMPO ----------

G['tiempo-lineal'] = (e, t) => {
  let s = fondo() + defs();
  const n = t.length, paso = (720 - 40) / (n - 1);
  s += `<line x1="40" y1="250" x2="760" y2="250" stroke="${GRISES.claro}" stroke-width="4"/>`;
  t.forEach((txt, i) => {
    const x = 60 + i * paso;
    const col = i % 2 === 0 ? e.primario : e.secundario;
    s += `<circle cx="${x}" cy="250" r="13" fill="${col}"/>`;
    const arriba = i % 2 === 0;
    const yCaja = arriba ? 130 : 285;
    s += `<line x1="${x}" y1="${arriba ? 237 : 263}" x2="${x}" y2="${arriba ? yCaja + 84 : yCaja}" stroke="${GRISES.claro}" stroke-width="2"/>`;
    s += `<g data-i="${i}">${caja(x - 62, yCaja, 124, 84, tinte(col, arriba ? 0 : 0), 10)}${textoSVG(x, yCaja + 42, txt, { color: '#fff', size: 13, maxAncho: 108 })}</g>`;
  });
  return s + '</svg>';
};

G['tiempo-hitos'] = (e, t) => {
  let s = fondo() + defs();
  const n = t.length, paso = (700 - 30) / (n - 1);
  s += `<line x1="50" y1="250" x2="750" y2="250" stroke="${e.neutro}" stroke-width="3" marker-end="url(#punta)"/>`;
  t.forEach((txt, i) => {
    const x = 65 + i * paso;
    const col = i % 2 === 0 ? e.primario : e.acento;
    const arriba = i % 2 === 0;
    s += `<polygon points="${x},${arriba ? 235 : 265} ${x - 9},${arriba ? 250 : 250} ${x + 9},${arriba ? 250 : 250}" fill="${col}"/>`;
    s += `<circle cx="${x}" cy="250" r="7" fill="#fff" stroke="${col}" stroke-width="3"/>`;
    const yCaja = arriba ? 120 : 300;
    s += `<g data-i="${i}">${caja(x - 58, yCaja, 116, 70, '#fff', 10, col)}${textoSVG(x, yCaja + 35, txt, { color: GRISES.texto, size: 12, maxAncho: 100 })}</g>`;
  });
  return s + '</svg>';
};

// ---------- FLUJOS ----------

G['flujo-decision'] = (e, t) => {
  let s = fondo() + defs();
  s += `<g data-i="0">${caja(310, 40, 180, 60, e.primario, 10)}${textoSVG(400, 70, t[0], { color: '#fff', maxAncho: 160 })}</g>`;
  s += `<line x1="400" y1="100" x2="400" y2="140" stroke="${GRISES.medio}" stroke-width="2.5" marker-end="url(#punta)"/>`;
  s += `<g data-i="1"><polygon points="400,145 520,210 400,275 280,210" fill="${e.acento}"/>${textoSVG(400, 210, t[1], { color: '#fff', size: 13, maxAncho: 180 })}</g>`;
  const ramas = [['Sí', t.slice(2, Math.ceil((t.length - 2) / 2) + 2), 130], ['No', t.slice(Math.ceil((t.length - 2) / 2) + 2), 670]];
  ramas.forEach(([lab, items, x], r) => {
    if (!items.length) return;
    const col = r === 0 ? e.secundario : e.neutro;
    s += `<line x1="${r === 0 ? 280 : 520}" y1="210" x2="${x}" y2="210" stroke="${GRISES.medio}" stroke-width="2.5" marker-end="url(#punta)"/>`;
    s += textoSVG((r === 0 ? 280 : 520) + (r === 0 ? 30 : -30), 195, lab, { color: GRISES.medio, size: 13, peso: 700 });
    items.forEach((txt, i) => {
      const y = 140 + i * 100;
      s += `<g data-i="${2 + (r === 0 ? i : ramas[0][1].length + i)}">${caja(x - 75, y, 150, 70, col, 10)}${textoSVG(x, y + 35, txt, { color: '#fff', size: 12, maxAncho: 134 })}</g>`;
      if (i < items.length - 1) s += `<line x1="${x}" y1="${y + 70}" x2="${x}" y2="${y + 100}" stroke="${GRISES.medio}" stroke-width="2" marker-end="url(#punta)"/>`;
    });
  });
  return s + '</svg>';
};

G['flujo-embudo'] = (e, t) => {
  let s = fondo();
  const n = t.length, h = 62, gap = 14;
  const y0 = 70, Wmax = 560, Wmin = 160;
  t.forEach((txt, i) => {
    const y = y0 + i * (h + gap);
    const w1 = Wmax - ((Wmax - Wmin) / n) * i;
    const w2 = Wmax - ((Wmax - Wmin) / n) * (i + 1);
    const col = tinte(e.primario, i * 0.09);
    s += `<g data-i="${i}"><polygon points="${400 - w1 / 2},${y} ${400 + w1 / 2},${y} ${400 + w2 / 2},${y + h} ${400 - w2 / 2},${y + h}" fill="${col}" stroke="#fff" stroke-width="2"/>`;
    s += textoSVG(400, y + h / 2 + 5, `${i + 1}. ${txt}`, { color: '#fff', size: 14, maxAncho: w2 - 40 }) + '</g>';
  });
  return s + '</svg>';
};

module.exports = { GRISES, G, tinte, textoSVG, caja, flecha, defs, fondo };
