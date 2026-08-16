# Manual de diseño de Gallery

Este manual adapta el sistema **Design System 3.3 by Sigma** del archivo Figma compartido a una aplicación interna, oscura y centrada en contenido visual. La fuente original se interpreta mediante tres capas: Canvas, Content y Navigation.

## Principios

- La captura es siempre el contenido protagonista.
- La jerarquía se construye con superficies, espacio y tipografía; los contenedores no usan bordes.
- Solo existen tres niveles visuales simultáneos: lienzo, contenido y navegación/elevación.
- El verde indica acción, foco o selección. No se usa como decoración extensa.
- Todos los textos usan escritura normal; no hay etiquetas en mayúsculas sostenidas.
- La interfaz evita sombras fuertes y efectos que compitan con las referencias.

## Color

| Token | Valor | Uso |
| --- | --- | --- |
| `canvas` | `#0B0D0E` | Fondo global |
| `content` | `#121516` | Tarjetas, galerías y campos |
| `elevated` | `#191D1E` | Controles y estados elevados |
| `navigation` | `#202526` | Navegación flotante |
| `primary` | `#A0CC33` | CTA, foco y selección |
| `text` | `#F5F7F3` | Texto principal |
| `muted` | `#969D97` | Texto secundario e iconos inactivos |

Las superficies adyacentes deben tener contraste perceptible sin añadir contornos. El color primario conserva texto oscuro para mantener legibilidad.

## Tipografía

- Familia: Inter.
- Título de página: 36 px, peso 600, interlineado compacto.
- Título de sección: 20–24 px, peso 500–600.
- Cuerpo: 14–16 px, peso 400.
- Texto auxiliar: 12–14 px, color muted.
- Los nombres propios conservan su capitalización original.
- Las etiquetas describen acciones con frases cortas: “Nueva referencia”, no “NUEVA REFERENCIA”.

## Espacio y forma

La escala base es 4 px: `4, 8, 12, 16, 24, 32, 48`. El espacio entre bloques debe ser mayor que el espacio entre elementos relacionados.

- Radio pequeño: 8 px para badges y controles compactos.
- Radio medio: 12–16 px para botones, inputs y dropzones.
- Radio grande: 24 px para paneles y navegación.
- No se usan líneas divisorias salvo que la densidad de datos vuelva ambigua una agrupación.

## Iconografía

- Librería: Hugeicons Pro, variante `core-stroke-rounded`.
- Trazo habitual: 1.5 px; 2 px solo en controles pequeños que necesiten mayor contraste.
- Tamaños: 20 px en controles, 24 px en navegación y hasta 32 px en estados vacíos.
- Un icono acompaña una acción; no sustituye el texto cuando la intención pueda ser ambigua.

## Componentes

### Navegación

Flota sobre el Canvas y usa la superficie Navigation. En escritorio se presenta como barra lateral; en móvil, como barra inferior. El elemento activo usa una superficie interna y el color primario en su icono.

### Botones

El botón principal usa `primary` y texto oscuro. Los botones secundarios usan `elevated`. Los estados hover modifican luminosidad, no añaden bordes. El estado activo puede reducir la escala a 98%.

### Campos y filtros

Usan la superficie Content o Elevated según su contexto. El foco se señala con un halo verde tenue. El label se mantiene visible fuera del placeholder cuando el significado no sea evidente.

### Carga de archivos

La zona de carga se distingue por superficie y espacio. Debe comunicar que acepta imágenes, ZIP y RAR, mostrar los archivos seleccionados y conservar el orden que tendrá el envío. Web y Mobile solo muestran su dropzone cuando el checkbox correspondiente está activo.

### Tarjeta de referencia

La vista general renderiza únicamente el logo sobre Content. El nombre existe como texto accesible. La tarjeta completa es interactiva y comparte el logo con la cabecera del detalle mediante View Transitions.

### Galería

Las capturas mantienen su proporción original y se agrupan por plataforma. El fondo neutro no altera la percepción del producto. El orden visual coincide con el orden natural del nombre de archivo.

## Movimiento y accesibilidad

- Las transiciones duran aproximadamente 180–300 ms.
- El logo puede transformarse entre la tarjeta y el detalle; el resto del contenido aparece sin movimientos innecesarios.
- `prefers-reduced-motion` debe desactivar transformaciones no esenciales.
- Todo control mantiene foco visible, nombre accesible y contraste suficiente.
- Las áreas táctiles tienen al menos 44 px en su dimensión principal.

## Regla de decisión

Antes de añadir un contenedor, borde o color adicional, comprueba si el contenido puede entenderse mediante proximidad, espacio o uno de los tres niveles de superficie. Si funciona, no añadas una cuarta señal visual.
