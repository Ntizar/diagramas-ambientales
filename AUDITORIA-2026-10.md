# Mega auditoría — SmartArt / diagramas-ambientales

**Fecha:** 2026-10-15 · **Alcance:** `smartart/index.html` (y su fuente `src/`), con nota sobre `index.html` (Cuadros).
**Método:** lectura completa del motor (1.293 líneas de `src/`), cadena de verificación del repo, y medición objetiva en navegador real (Chromium headless + CDP, 13 capturas a 390/1440/1600 px). Nada de "mirar y admirar": los números salen de `getBoundingClientRect`, `getComputedStyle` y `document.scrollingElement`.

---

## 0. Veredicto en una línea

**Las bases son buenas y los cimientos son correctos; lo que falla es la última capa (responsive real, edición de contenido y acabado visual).** El motor es SVG puro, autocontenido, sin CDN, con 7 layouts, tap-para-editar, avisos de recorte y export PNG/SVG/JSON. Eso es un 60% del producto resuelto. El 40% que falta es justo lo que impide usarlo de verdad: **hoy un diagrama no se puede leer en un móvil, y la infografía no se puede rellenar sin tocar código.**

---

## 1. Estado de partida (medido, no supuesto)

| Comprobación | Resultado |
|---|---|
| Cadena de verificación (`compilar` → `verificar` → `smartart` → `bundle` → `higiene`) | ✅ TODO OK, repo limpio |
| Dependencias externas en el HTML publicado | 0 |
| Fuentes web cargadas | **0** (`document.fonts.size === 0`) |
| Tamaño publicado | `index.html` 56,6 KB · `smartart/index.html` 78,7 KB |
| Layouts | 7 (vertical, horizontal, radial, cards, ciclo, concepto, infografía) |

---

## 2. Hallazgo nº1 — **No es responsive: es un zoom-out** (crítico)

No hay ningún layout adaptativo. Cada SVG se genera con **ancho y alto fijos en un `viewBox`** (la infografía, 2240×1132 px) y luego el editor lo **escala** para que quepa en el lienzo (`ajustarZoom`: `k = min(ancho·0,94/vbW, alto·0,88/vbH)`). Escalar un póster no lo hace responsive: **encoge la letra hasta hacerla desaparecer.**

Medido en navegador real (tamaño efectivo del texto = `font-size × escala`):

| Vista | Escala aplicada | Textos < 9 px efectivos | Texto más pequeño |
|---|---|---|---|
| Infografía · móvil 390 | **0,164** | **91 de 91** | **1,72 px** |
| Concepto · móvil 390 | 0,221 | 23 de 23 | 2,65 px |
| Ciclo · móvil 390 | 0,311 | 20 de 20 | 3,73 px |
| Vertical · móvil 390 | 0,470 | 6 de 12 | 5,17 px |
| Infografía · desktop 1600 | 0,671 | **63 de 91** | 7,05 px |
| Ciclo · desktop 1440 | 0,626 | 11 de 20 | 7,51 px |
| Concepto · desktop 1440 | 0,642 | 14 de 23 | 7,70 px |

**Conclusión:** la infografía **no es legible ni en escritorio** (63 de sus 91 textos por debajo de 9 px efectivos), y en móvil es un sello de correos de 1,7 px. La captura de móvil lo confirma: la lámina ocupa una franja abajo y el resto del lienzo es blanco.

**Causa raíz:** el diseño asume que hay 2240 px de ancho disponibles siempre. La infografía reparte SIEMPRE `N` columnas en fila, sea cual sea el destino:

```js
const CW = Math.floor((W - 2*MARGEN - (N-1)*GAP) / N);   // W = 2240 fijo
```

Con 7 pasos → 290 px por tarjeta. Con 12 pasos → 151 px (ilegible). Con 3 pasos → 680 px de tarjeta con letra de 12,5 px (proporción absurda). **La geometría no se adapta ni al número de nodos ni al ancho de destino.**

## 3. Hallazgo nº2 — **La infografía no se puede rellenar** (crítico para "sencillo de modificar")

El modelo de datos de la infografía tiene bandas que **el editor nunca pide y que se clonan siempre del ejemplo**:

```js
// src/smartart-ui.html — cfgMotor(), layout infografia
var ej = EJEMPLOS.infografia;
c.fuentes = clonar(ej.fuentes);       // ← FUENTES: no editables
c.fuentesNota = ej.fuentesNota;       // ← nota de fuentes: no editable
c.notas = clonar(ej.notas);           // ← NOTAS CLAVE: no editables
c.cierre = st.subtitulo;              // ← cierre: compartido con el subtítulo
```

