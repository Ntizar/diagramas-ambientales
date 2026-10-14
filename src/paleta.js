// ============================================================
// PALETA — Esquemas de color derivados del manual de identidad
// corporativa (azul, rojo, gris) + variantes ambientales.
// Cada esquema aporta 4 roles: primario / secundario / acento / neutro.
// ============================================================

const ESQUEMAS = [
  { id: 'corporativo', nombre: 'Corporativo',
    primario: '#1A4488', secundario: '#3D6AB5', acento: '#CB1823', neutro: '#57626E' },
  { id: 'azul-pro', nombre: 'Azul profesional',
    primario: '#1A4488', secundario: '#5B84C4', acento: '#8FAE3A', neutro: '#8A94A0' },
  { id: 'verde-eco', nombre: 'Verde sostenible',
    primario: '#2E6E4E', secundario: '#5E9E7E', acento: '#1A4488', neutro: '#6B7A72' },
  { id: 'agua', nombre: 'Azul agua',
    primario: '#1E6091', secundario: '#5FA8D3', acento: '#CB1823', neutro: '#64748B' },
  { id: 'tierra', nombre: 'Tierra y bosque',
    primario: '#5B4A2F', secundario: '#8A7A5A', acento: '#4C7A3D', neutro: '#7D7466' },
  { id: 'energia', nombre: 'Energía limpia',
    primario: '#1A4488', secundario: '#4C7A3D', acento: '#CB1823', neutro: '#57626E' },
  { id: 'atardecer', nombre: 'Atardecer ambiental',
    primario: '#B0532A', secundario: '#D08A56', acento: '#1A4488', neutro: '#8A7462' },
  { id: 'biodiversidad', nombre: 'Biodiversidad',
    primario: '#2C5F2D', secundario: '#97BC62', acento: '#1A4488', neutro: '#71806A' },
  { id: 'oceanico', nombre: 'Oceánico profundo',
    primario: '#0B4F6C', secundario: '#3D8FA8', acento: '#5E9E7E', neutro: '#5F7480' },
  { id: 'monocromo', nombre: 'Monocromo sobrio',
    primario: '#3D4A5C', secundario: '#7B8794', acento: '#1A4488', neutro: '#A6ADB5' },
];

// Mezcla el color hacia blanco (t>0) o negro (t<0)
function tinte(hex, t) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const destino = t >= 0 ? 255 : 0;
  const f = Math.abs(t);
  r = Math.round(r + (destino - r) * f);
  g = Math.round(g + (destino - g) * f);
  b = Math.round(b + (destino - b) * f);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}



// Grises de apoyo
const GRISES = {
  oscuro: '#2B3440',
  texto: '#33404F',
  medio: '#8A94A0',
  claro: '#C9D0D8',
  fondo: '#F2F4F7',
  blanco: '#FFFFFF',
};

