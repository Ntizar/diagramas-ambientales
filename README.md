# Diagramas Ambientales

Catálogo de **300 plantillas de diagramas** para informes y presentaciones de medio ambiente. Funciona 100 % en el navegador, sin instalar nada, sin conexión.

## Qué es

Una galería de diagramas tipo SmartArt (procesos, ciclos, comparativas, jerarquías, matrices, líneas de tiempo, flujos) con una paleta cromática corporativa sobria y temática ambiental.

## Cómo se usa

1. Abre `index.html` (doble clic) o la web publicada.
2. Busca o filtra por categoría, número de elementos o esquema de color.
3. Haz clic en una plantilla → se abre el editor.
4. Cambia los textos, el número de elementos o el esquema.
5. **Descarga PNG** (alta resolución, listo para pegar en Word/PowerPoint), **descarga SVG** (vectorial, escalable sin pérdida) o **copia al portapapeles** y pega directamente.

## Esquemas de color

10 esquemas derivados de una paleta corporativa sobria (azul, rojo, gris) con variantes ambientales (verde sostenible, azul agua, tierra y bosque, biodiversidad…).

## Categorías

| Categoría | Tipos |
|---|---|
| Procesos | Flechas, chevrones, escalera, serpiente, pilares |
| Ciclos | 4 fases, mejora continua, segmentos, órbita, espiral |
| Comparativas | Dos columnas, VS, báscula, solapes |
| Jerarquías | Pirámide, pirámide invertida, organigrama, árbol |
| Listas y matrices | Lista numerada, tarjetas, checklist, matriz 2×2, prioridades |
| Relaciones | Radial, convergente, triple intersección |
| Líneas de tiempo | Lineal, hitos alternados |
| Flujos | Con decisión, embudo |

## Desarrollo

```bash
# Verificar que las 300 plantillas renderizan (Node)
node scripts/verificar.js

# Regenerar index.html tras editar src/
node scripts/compilar.js
```

Estructura:

```
src/paleta.js        Esquemas de color, tipos de diagrama, helpers SVG
src/generadores.js   Los 30 generadores de diagramas
src/catalogo.js      Índice de las 300 combinaciones
src/app-ui.html      Interfaz (plantilla del HTML final)
scripts/compilar.js  Genera index.html autocontenido
scripts/verificar.js Prueba de humo: 300 renders sin fallos
```

## Publicación

El sitio se publica en GitHub Pages desde `main`. GitHub Actions verifica el catálogo en cada push.

---

Herramienta de diagramación para documentación ambiental. Funciona sin conexión y sin recoger ningún dato.
