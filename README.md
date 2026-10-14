# Diagramas y Logos Ambientales

Herramienta para crear **cuadros y esquemas a tu medida** para documentación de medio ambiente: 50 diagramas editables (tipo SmartArt) + 50 logotipos, con posibilidad de **incrustar el logo dentro del diagrama**. Todo en el navegador, sin instalar nada, sin conexión.

## Qué hay

- **50 diagramas**: procesos, ciclos, comparativas, jerarquías, listas y matrices, relaciones, líneas de tiempo y flujos. Textos y número de elementos editables.
- **50 logos**: 30 conceptos ambientales (árbol, carretera, montaña, aerogenerador, gota, ave, bicicleta…) en 5 estilos de diseño (Plano, Línea, Duotono, Degradado, Insignia) y 2 composiciones.
- **Incrustación**: en los diagramas de ciclo, orbital, radial y Venn puedes colocar un logo en el centro (sobre disco blanco, con buen contraste).
- **10 paletas de color** derivadas de una identidad corporativa sobria (azul, rojo, gris) con variantes ambientales. Cambiables en vivo desde el editor.

## Cómo se usa

1. Abre index.html (doble clic) o la web publicada.
2. Elige pestaña: Diagramas o Logos. Busca o filtra por categoría y color.
3. Haz clic en una plantilla → se abre el editor.
4. Diagramas: cambia los textos, el número de elementos, el color y (si quieres) el logo del centro.
5. Logos: cambia el color y el fondo.
6. Descarga PNG (hasta 3200 px), SVG vectorial o copia la imagen al portapapeles.

## Desarrollo

```bash
node scripts/verificar.js         # 50+50 items, render sin fallos, incrustación OK
node scripts/verificar-bundle.js  # el bundle embebido ejecuta y renderiza
node scripts/verificar-higiene.js # sin CDN ni nombres de terceros
node scripts/compilar.js          # regenerar index.html tras editar src/
```

Estructura:

```
src/paleta.js        10 esquemas de color, helpers de texto SVG
src/smartart.js      30 generadores de diagramas
src/generadores.js   30 dibujos geométricos de logos
src/catalogo.js      Estilos, catálogo unificado (50+50) y render
src/app-ui.html      Interfaz (plantilla del HTML final)
scripts/compilar.js  Genera index.html autocontenido
```

## Publicación

GitHub Pages desde main. GitHub Actions verifica el catálogo en cada push.

---

Herramienta de diagramación para documentación ambiental. Sin conexión, sin datos.
