// ============================================================
// GENERADORES DE LOGOS — 30 conceptos ambientales en SVG 512×512.
// Cada generador: (esquema, variante, uid) → cuerpo SVG.
// Colores por CLASES (.c1..c4 relleno, .st1..st4 trazo, .f blanco)
// para que el estilo (plano/línea/duotono/degradado/insignia)
// se aplique desde catálogo.js sin tocar el dibujo.
// ============================================================

const G = {};

// 1. Árbol copudo
G['arbol'] = (e, v, uid) => {
  let s = '';
  if (v === 1) s += `<circle cx="330" cy="180" r="60" class="c2"/>`;
  s += `<rect x="242" y="270" width="28" height="110" rx="10" class="c4"/>`;
  s += `<circle cx="256" cy="200" r="95" class="c1"/>`;
  s += `<circle cx="200" cy="250" r="55" class="c2"/>`;
  s += `<circle cx="315" cy="245" r="52" class="c2"/>`;
  s += `<circle cx="310" cy="160" r="16" class="c3"/>`;
  s += `<path d="M130 392 Q256 366 382 392" class="st4" stroke-width="12"/>`;
  return s;
};

// 2. Pino
G['pino'] = (e, v, uid) => {
  let s = `<polygon points="256,86 168,214 344,214" class="c1"/>
  <polygon points="256,150 148,296 364,296" class="c1"/>
  <polygon points="256,216 128,384 384,384" class="c2"/>
  <rect x="240" y="378" width="32" height="56" rx="8" class="c4"/>`;
  if (v === 1) s += `<circle cx="404" cy="120" r="26" class="c3"/>`;
  return s;
};

// 3. Hoja
G['hoja'] = (e, v, uid) => {
  let s = `<path d="M256 108 C168 152 152 288 256 404 C360 288 344 152 256 108 Z" class="c1"/>
  <path d="M256 140 L256 380" class="fw" stroke-width="8"/>
  <path d="M256 210 L320 176 M256 270 L318 238 M256 210 L192 176 M256 270 L194 238" class="fw" stroke-width="6"/>`;
  if (v === 1) s += `<circle cx="392" cy="120" r="24" class="c3"/>`;
  return s;
};

// 4. Montaña
G['montana'] = (e, v, uid) => {
  let s = `<polygon points="84,368 206,182 328,368" class="c2"/>
  <polygon points="204,368 328,150 452,368" class="c1"/>
  <polygon points="304,182 328,150 352,182 336,196 316,182" class="f"/>
  <circle cx="118" cy="132" r="34" class="c3"/>
  <path d="M64 368 L448 368" class="st4" stroke-width="12"/>`;
  if (v === 1) { s = s.replace('circle cx="118" cy="132" r="34" class="c3"', 'path d="M118 108 A30 30 0 1 0 148 146 A38 38 0 0 1 118 108 Z" class="c3"'); }
  return s;
};

// 5. Carretera
G['carretera'] = (e, v, uid) => {
  let s = `<polygon points="196,84 316,84 448,428 64,428" class="c4"/>
  <path d="M256 128 L256 412" class="fw" stroke-width="14" stroke-dasharray="34 30"/>
  <polygon points="128,84 156,84 148,116 136,116" class="c3"/>
  <polygon points="356,84 384,84 376,116 364,116" class="c3"/>
  <circle cx="76" cy="60" r="24" class="c3" opacity="0.001"/>`;
  if (v === 1) s = s.replace('opacity="0.001"', '') + `<path d="M64 428 L448 428" class="st2" stroke-width="10"/>`;
  return s;
};

// 6. Camino serpenteante
G['camino'] = (e, v, uid) => {
  let s = `<path d="M120 436 C120 330 392 350 392 252 C392 158 130 180 150 76" class="st4" stroke-width="52"/>
  <path d="M120 436 C120 330 392 350 392 252 C392 158 130 180 150 76" class="fw" stroke-width="9" stroke-dasharray="22 20"/>
  <circle cx="418" cy="90" r="30" class="c3"/>`;
  if (v === 1) s += `<circle cx="86" cy="120" r="22" class="c2"/>`;
  return s;
};