Y los rótulos de banda están **hardcodeados en el motor**: `'FUENTES Y HERRAMIENTAS'` y `'HERRAMIENTAS / INFORMACIÓN'` (repetido en las 7 tarjetas). Consecuencias:

- Si quieres una infografía que no sea la de zonas tranquilas, las fuentes y las notas **se quedan las del ejemplo**, y no hay forma de cambiarlas desde la interfaz.
- El único botón para añadir contenido rico es `prompt()` (sub-elementos), que en móvil es un diálogo nativo del sistema y en algunos navegadores está bloqueado.
- No hay edición masiva: poner 7 títulos + 7 descripciones + 21 sub-elementos = **~40 interacciones** (abrir sheet → escribir → cerrar → tap al siguiente).
- No hay proyectos múltiples: un solo hueco en `localStorage` (clave `smartart`), que se sobrescribe. No hay undo/redo, ni historial, ni plantillas alternativas (1 ejemplo por layout, todos del mismo dominio).

## 4. Hallazgo nº3 — **IDs SVG duplicados: las miniaturas heredan colores ajenos** (bug real, verificado)

Los layouts `ciclo`, `concepto` e `infografía` declaran gradientes con **id fijo** (`cg`, `cbg`, `kbg`, `kg`, `numGrad`, `cierre`) en lugar de un id único por instancia. La galería construye **7 SVG más** en el mismo documento, así que hay ids repetidos:

```
ids duplicados por vista → ciclo: [cg, cglow, cbg] · concepto: [kg, kbg, kglow] · infografía: [cierre, numGrad]
```

En SVG, `url(#cg)` resuelve **al primer elemento con ese id del documento**. Prueba ejecutada: lienzo en `ciclo` con color naranja `#F97316` + galería abierta → `n_cg = 2`, gana el del **lienzo**, y su gradiente es `#F97316`; la miniatura del ciclo (verde en el ejemplo) se pinta con el gradiente del lienzo. **Las miniaturas de la galería mienten sobre su propio color.**

## 5. Hallazgo nº4 — **Móvil: la acción principal queda fuera de pantalla**

La cabecera tiene 5 controles en una fila con `overflow-x:auto` y scrollbar oculta. A 390 px, la captura confirma que se ven `SmartArt.` · `Infografía` · `Nodo` · 🎨 y **`PNG` (acción primaria) y el menú ☰ quedan fuera del viewport, sin ningún indicio visual de que hay más**. Un usuario de móvil no descubre cómo exportar.

## 6. Hallazgo nº5 — **Accesibilidad y tipografía** (medido)

| Punto | Dato |
|---|---|
| Elementos focusables dentro del lienzo | **0** — no se puede editar un nodo con teclado |
| Campos de formulario sin `<label for>` asociado | **7 de 7** |
| `user-scalable=no` en el viewport | **sí** — bloquea el zoom de accesibilidad |
| Fuentes web cargadas | **0** → la tipografía depende de la máquina (`Arial`/`Segoe`); el SVG exportado se ve distinto en cada ordenador |
| `role`/`aria-*` en el lienzo | ninguno |
| Contraste del cuerpo (`#51677C` sobre `#FFF`) | 5,5:1 — cumple AA a 12 px, pero no AAA y va a 11,5 px |

## 7. Hallazgo nº6 — **Deuda técnica concreta**

1. **El tema está implementado 3 veces**: `tema()` en `motor.js`, y colores hardcodeados otra vez en `layouts.js` (ciclo/concepto) y en `infografia.js`. Cambiar un color exige tocarlo en tres sitios; `motor.js` no gobierna nada fuera de sus 4 layouts.
2. **Código muerto**: `const T = M26.render;` en `layouts.js:56` (variable asignada y nunca usada, seguida de un comentario que lo delata); en `concepto()` hay tres variables calculadas (`off`, `px`, `py`) que no se usan en ninguna parte de la fórmula.
3. **Avisos de recorte incompletos**: sólo se muestra el **primero** (`_avisos[0]`), y no señala **dónde** ocurre. El usuario ve "se ha recortado" y no sabe qué nodo.
4. **Export limitado**: PNG 2× y SVG. No hay **PDF** (el formato natural de una lámina institucional), ni SVG con texto convertido a curvas, ni presets A4/A3 para impresión.
5. **`cambiarLayout` pierde contenido** de forma silenciosa en cuanto el layout destino no soporta `desc`/`subs` (avisa con un toast "se ha conservado", pero no es cierto en todos los casos).
6. **`index.html` (Cuadros)** comparte la misma estética genérica de Tailwind-slate (`#f3f4f6`, `blue-600`) y su propia copia del motor: dos apps, dos mundos visuales, cero sistema de diseño.

