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

module.exports = { ESQUEMAS, tinte };