// 7. Puente
G['puente'] = (e, v, uid) => {
  let s = `<path d="M112 262 Q256 116 400 262" class="st1" stroke-width="18"/>
  <rect x="84" y="252" width="344" height="20" rx="10" class="c1"/>
  <path d="M176 258 L176 216 M256 208 L256 216 M336 258 L336 216" class="st1" stroke-width="9"/>
  <path d="M120 330 q22 -18 44 0 t44 0 t44 0 t44 0 t44 0" class="st2" stroke-width="10"/>
  <path d="M150 372 q22 -18 44 0 t44 0 t44 0 t44 0" class="st2" stroke-width="10"/>`;
  if (v === 1) s += `<circle cx="404" cy="120" r="24" class="c3"/>`;
  return s;
};

// 8. Aerogenerador
G['turbina'] = (e, v, uid) => {
  let s = `<polygon points="248,248 264,248 274,428 238,428" class="c4"/>
  <g class="c2"><path d="M256 234 L263 104 L249 104 Z"/><path d="M256 234 L263 104 L249 104 Z" transform="rotate(120 256 240)"/><path d="M256 234 L263 104 L249 104 Z" transform="rotate(240 256 240)"/></g>
  <circle cx="256" cy="240" r="16" class="c1"/>
  <path d="M128 428 L384 428" class="st4" stroke-width="12"/>`;
  if (v === 1) s += `<g transform="translate(120 -40) scale(0.55)"><polygon points="248,248 264,248 274,428 238,428" class="c4"/><g class="c2"><path d="M256 234 L263 104 L249 104 Z"/><path d="M256 234 L263 104 L249 104 Z" transform="rotate(120 256 240)"/><path d="M256 234 L263 104 L249 104 Z" transform="rotate(240 256 240)"/></g><circle cx="256" cy="240" r="16" class="c1"/></g>`;
  return s;
};

// 9. Panel solar
G['panel-solar'] = (e, v, uid) => {
  let s = `<polygon points="130,280 306,280 348,384 88,384" class="c1"/>
  <path d="M187 280 L172 384 M249 280 L249 384 M293 280 L330 384 M109 332 L327 332" class="fw" stroke-width="6"/>
  <path d="M218 384 L218 424" class="st4" stroke-width="12"/>
  <circle cx="392" cy="140" r="38" class="c3"/>
  <path d="M392 76 L392 58 M442 96 L456 82 M448 140 L468 140 M442 184 L456 198" class="st3" stroke-width="9"/>`;
  if (v === 1) s = s.replace('392 76 L392 58 M442 96 L456 82 M448 140 L468 140 M442 184 L456 198', '');
  return s;
};

// 10. Gota
G['gota'] = (e, v, uid) => {
  let s = `<path d="M256 88 C204 184 152 244 152 316 a104 104 0 0 0 208 0 C360 244 308 184 256 88 Z" class="c1"/>
  <path d="M256 196 C226 248 208 274 208 310 a48 48 0 0 0 96 0 C304 274 286 248 256 196 Z" class="c2"/>`;
  if (v === 1) s += `<path d="M392 140 C366 166 352 186 352 208 a40 40 0 0 0 80 0 C432 186 418 166 392 140 Z" class="c3"/>`;
  return s;
};

// 11. Olas
G['olas'] = (e, v, uid) => {
  const sol = v === 1 ? '' : `<circle cx="400" cy="118" r="30" class="c3"/>\n  `;
  return `${sol}<path d="M64 210 q32 -34 64 0 t64 0 t64 0 t64 0 t64 0" class="st2" stroke-width="18"/>
  <path d="M64 290 q32 -34 64 0 t64 0 t64 0 t64 0 t64 0" class="st1" stroke-width="18"/>
  <path d="M64 370 q32 -34 64 0 t64 0 t64 0 t64 0 t64 0" class="st2" stroke-width="18"/>`;
};