## 8. Lo que ya está bien (no tocar, mantener)

- **Motor SVG puro, sin dependencias ni CDN**: se publica como fichero único autocontenido. Es la decisión correcta y hay que conservarla.
- **Tap-para-editar sobre el propio lienzo** (con `<rect class="hit" data-i>`): el navegador resuelve la escala, no hay hit-testing manual. Idea excelente.
- **Avisos de recorte**: la rigidez informa en vez de romper el dibujo.
- **Pan/pinch con Pointer Events**, `gesturestart` cancelado, inputs de 16 px, targets ≥44 px: el trabajo móvil ya hecho se nota y se conserva.
- **Export limpio** (quita `.hit` y el hover antes de serializar) y **guardado en `localStorage`**: el esqueleto de persistencia ya existe.
- **Cadena de verificación en CI**: 5 scripts que comprueban de verdad. Es la red de seguridad para todo lo que viene.

---

## 9. Plan de mejora propuesto (por fases, con puerta de aprobación)

### Fase 0 — Higiene y bugs (1 sesión, bajo riesgo)
- IDs únicos por instancia (`${uid}-cg`) → fin de las miniaturas mentirosas.
- Cabecera móvil: acciones primarias siempre visibles (menú real, no scroll oculto).
- Quitar `user-scalable=no`, añadir `label for`, `role="img"` + `aria-label` al SVG, focusables en los nodos.
- Purgar código muerto y unificar el tema en un único módulo (una fuente de verdad de color).
- Aviso de recorte: lista completa + marcado del nodo afectado.

### Fase 1 — Responsive de verdad (el núcleo del encargo)
- **Tres modos de geometría por layout** según el ancho de destino: `compact` (≤600, móvil), `medio` (≤1100), `amplio` (>1100). El SVG se genera distinto, no se encoge el mismo.
- **La infografía pasa a ser un documento, no un póster**: en móvil se renderiza en **flujo vertical por bandas** (cabecera → pasos apilados en tarjetas full-width → fuentes → notas → cierre) y en escritorio/impresión mantiene el formato póster. Es la única manera de que una infografía de 7 pasos se pueda leer en un móvil.
- **Dos lienzos**: el de pantalla (100% del contenedor, editable) y el de exportación (A3/A4, sin recorte). Hoy son el mismo y por eso no cabe nada.
- Regla de aceptación: **ningún texto por debajo de 12 px efectivos** en 390 px, y `scrollWidth === clientWidth` en 320/360/390.

### Fase 2 — "Sencillo de rellenar y modificar"
- **Panel de contenido** con TODAS las bandas editables (título, kicker, intro, fuentes, notas, pasos, cierre, rótulos de sección).
- **Modo texto plano**: pegar el contenido completo (una línea por campo, `-` para listas) y volver. Rellenar una infografía pasa de ~40 toques a 1 pegado.
- **Undo/redo** + **proyectos múltiples** ("Mis infografías") en `localStorage`, con nombre y fecha.
- **Plantillas**: 3-4 ejemplos por layout (zonas tranquilas, informe técnico, proceso genérico, checklist) + **plantilla vacía**.
- **Sin `prompt()`**: chips con input inline. Reordenar nodos y sub-elementos por arrastre.
- Export: añadir **PDF** y presets de impresión; opción "texto → curvas" en SVG.

### Fase 3 — Acabado visual ("más bonito, moderno y universal")
- **Motor**: jerarquía tipográfica real (eyebrow → titular → subtítulo), bloque de **KPIs/datos destacados**, bandas con reglas finas y aire, iconografía consistente, pie de fuentes.
- **Editor**: sistema de diseño de verdad. Dos caminos (decisión pendiente):
  - **(A) Aurora v8.4.2** — coherencia con el ecosistema, tokens, móvil ya resuelto, gratis. La UI del editor hereda el estándar de la casa.
  - **(B) Sistema propio "premium 2026"** — glows, glass, números fantasma (el sabor que ya tiene el motor SVG), pero a coste de mantener otro sistema.
- **Tipografía**: cargar una fuente self-hosted (una sola, `woff2`) o incrustarla en el SVG al exportar, para que el diagrama se vea **idéntico en cualquier máquina** (hoy `document.fonts.size === 0`).
- **Dark mode en la UI del editor** (hoy el diagrama puede ser oscuro pero la app no).

