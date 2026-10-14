// ============================================================
// ESTILOS DE LOGO — piel (plano/línea/duotono/degradado/insignia)
// aplicada sobre los dibujos geométricos mediante clases CSS.
// ============================================================

const { tinte } = require('./paleta');

function cssEstilo(estiloId, esq, uid) {
  const { primario, secundario, acento, neutro } = esq;
  if (estiloId === 'plano') {
    return `.c1{fill:${primario}}.c2{fill:${secundario}}.c3{fill:${acento}}.c4{fill:${neutro}}
      .st1{fill:none;stroke:${primario}}.st2{fill:none;stroke:${secundario}}.st3{fill:none;stroke:${acento}}.st4{fill:none;stroke:${neutro}}
      .f{fill:#fff}.fw{fill:none;stroke:#fff}`;
  }
  if (estiloId === 'linea') {
    return `.c1{fill:${tinte(primario, 0.92)}}.c2{fill:${tinte(secundario, 0.92)}}.c3{fill:${tinte(acento, 0.85)}}.c4{fill:${tinte(neutro, 0.9)}}
      .st1{fill:none;stroke:${primario};stroke-linecap:round;stroke-linejoin:round}.st2{fill:none;stroke:${secundario};stroke-linecap:round;stroke-linejoin:round}
      .st3{fill:none;stroke:${acento};stroke-linecap:round}.st4{fill:none;stroke:${neutro};stroke-linecap:round}
      .f{fill:#fff}.fw{fill:none;stroke:${primario}}`;
  }
  if (estiloId === 'duotono') {
    return `.c1{fill:${primario}}.c2{fill:${tinte(primario, 0.55)}}.c3{fill:${secundario}}.c4{fill:${tinte(primario, 0.78)}}
      .st1{fill:none;stroke:${primario}}.st2{fill:none;stroke:${tinte(primario, 0.4)}}.st3{fill:none;stroke:${secundario}}.st4{fill:none;stroke:${tinte(primario, 0.25)}}
      .f{fill:#fff}.fw{fill:none;stroke:#fff}`;
  }
  if (estiloId === 'degradado') {
    return `.c1{fill:url(#gr${uid})}.c2{fill:url(#gr${uid})}.c3{fill:${acento}}.c4{fill:${tinte(primario, 0.35)}}
      .st1{fill:none;stroke:url(#gr${uid})}.st2{fill:none;stroke:url(#gr${uid})}.st3{fill:none;stroke:${acento}}.st4{fill:none;stroke:${tinte(primario, 0.35)}}
      .f{fill:#fff}.fw{fill:none;stroke:#fff}`;
  }
  // insignia
  return `.c1{fill:#fff}.c2{fill:${tinte(secundario, 0.78)}}.c3{fill:${acento}}.c4{fill:${tinte(primario, 0.3)}}
    .st1{fill:none;stroke:${primario}}.st2{fill:none;stroke:${secundario};stroke-linecap:round}.st3{fill:none;stroke:${acento}}.st4{fill:none;stroke:${primario}}
    .f{fill:${primario}}.fw{fill:none;stroke:${primario}}`;
}

function defsEstilo(estiloId, esq, uid) {
  if (estiloId !== 'degradado') return '';
  return `<defs><linearGradient id="gr${uid}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${esq.primario}"/><stop offset="1" stop-color="${esq.secundario}"/>
  </linearGradient></defs>`;
}

function fondoEstilo(estiloId, esq, uid) {
  if (estiloId === 'insignia') {
    return `<circle cx="256" cy="256" r="242" fill="${esq.primario}"/><circle cx="256" cy="256" r="212" fill="none" stroke="${esq.acento}" stroke-width="6"/>`;
  }
  return '';
}

module.exports = { cssEstilo, defsEstilo, fondoEstilo };