// 12. Reciclaje
G['reciclaje'] = (e, v, uid) => {
  // cada segmento: arco de 100° + punta triangular alineada con la tangente
  const seg = (rot, cls, fillCls) => `<g transform="rotate(${rot} 256 256)">
    <path d="M196 130 A116 116 0 0 1 334 178" class="${cls}" stroke-width="24"/>
    <polygon points="302,132 372,164 306,222" class="${fillCls}"/>
  </g>`;
  const orden = v === 1 ? [['st1','c1'],['st2','c2'],['st3','c3']] : [['st2','c2'],['st3','c3'],['st1','c1']];
  return orden.map((p, i) => seg(i * 120, p[0], p[1])).join('');
};

// 13. Planeta
G['planeta'] = (e, v, uid) => {
  const sol = v === 1 ? `<path d="M404 108 C382 130 370 148 370 166 a34 34 0 0 0 68 0 C438 148 426 130 404 108 Z" class="c3"/>` : '';
  // anillo trasero (mitad superior, detrás del planeta)
  const anilloDetras = `<path d="M96 244 A160 56 -18 0 1 416 214" class="st3" stroke-width="9"/>`;
  const globo = `<circle cx="256" cy="256" r="118" class="c2"/>
  <ellipse cx="216" cy="226" rx="54" ry="30" class="c1" transform="rotate(-18 216 226)"/>
  <ellipse cx="298" cy="304" rx="44" ry="24" class="c1" transform="rotate(12 298 304)"/>`;
  // anillo delantero (mitad inferior, delante)
  const anilloDelante = `<path d="M416 214 A160 56 -18 0 1 96 244" class="st3" stroke-width="9"/>`;
  return sol + anilloDetras + globo + anilloDelante;
};

// 14. Brote
G['brote'] = (e, v, uid) => {
  let s = `<path d="M256 392 C256 310 252 280 256 224" class="st1" stroke-width="14"/>
  <path d="M256 268 C204 264 180 212 176 164 C230 170 252 214 256 268 Z" class="c2"/>
  <path d="M256 268 C308 264 332 212 336 164 C282 170 260 214 256 268 Z" class="c1"/>
  <path d="M136 396 Q256 356 376 396 L376 416 L136 416 Z" class="c4"/>`;
  if (v === 1) s += `<circle cx="404" cy="112" r="26" class="c3"/>`;
  return s;
};

// 15. Flor
G['flor'] = (e, v, uid) => {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const cls = i % 2 === 0 ? 'c1' : 'c2';
    s += `<ellipse cx="256" cy="160" rx="36" ry="72" class="${cls}" transform="rotate(${i * 72} 256 256)"/>`;
  }
  s += `<circle cx="256" cy="256" r="42" class="c3"/>`;
  if (v === 1) s += `<path d="M256 298 L256 428" class="st1" stroke-width="12"/><path d="M256 380 C220 376 204 344 200 314 C236 318 252 348 256 380 Z" class="c2"/>`;
  return s;
};

// 16. Ave
G['ave'] = (e, v, uid) => {
  let s = `<path d="M256 292 C210 216 140 210 84 250 C140 262 190 282 256 292 Z" class="c2"/>
  <path d="M256 292 C302 216 372 210 428 250 C372 262 322 282 256 292 Z" class="c1"/>
  <ellipse cx="256" cy="306" rx="56" ry="30" class="c1"/>
  <polygon points="306,296 344,306 306,318" class="c3"/>
  <circle cx="292" cy="296" r="7" class="f"/>`;
  if (v === 1) s += `<path d="M96 168 q18 -14 36 0 M132 190 q18 -14 36 0" class="st2" stroke-width="8"/>`;
  else s += `<circle cx="112" cy="132" r="30" class="c3"/>`;
  return s;
};

// 17. Pez
G['pez'] = (e, v, uid) => {
  let s = `<path d="M132 262 C176 192 316 192 376 262 C316 332 176 332 132 262 Z" class="c1"/>
  <polygon points="376,262 442,214 442,310" class="c2"/>
  <circle cx="188" cy="244" r="11" class="f"/>
  <path d="M232 262 q24 -20 48 0 q-24 20 -48 0 Z" class="c2"/>`;
  if (v === 1) s += `<circle cx="416" cy="130" r="10" class="c3"/><circle cx="440" cy="98" r="6" class="c3"/>`;
  return s;
};