function escapar(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function textoSVG(x, y, txt, opts = {}) {
  const { size = 14, peso = 600, color = '#33404F', ancla = 'middle', maxAncho = 140, lineas = null } = opts;
  const parts = [];
  const contenido = lineas || partirTexto(txt, maxAncho, size);
  const altoLinea = size * 1.25;
  const y0 = y - ((contenido.length - 1) * altoLinea) / 2;
  parts.push(`<text x="${x}" y="${y0}" text-anchor="${ancla}" font-family="'Segoe UI', Arial, sans-serif" font-size="${size}" font-weight="${peso}" fill="${color}">`);
  contenido.forEach((l, i) => parts.push(`<tspan x="${x}" dy="${i === 0 ? 0 : altoLinea}">${escapar(l)}</tspan>`));
  parts.push('</text>');
  return parts.join('');
}

function partirTexto(txt, maxAncho, size) {
  const caracteres = Math.max(6, Math.floor(maxAncho / (size * 0.56)));
  const palabras = String(txt).split(/\s+/);
  const lineas = [];
  let actual = '';
  for (const p of palabras) {
    if ((actual + ' ' + p).trim().length <= caracteres) {
      actual = (actual + ' ' + p).trim();
    } else {
      if (actual) lineas.push(actual);
      actual = p;
    }
  }
  if (actual) lineas.push(actual);
  return lineas.slice(0, 4);
}

// Categorías y tipos de diagrama
const CATEGORIAS_DIAGRAMA = [
  'Procesos', 'Ciclos', 'Comparativas', 'Jerarquías',
  'Listas y matrices', 'Relaciones', 'Líneas de tiempo', 'Flujos',
];

const TIPOS_DIAGRAMA = [
  { id: 'proceso-flechas', nombre: 'Proceso en flechas', cat: 'Procesos', pasos: 5 },
  { id: 'proceso-chevrons', nombre: 'Chevrones apilados', cat: 'Procesos', pasos: 5 },
  { id: 'proceso-escalera', nombre: 'Escalera ascendente', cat: 'Procesos', pasos: 4 },
  { id: 'proceso-serpiente', nombre: 'Proceso serpiente', cat: 'Procesos', pasos: 6 },
  { id: 'proceso-pilares', nombre: 'Pilares del proceso', cat: 'Procesos', pasos: 4 },
  { id: 'ciclo-4', nombre: 'Ciclo de 4 fases', cat: 'Ciclos', pasos: 4 },
  { id: 'ciclo-6', nombre: 'Ciclo de mejora continua', cat: 'Ciclos', pasos: 6 },
  { id: 'ciclo-segmentos', nombre: 'Ciclo de segmentos', cat: 'Ciclos', pasos: 5 },
  { id: 'ciclo-orbital', nombre: 'Órbita central', cat: 'Ciclos', pasos: 5 },
  { id: 'ciclo-espiral', nombre: 'Espiral de evolución', cat: 'Ciclos', pasos: 5 },
  { id: 'comparativa-2col', nombre: 'Comparativa dos columnas', cat: 'Comparativas', pasos: 4 },
  { id: 'comparativa-vs', nombre: 'Enfrentamiento VS', cat: 'Comparativas', pasos: 4 },
  { id: 'comparativa-bascula', nombre: 'Báscula de decisiones', cat: 'Comparativas', pasos: 4 },
  { id: 'comparativa-solapes', nombre: 'Diagrama de solapes', cat: 'Comparativas', pasos: 3 },
  { id: 'piramide-4', nombre: 'Pirámide de niveles', cat: 'Jerarquías', pasos: 4 },
  { id: 'piramide-invertida', nombre: 'Pirámide invertida', cat: 'Jerarquías', pasos: 4 },
  { id: 'jerarquia-organica', nombre: 'Organigrama', cat: 'Jerarquías', pasos: 5 },
  { id: 'jerarquia-arbol', nombre: 'Árbol de decisiones', cat: 'Jerarquías', pasos: 6 },
  { id: 'lista-vertical', nombre: 'Lista vertical numerada', cat: 'Listas y matrices', pasos: 6 },
  { id: 'lista-tarjetas', nombre: 'Tarjetas en cuadrícula', cat: 'Listas y matrices', pasos: 6 },
  { id: 'lista-checklist', nombre: 'Lista de verificación', cat: 'Listas y matrices', pasos: 5 },
  { id: 'matriz-2x2', nombre: 'Matriz 2×2', cat: 'Listas y matrices', pasos: 4 },
  { id: 'matriz-eisenhower', nombre: 'Matriz de prioridades', cat: 'Listas y matrices', pasos: 4 },
  { id: 'relacion-radial', nombre: 'Radial central', cat: 'Relaciones', pasos: 6 },
  { id: 'relacion-convergente', nombre: 'Convergencia a objetivo', cat: 'Relaciones', pasos: 5 },
  { id: 'relacion-venn-3', nombre: 'Triple intersección', cat: 'Relaciones', pasos: 3 },
  { id: 'tiempo-lineal', nombre: 'Línea de tiempo', cat: 'Líneas de tiempo', pasos: 6 },
  { id: 'tiempo-hitos', nombre: 'Hitos alternados', cat: 'Líneas de tiempo', pasos: 6 },
  { id: 'flujo-decision', nombre: 'Flujo con decisión', cat: 'Flujos', pasos: 5 },
  { id: 'flujo-embudo', nombre: 'Embudo de fases', cat: 'Flujos', pasos: 5 },
];

const TEXTOS_DEFAULT = [
  'Identificación', 'Análisis', 'Diagnóstico', 'Planificación',
  'Implantación', 'Seguimiento', 'Evaluación', 'Mejora continua',
];

function textosDefault(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(TEXTOS_DEFAULT[i % TEXTOS_DEFAULT.length]);
  return out;
}

module.exports = { ESQUEMAS, GRISES, CATEGORIAS_DIAGRAMA, TIPOS_DIAGRAMA, textosDefault, tinte, textoSVG, escapar, partirTexto };
