# Logos Ambientales

Catálogo de **300 logotipos vectoriales** con temática de medio ambiente: naturaleza, agua, energía, movilidad, fauna y territorio. Funciona 100 % en el navegador, sin instalar nada, sin conexión.

## Qué es

30 conceptos (árbol, carretera, montaña, aerogenerador, gota, ave, bicicleta…) × 2 composiciones × 5 estilos de diseño (Plano, Línea, Duotono, Degradado, Insignia), cada uno con un esquema de color distinto. Todos los dibujos son únicos: el catálogo se verifica automáticamente para que no haya repeticiones.

## Cómo se usa

1. Abre index.html (doble clic) o la web publicada.
2. Busca o filtra por categoría, estilo o paleta de color.
3. Haz clic en un logo → se abre el editor.
4. Elige color, fondo (transparente, blanco, gris, azul oscuro) y tamaño de exportación.
5. Descarga PNG (hasta 2048 px), SVG vectorial o copia la imagen al portapapeles.

## Paletas de color

10 esquemas: Corporativo, Azul profesional, Verde sostenible, Azul agua, Tierra y bosque, Energía limpia, Atardecer ambiental, Biodiversidad, Oceánico profundo y Monocromo sobrio.

## Categorías

| Categoría | Conceptos |
|---|---|
| Naturaleza | Árbol, pino, hoja, brote, flor, bosque |
| Agua | Gota, olas |
| Energía | Aerogenerador, panel solar, hidráulica, geotermia, energía limpia |
| Movilidad | Carretera, camino, puente, sendero, bicicleta, transporte público |
| Fauna | Ave, pez, huella, polinización |
| Territorio | Montaña, reciclaje, planeta, ciudad verde, calidad del aire, paisaje, orientación |

## Desarrollo

```bash
node scripts/verificar.js         # 300 logos únicos, render sin fallos, cuotas equilibradas
node scripts/verificar-bundle.js  # el bundle embebido ejecuta y renderiza
node scripts/verificar-higiene.js # sin CDN ni nombres de terceros
node scripts/compilar.js          # regenerar index.html tras editar src/
```

Estructura:

```
src/paleta.js        10 esquemas de color y helpers
src/generadores.js   Los 30 dibujos geométricos
src/catalogo.js      Estilos, selección de 300 y render
src/app-ui.html      Interfaz (plantilla del HTML final)
scripts/compilar.js  Genera index.html autocontenido
```

## Publicación

GitHub Pages desde main. GitHub Actions verifica el catálogo en cada push.

---

Herramienta de logotipos para proyectos de medio ambiente. Sin conexión, sin datos.