// 18. Bosque
G['bosque'] = (e, v, uid) => {
  let s = `<polygon points="140,196 84,300 196,300" class="c2"/>
  <rect x="130" y="296" width="20" height="44" rx="6" class="c4"/>
  <polygon points="256,120 176,292 336,292" class="c1"/>
  <rect x="242" y="288" width="28" height="52" rx="8" class="c4"/>
  <circle cx="386" cy="248" r="56" class="c2"/>
  <rect x="374" y="296" width="24" height="44" rx="6" class="c4"/>
  <path d="M84 388 L428 388" class="st4" stroke-width="12"/>`;
  if (v === 1) s += `<circle cx="66" cy="110" r="24" class="c3"/>`;
  return s;
};

// 19. Sendero
G['sendero'] = (e, v, uid) => {
  let s = `<path d="M40 330 Q152 186 282 330 Z" class="c2"/>
  <path d="M236 330 Q366 200 474 330 Z" class="c1"/>
  <circle cx="416" cy="130" r="30" class="c3"/>
  <polygon points="232,330 280,330 330,432 182,432" class="c4"/>`;
  if (v === 1) s = s.replace('416 130', '150 130') + `<path d="M60 432 L452 432" class="st4" stroke-width="10"/>`;
  return s;
};

// 20. Ciudad verde
G['ciudad-verde'] = (e, v, uid) => {
  let s = `<rect x="122" y="228" width="72" height="180" rx="8" class="c1"/>
  <rect x="216" y="168" width="84" height="240" rx="8" class="c2"/>
  <rect x="322" y="258" width="64" height="150" rx="8" class="c1"/>
  <rect x="140" y="252" width="16" height="16" rx="3" class="f"/><rect x="164" y="252" width="16" height="16" rx="3" class="f"/><rect x="140" y="286" width="16" height="16" rx="3" class="f"/><rect x="238" y="196" width="18" height="18" rx="3" class="f"/><rect x="266" y="196" width="18" height="18" rx="3" class="f"/><rect x="238" y="232" width="18" height="18" rx="3" class="f"/>
  <circle cx="92" cy="382" r="28" class="c2"/><rect x="84" y="402" width="16" height="26" rx="5" class="c4"/>
  <circle cx="424" cy="384" r="26" class="c2"/><rect x="416" y="402" width="16" height="24" rx="5" class="c4"/>`;
  if (v === 1) s += `<path d="M258 120 C234 144 220 166 220 186 a38 38 0 0 0 76 0 C296 166 282 144 258 120 Z" class="c3"/>`;
  return s;
};

// 21. Calidad del aire
G['aire'] = (e, v, uid) => {
  let s = `<g class="c1"><circle cx="168" cy="258" r="46"/><circle cx="228" cy="222" r="58"/><circle cx="298" cy="252" r="50"/><rect x="146" y="252" width="204" height="56" rx="28"/></g>
  <path d="M384 118 C362 140 350 160 350 180 a34 34 0 0 0 68 0 C418 160 406 140 384 118 Z" class="c2"/>
  <path d="M96 340 q26 -20 52 0 M130 376 q26 -20 52 0" class="st2" stroke-width="10"/>`;
  if (v === 1) s = s.replace('384 118 C362 140 350 160 350 180 a34 34 0 0 0 68 0 C418 160 406 140 384 118 Z', '384 128 C366 146 356 162 356 178 a28 28 0 0 0 56 0 C412 162 402 146 384 128 Z') + `<circle cx="300" cy="330" r="0" class="c3"/>`;
  return s;
};

