# Cuadros — editor de diagramas y logos

Editor tipo Canva para crear **cuadros personalizados** (estilo SmartArt de Word, pero libre) con **logos ambientales** integrados. Todo en el navegador, sin instalar nada, sin conexión.

## Qué es

Un lienzo donde colocas bloques arrastrando desde el panel izquierdo:

- **Texto**: título, subtítulo, párrafo
- **Visuales**: paso numerado (estilo informe ejecutivo), caja de color, KPI/dato, lista
- **Logos**: 30 iconos ambientales (árbol, carretera, turbina, gota, ave…) en 10 paletas de color

Cada elemento se **mueve, redimensiona y edita** individualmente: texto, tamaño, color y paleta desde el panel de propiedades.

## Plantillas incluidas

- **Proceso** — pasos numerados estilo informe (01, 02, 03…) con logo y caja de resultado
- **Comparativa** — antes/después con cajas roja/verde, KPI y lista de ventajas
- **Resumen ejecutivo** — 3 KPIs + bloques numerados + logo

## Exportación

- **PNG** (2× resolución, listo para pegar en Word/PowerPoint)
- **SVG** vectorial

## Estilo

Limpio corporativo (blanco, Inter, azul #2563eb): sin tarjetas con icono+texto que delatan diseño automático. Bloques numerados, listas con filete y cajas con borde lateral — el patrón de los informes consultoría.

## Desarrollo

```bash
node scripts/verificar.js         # 30 logos × 10 esquemas renderizan
node scripts/verificar-higiene.js # sin CDN ni nombres de terceros
node scripts/compilar.js          # regenerar index.html tras editar src/
```

Estructura:

```
src/paleta.js              10 esquemas de color
src/generadores.js         30 dibujos de logos
src/catalogo-estilos.js    Piel de los logos (plano/línea/duotono/degradado/insignia)
src/catalogo.js            Catálogo de conceptos y render de logos
src/app-ui.html            El editor (lienzo, bloques, propiedades, export)
scripts/compilar.js        Genera index.html autocontenido
```

## Publicación

GitHub Pages desde main. GitHub Actions verifica el catálogo en cada push.

---

Herramienta de creación de cuadros para documentación ambiental. Sin conexión, sin datos.
