# CineHub — Todo el cine. En un solo lugar.

Sitio web de un cine desarrollado con **HTML5, CSS3 y JavaScript** (sin frameworks), con identidad visual en negro y dorado. Incluye cartelera, fichas de película dinámicas con ambientación propia y un flujo de compra completo (película → horarios → asientos → confirmación).

Proyecto del curso **Taller de Programación Web** — Universidad Tecnológica del Perú (UTP), sede Arequipa.

| | |
|---|---|
| **Autor** | Franco Valerio Ccorahua Tizon |
| **Docente** | Edmundo Aurelio Aparicio Maldonado |
|
| **Entregas** | APF1 (HTML) · APF2 (CSS) · APF3 (JavaScript) · Proyecto final |

---

## Cómo ejecutarlo

1. Descomprime la carpeta `CineHub/`.
2. Abre `index.html` (en la raíz).

Para que **todo** funcione (audio, vídeo y `localStorage`) conviene abrirlo con un servidor local. Con IntelliJ IDEA: clic derecho sobre `index.html` → *Open in Browser*. Otras opciones: la extensión *Live Server* de VS Code o `python -m http.server`.

> No requiere instalar nada ni conexión a internet, salvo la tipografía Montserrat (Google Fonts).

---

## Tecnologías

- **HTML5** semántico: `header`, `nav`, `main`, `section`, `article`, `footer`, tablas con `caption`, `th` y `td`, formularios y multimedia (`video`, `audio`).
- **CSS3**: variables CSS, Flexbox, Grid, transiciones, `transform`, `@keyframes`, `@media` (móvil, tablet y escritorio) y `prefers-reduced-motion`.
- **JavaScript** (vanilla): variables y constantes, arreglos y objetos, funciones, estructuras de control, DOM, eventos, `localStorage`, `sessionStorage`, `URLSearchParams`, `alert` / `confirm` / `prompt` y mensajes en consola.
- **Decisión sobre Bootstrap:** no se usó. Todo el diseño es CSS propio con Flexbox y Grid, para controlar la identidad visual (negro y dorado) y mantener cada hoja de estilo ligera.

---

## Estructura del proyecto

```
CineHub/
├── index.html
├── README.md
├── CSS/
│   ├── CSSGeneral.css          ← variables, encabezado, pie de página y menú móvil (compartido)
│   ├── CSSAmbientes.css        ← cursor, aperturas y animaciones de asientos por ambientación
│   ├── CSSPelicula.css         ← ficha dinámica de película
│   ├── CSSCompras.css          ← selección, asientos, confirmación y resultado
│   ├── CSSHorarios.css
│   ├── CSSPeliculas.css
│   ├── CSSAccion.css · CSSAnimacion.css · CSSCienciaFiccion.css · CSSTerror.css
│   ├── CSSContacto.css · CSSDulceria.css · CSSPromociones.css
│   └── CSSSalas.css · CSSSedes.css · CSSNosotros.css · CSSEstrenos.css · CSSCartelera.css · CSSIndex.css
├── JS/
│   ├── peliculas.js            ← datos: 23 películas y 9 ambientaciones (arreglos y objetos)
│   ├── menu.js                 ← menú hamburguesa responsive
│   ├── ambientes.js            ← cursor, apertura, sonido y animación de asientos
│   ├── pelicula.js             ← ficha dinámica (pelicula.html?id=...)
│   ├── catalogo.js             ← búsqueda, orden y filtros (Películas y géneros)
│   ├── filtros.js              ← filtros de Selección de película y Horarios
│   ├── compras.js              ← flujo de compra (localStorage)
│   ├── contacto.js             ← validación del formulario
│   ├── dulceria.js             ← carrito de dulcería
│   └── promociones.js          ← códigos promocionales
├── Pages/
│   ├── cartelera.html · estrenos.html · peliculas.html
│   ├── accion.html · animacion.html · ciencia-ficcion.html · terror.html
│   ├── pelicula.html           ← plantilla dinámica de ficha
│   ├── seleccion-pelicula.html · horarios.html · asientos.html · confirmacion.html · resultado.html
│   ├── salas.html · sedes.html · nosotros.html
│   └── promociones.html · dulceria.html · contacto.html
└── Recursos/
    ├── Audio/{Dulceria, Ambientes}/
    ├── Imagenes/{Compartidos, Generos, Estrenos, Confirmacion, Contacto, Dulceria, Promociones, Salas, Sedes, Nosotros, Peliculas}/
    └── Videos/{Compartidos/Trailer, Dulceria, Inicio}/
```

---

## Páginas

| Página | Estado | Contenido principal |
|---|---|---|
| Inicio (`index.html`) | Terminada | Portada, cartelera destacada, promociones y accesos |
| Cartelera | Terminada | Películas en cartelera |
| Estrenos | Terminada (datos de ejemplo) | Próximos lanzamientos y tráiler |
| Películas | Terminada + JS | Catálogo de 12 títulos con búsqueda, orden y filtro |
| Acción · Animación · Ciencia ficción · Terror | Terminadas + JS | Película destacada, tráiler y catálogo filtrable por subgénero |
| **Ficha de película** (`pelicula.html?id=…`) | Terminada + JS | Plantilla dinámica para las 23 películas |
| Selección de película | Terminada + JS | 9 películas con búsqueda y filtro por género |
| Horarios | Terminada + JS | Fechas, sede, formato y género |
| Asientos | Terminada + JS | Mapa de sala, precio y resumen |
| Confirmación / Resultado | Terminadas + JS | Entrada digital con QR; pantalla de error |
| Salas · Sedes · Nosotros | Terminadas | Información del cine |
| Promociones | Terminada + JS | Códigos promocionales activables |
| Dulcería | Terminada + JS | Productos, combos y carrito |
| Contacto | Terminada + JS | Formulario validado, horarios (tabla) y preguntas frecuentes |