// 22. Energía hidráulica
G['hidro'] = (e, v, uid) => {
  let s = `<path d="M176 96 Q240 230 196 356 L116 356 Q170 230 146 96 Z" class="c1"/>
  <path d="M226 318 q22 -16 44 0 t44 0 t44 0" class="st2" stroke-width="11"/>
  <path d="M246 364 q22 -16 44 0 t44 0" class="st2" stroke-width="11"/>
  <path d="M368 128 C350 154 338 172 338 192 a30 30 0 0 0 60 0 C398 172 386 154 368 128 Z" class="c3"/>
  <path d="M96 388 L416 388" class="st4" stroke-width="12"/>`;
  if (v === 1) s = s.replace('368 128 C350 154 338 172 338 192 a30 30 0 0 0 60 0 C398 172 386 154 368 128 Z', '300 110 C276 146 262 168 262 192 a38 38 0 0 0 76 0 C338 168 324 146 300 110 Z');
  return s;
};

// 23. Geotermia
G['geotermia'] = (e, v, uid) => {
  let s = `<rect x="104" y="340" width="304" height="16" rx="8" class="c4"/>
  <path d="M186 326 C166 282 204 262 186 214 C172 178 196 152 190 118" class="st1" stroke-width="15"/>
  <path d="M262 326 C242 282 280 262 262 214 C248 178 272 152 266 118" class="st2" stroke-width="15"/>
  <path d="M338 326 C318 282 356 262 338 214 C324 178 348 152 342 118" class="st1" stroke-width="15"/>
  <circle cx="112" cy="140" r="24" class="c3"/>`;
  if (v === 1) s = s.replace('circle cx="112" cy="140" r="24" class="c3"', 'path d="M108 116 C92 142 82 158 82 174 a26 26 0 0 0 52 0 C134 158 124 142 108 116 Z" class="c3"');
  return s;
};

// 24. Bicicleta
G['bici'] = (e, v, uid) => {
  let s = `<circle cx="150" cy="322" r="60" class="st1" stroke-width="12"/>
  <circle cx="366" cy="322" r="60" class="st1" stroke-width="12"/>
  <path d="M150 322 L226 322 L266 232 L330 232 M226 322 L266 232 L366 322 M330 232 L346 190 M334 186 L362 184 M266 232 L254 196 L232 198" class="st2" stroke-width="11"/>
  <circle cx="266" cy="232" r="13" class="c3"/>
  <circle cx="226" cy="322" r="9" class="c3"/>`;
  if (v === 1) s += `<path d="M430 118 C400 150 384 176 384 198 a46 46 0 0 0 92 0 C476 176 460 150 430 118 Z" class="c3"/>`;
  return s;
};

// 25. Transporte público
G['bus'] = (e, v, uid) => {
  let s = `<rect x="104" y="168" width="304" height="164" rx="26" class="c1"/>
  <rect x="128" y="196" width="256" height="58" rx="12" class="f"/>
  <path d="M213 196 L213 254 M298 196 L298 254" class="st1" stroke-width="8"/>
  <circle cx="164" cy="348" r="27" class="c4"/><circle cx="348" cy="348" r="27" class="c4"/>
  <circle cx="382" cy="308" r="11" class="c3"/>
  <path d="M96 396 L416 396" class="st4" stroke-width="11"/>`;
  if (v === 1) s = s.replace('rx="26" class="c1"', 'rx="26" class="c2"') + `<path d="M256 120 L232 168 L276 168 L246 214" class="st3" stroke-width="12"/>`;
  return s;
};

// 26. Energía limpia
G['rayo'] = (e, v, uid) => {
  if (v === 2) {
    // composición B: rayo dentro de círculo con hoja exterior
    return `<circle cx="256" cy="256" r="140" class="c2"/>
    <polygon points="286,140 176,292 244,292 226,404 340,252 272,252" class="c1"/>
    <path d="M404 120 C362 162 340 196 340 226 a64 64 0 0 0 128 0 C468 196 446 162 404 120 Z" class="c3" transform="scale(0.42) translate(560 -80)"/>
    <path d="M420 96 C392 126 376 150 376 170 a44 44 0 0 0 88 0 C464 150 448 126 420 96 Z" class="c3"/>`;
  }
  return `<polygon points="282,72 158,262 236,262 212,428 356,226 276,226" class="c1"/>
  <path d="M380 300 C336 300 308 268 306 228 C354 230 378 262 380 300 Z" class="c2"/>
  <path d="M306 228 C330 244 348 266 356 296" class="fw" stroke-width="7"/>`;
};