### Fase 4 — Unificación
- Un solo motor y un solo sistema visual para **Cuadros y SmartArt** (hoy son dos apps con dos estéticas y dos copias del motor).

---

## 10. Decisiones que necesito antes de tocar código

1. **Alcance**: ¿solo `smartart` o también `Cuadros` (`index.html`)?
2. **Sistema visual**: ¿Aurora de la casa (A) o sistema propio (B)?
3. **Infografía en móvil**: ¿acepto el cambio de "póster encogido" a "documento vertical legible"? (es la corrección más profunda y la que más se nota).
4. **Prioridad**: ¿Fase 0+1 primero (que se vea y se lea) o el paquete completo?

---

## Anexo B — Reenfoque a «informe para Word» (2026-10-15, decisión del usuario)

**Contexto:** el uso real es **PC** y **pegar la infografía en documentos Word**, hecha por **gente no técnica**. El móvil deja de ser prioridad (queda como «que no se rompa»), el móvil-póster desaparece y **no se usa Aurora** (no es el ecosistema de este producto). Esto cambia el formato objetivo.

### Medido (no estimado)

- **PNG exportado**: 4480×2264 px, 1,2 MB, **sin chunk `pHYs` (DPI)** → Word asume 96 DPI e inserta la imagen a **118,5 cm de ancho**; el usuario tiene que encogerla a mano. Cada PNG exportado hoy es un problema de maquetación para quien lo pega.
- **Letra más pequeña de la infografía** (10,5 px sobre un lienzo de 2240 px): en A4 vertical = **0,80 mm = 2,3 pt** · en A4 apaisado = 3,4 pt. **Ilegible en papel por mucho que se pegue.**
- Para que la letra mínima sea de **9 pt** en A4 vertical, el lienzo lógico tendría que medir **≈8.925 px** de ancho: **hoy hay 4× más densidad horizontal de la que cabe en una página.**
- **7 pasos apilados** con letra de ~9 pt ocupan **240 mm** de los 257 mm útiles de un A4 → **el formato «página» sí cabe** y es el formato correcto.

### Prototipo construido y medido (`docs/prototipo-informe-a4/`)

Página A4 exacta (210×297 mm, todo el `viewBox` en milímetros), una columna, 7 pasos en tarjetas (2 columnas y el último a ancho completo), banda de fuentes, notas clave y **pie de figura** («Figura 1 · … / Elaboración propia»), que es lo que espera un informe.

| Medida | Infografía actual | Prototipo A4 |
|---|---|---|
| Letra mínima en papel (A4 vertical) | **2,3 pt** ✗ | **8,4 pt** (rótulos 7,4 pt) ✓ |
| Cabe en una página | no (118,5 cm) | sí (293,7 de 297 mm) |
| Desbordes de texto | sí (63/91 textos ilegibles) | **0** |
| Alto de tarjeta | fijo | **medido**, no adivinado |

### Hallazgo nuevo, aplicable al motor

`wrap()` estima el ancho de línea con `nº de caracteres × 0,53 × tamaño`. Medido en SVG real, una línea estimada se salía **2,2 mm** de su caja. **Esa estimación es la raíz de los recortes que el motor ya denuncia con `_avisos`.** Solución para el producto: medir con `getComputedTextLength()` sobre el SVG real antes de posicionar, no estimar por caracteres.

### Plan reenfocado (sustituye al de la §9)

1. **Formato de salida «Página» (A4 vertical) como opción por defecto**, junto al «Póster» actual. Geometría y tipografía en **milímetros**, letra mínima 8,5-9 pt garantizada por construcción.
2. **Exportar pensando en Word**: PNG con **chunk `pHYs` a 300 DPI** (se inserta ya al tamaño correcto), botón **«Copiar imagen»** al portapapeles para un Ctrl+V directo, **PDF** y SVG con opción «texto → curvas».
3. **Editor para gente no técnica en PC**: panel lateral con **todos** los campos (hoy fuentes, notas y rótulos se clonan del ejemplo), **pegar texto desde Word** y repartirlo en pasos automáticamente, plantillas por tipo de informe, sin `prompt()` ni JSON.
4. **Tipografía fija** (self-hosted) para que el diagrama se vea igual en cualquier PC y en la exportación.
5. **El móvil, sin rediseño**: que abra, que no rompa.

---

## Anexo — Evidencia

- 13 capturas en `~/.hermes/cache/scratch/audit-smartart/` (390/1440/1600 px, 7 layouts + galería + colisión de ids).
- Script de medición reproducible: `capturar.js` (Chromium headless + CDP puro, sin Playwright).
- Cadena del repo ejecutada antes y después: 5/5 verde.