---

## Funcionalidades de JavaScript

### Ficha de película dinámica
Una sola página (`pelicula.html`) sirve para las **23 películas**: lee el `id` de la URL (`?id=el-exorcista`), lo busca en el arreglo `PELICULAS` y rellena el DOM. Si el `id` no existe, muestra un mensaje de error.

Cada película tiene una **ambientación** tomada de un catálogo de 9 reutilizables:

| Ambientación | Ejemplos | Apertura | Animación de asientos |
|---|---|---|---|
| Demonios | El Exorcista, It, El Conjuro | Parpadeo de luz | Temblor |
| Espacio | Interestellar, Matrix | Estrellas | Levitar |
| Desierto | Duna: Parte Dos | Arena | Onda |
| Killer | John Wick 4 | Corte | Destello |
| Bioluminiscente | Avatar | Luciérnagas | Brillo |
| Superhéroe | Spider-Man, Avengers | Telaraña | Balanceo |
| Emociones | Intensamente 2, Coco | Burbujas | Rebote |
| Humor | Mi Villano Favorito 4, Shrek | Confeti | Salto |
| Histórico | Oppenheimer | Cuenta atrás | Fundido |

Cada ambientación aporta un color de acento, un cursor personalizado (**solo con ratón**) y una animación de apertura (una vez por película y sesión; se salta con el botón o con `Esc`). El **sonido está desactivado por defecto**: se activa con el botón "Activar sonido". Con `prefers-reduced-motion` activo se omiten la apertura y el cursor.

### Flujo de compra
1. **Selección de película**: búsqueda y filtro por género; cada tarjeta lleva a su ficha.
2. **Ficha** → "Ver horarios".
3. **Horarios**: filtra por sede, formato y género; al elegir una hora se guarda la función.
4. **Asientos**: muestra la película y la hora elegidas, calcula el total (2D S/ 18, 3D S/ 25, IMAX S/ 30), máximo 8 asientos, y anima cada asiento según la ambientación de la película.
5. **Confirmación**: entrada digital con los datos reales y un código de reserva generado.

La reserva viaja entre páginas en `localStorage` (clave `cinehubReserva`). Si se entra a la confirmación sin una reserva completa, se redirige a la pantalla de error.

### Promociones y descuentos
En Promociones, cada oferta de entradas tiene un código (`DOBLE2X1`, `FAMILIA15`, `ESTRENO10`, `GRUPO20`). El código activo se guarda y **se aplica al total** en asientos y confirmación, con su fila de descuento. Se consume al terminar la compra.

### Dulcería
Botones `+` y "Elegir combo" que llenan un carrito flotante: subir, bajar o quitar cantidades, total, vaciar y confirmar con `confirm`/`alert`. El pedido se conserva al recargar (`localStorage`). Incluye un botón para activar o pausar la música de fondo.

### Contacto
Validación con mensajes bajo cada campo (nombre, teléfono opcional, correo y mensaje), contador de caracteres, `prompt` si no se deja teléfono y `confirm` antes de "enviar". El envío es simulado: el mensaje se guarda en `localStorage`.

### Menú responsive
Menú hamburguesa en pantallas de hasta 1050 px: se abre y cierra con el botón, con `Esc`, al pulsar un enlace o fuera del menú, y se cierra solo al ampliar la ventana.

---

## Diseño responsive

Se diseñó para tres tamaños y se comprobó en cada uno:

| Dispositivo | Ancho | Cambios principales |
|---|---|---|
| Móvil | ≤ 600 px | Menú hamburguesa, columnas apiladas, botones a ancho completo |
| Tablet | 601 – 1050 px | Menú hamburguesa, rejillas de 2 columnas |
| Escritorio | > 1050 px | Navegación completa y rejillas de 3 o 4 columnas |

---

## Notas y limitaciones

- Es un **prototipo académico**: no existe backend, no hay pagos reales ni reservas reales. Los datos se guardan solo en el navegador del usuario.
- Las calificaciones, clasificaciones y funciones mostradas son datos de ejemplo del sitio.
- Las 14 películas sin tráiler muestran el aviso "disponible próximamente".
- Los archivos de audio de las ambientaciones (`Recursos/Audio/Ambientes/`) están pendientes: mientras tanto el botón de sonido indica "Audio no disponible" y no produce errores.
- El código QR de la confirmación es una imagen fija.
- Estrenos conserva datos de ejemplo.
- Los pósters y tráilers de películas pertenecen a sus respectivos titulares y se usan solo con fines educativos.

---

## Créditos

- Tipografía: **Montserrat** (Google Fonts).
- Pósters y tráilers: © sus respectivos estudios (uso educativo).
- Imágenes de ambientación y de género: generadas con IA para este proyecto.