// 27. Huella
G['huella'] = (e, v, uid) => {
  let s = `<ellipse cx="186" cy="182" rx="25" ry="34" class="c2" transform="rotate(-14 186 182)"/>
  <ellipse cx="240" cy="152" rx="25" ry="36" class="c2"/>
  <ellipse cx="294" cy="158" rx="25" ry="34" class="c2" transform="rotate(10 294 158)"/>
  <ellipse cx="338" cy="198" rx="22" ry="29" class="c2" transform="rotate(26 338 198)"/>
  <path d="M256 236 C198 236 166 288 178 330 C188 368 228 380 256 372 C284 380 324 368 334 330 C346 288 314 236 256 236 Z" class="c1"/>
  <ellipse cx="222" cy="304" rx="14" ry="18" class="f"/><ellipse cx="290" cy="304" rx="14" ry="18" class="f"/>`;
  if (v === 1) { s = s.replace(/class="c2"/g, 'class="c1"').replace('class="c1"/>', 'class="c2"/>'); }
  return s;
};

// 28. Colmena
G['colmena'] = (e, v, uid) => {
  const panal = `<polygon points="256,120 348,174 348,286 256,340 164,286 164,174" class="c1"/>
  <polygon points="256,160 314,194 314,264 256,298 198,264 198,194" class="st2" stroke-width="9"/>
  <polygon points="256,196 288,215 288,251 256,270 224,251 224,215" class="c2"/>`;
  const abeja = `<g transform="translate(388 122) rotate(${v === 1 ? -12 : 12})">
    <ellipse cx="0" cy="0" rx="26" ry="17" class="c3"/>
    <path d="M-8 -16 L-8 16 M8 -15 L8 15" class="f" stroke-width="5"/>
    <circle cx="-26" cy="-2" r="11" class="c4"/>
    <ellipse cx="-2" cy="-20" rx="14" ry="8" class="f" transform="rotate(-24 -2 -20)"/>
    <ellipse cx="8" cy="-19" rx="12" ry="7" class="f" transform="rotate(10 8 -19)"/>
  </g>`;
  return panal + abeja;
};

// 29. Paisaje en ventana
G['paisaje'] = (e, v, uid) => {
  const anillo = v === 1 ? 'stroke-dasharray="2 26" stroke-linecap="round"' : '';
  return `<defs><clipPath id="cp${uid}"><circle cx="256" cy="256" r="140"/></clipPath></defs>
  <g clip-path="url(#cp${uid})">
    <rect x="106" y="106" width="300" height="300" class="c2"/>
    <circle cx="150" cy="170" r="30" class="c3"/>
    <path d="M106 356 L200 240 L272 356 Z" class="c1"/>
    <path d="M228 356 L318 228 L420 356 L420 396 L228 396 Z" class="c4"/>
    <rect x="106" y="352" width="300" height="60" class="c1"/>
  </g>
  <circle cx="256" cy="256" r="150" class="st1" stroke-width="16" ${anillo}/>`;
};

// 30. Brujula
G['brujula'] = (e, v, uid) => {
  let s = `<circle cx="256" cy="256" r="132" class="st1" stroke-width="15"/>
  <path d="M256 100 L256 126 M256 386 L256 412 M100 256 L126 256 M386 256 L412 256" class="st4" stroke-width="10"/>
  <polygon points="256,136 290,256 222,256" class="c3"/>
  <polygon points="256,376 290,256 222,256" class="c1"/>
  <circle cx="256" cy="256" r="17" class="f"/>
  <circle cx="256" cy="256" r="17" class="st1" stroke-width="8"/>`;
  if (v === 1) s = s.replace('<circle cx="256" cy="256" r="132" class="st1" stroke-width="15"/>', '<circle cx="256" cy="256" r="132" class="st1" stroke-width="15"/><circle cx="256" cy="256" r="96" class="st2" stroke-width="8" stroke-dasharray="4 18"/>');
  return s;
};

module.exports = { G };
