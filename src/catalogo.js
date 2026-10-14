// ============================================================
// ÍNDICE DEL CATÁLOGO — 30 tipos × 10 esquemas = 300 plantillas
// ============================================================
const { ESQUEMAS, CATEGORIAS, TIPOS, textosDefault } = require('./paleta');
const { G } = require('./generadores');

const CATALOGO = [];
for (const tipo of TIPOS) {
  for (const esq of ESQUEMAS) {
    CATALOGO.push({
      id: `${tipo.id}__${esq.id}`,
      tipo: tipo.id,
      nombreTipo: tipo.nombre,
      categoria: tipo.cat,
      esquema: esq.id,
      nombreEsquema: esq.nombre,
      pasos: tipo.pasos,
      textos: textosDefault(tipo.pasos),
    });
  }
}

function render(plantilla) {
  const esq = ESQUEMAS.find(e => e.id === plantilla.esquema);
  const gen = G[plantilla.tipo];
  if (!esq) throw new Error(`Esquema desconocido: ${plantilla.esquema}`);
  if (!gen) throw new Error(`Generador desconocido: ${plantilla.tipo}`);
  const body = gen(esq, plantilla.textos);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">` + body;
}

module.exports = { CATALOGO, render };
