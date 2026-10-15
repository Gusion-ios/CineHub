CineHub — Todo el cine. En un solo lugar.

Sitio web de un cine desarrollado como proyecto del curso Taller de Programación Web
(Ingeniería de Sistemas — Universidad Tecnológica del Perú, sede Arequipa).

Entrega: Avance del proyecto final 2
Alumno: Ccorahua Tizon, Franco Valerio
Docente: Aparicio Maldonado, Edmundo Aurelio
Fecha:15/10/2026


1. Descripción

CineHub es una propuesta de página web para una cadena de cines. Reúne cartelera,
horarios, salas, dulcería, promociones, sedes y contacto en una sola experiencia
visual coherente, con identidad en negro y dorado.

2. Alcance de esta entrega

Estructura completa en HTML y estilos en CSS externos.
No incluye JavaScript (por el momento).
Los datos (películas, horarios, precios) son de demostración.

3. Tecnologías

Tecnologia y su uso:
HTML - Estructura semántica (`header`, `nav`, `main`, `section`, `article`, `footer`) 
CSS - Variables, Flexbox, Grid, `clamp()`, media queries, transiciones y animaciones 
IntelliJ IDEA - Como principal entorno de desarrollo

Sin frameworks ni librerías externas (hasta el momento)

4. Páginas

Terminadas

Pagina - Archivo - Contenido principal

Inicio - `index.html` - Portada con video, categorías, películas en cartelera, promociones 
Cartelera - `Pages/cartelera.html` - Carrusel de pósters, filtros por género, 8 películas con trailer al pasar el cursor
Horarios - `Pages/horarios.html` - Selector de fechas, filtros, funciones por película, tabla resumen 
Dulcería - `Pages/dulceria.html` - Canchita, bebidas, dulces y combos, con audio y video de fondo 
Promociones - `Pages/promociones.html` - Ofertas destacadas, combos y beneficios 
Nosotros - `Pages/nosotros.html` - Historia, misión, visión, valores y experiencia por género 
Contacto - `Pages/contacto.html` - Formulario, horario de atención (tabla), mapa y preguntas frecuentes 

Maquetadas, en revisión

Pagina - Archivo - Pendiente

Salas - `Pages/salas.html` - Actualizar rutas de recursos y revisar 
Sedes - `Pages/sedes.html` - Actualizar rutas de recursos y revisar 

Por desarrollar

`estrenos.html`, `peliculas.html`, `accion.html`, `animacion.html`,
`ciencia-ficcion.html`, `terror.html`, `seleccion-pelicula.html`.


Nota
Horarios no aparece en el menú principal a propósito. Se llega desde el enlace
"Horarios →" de cada película en Cartelera y desde el pie de página.

5. Requisitos del curso cubiertos

Estructura `header` / `nav` / `main` / `footer` en todas las páginas.
CSS externo: `CSSGeneral.css` (variables, encabezado, pie, botones) más un CSS por página.
Elementos multimedia: imagen, video (portadas y trailers) y audio (Dulcería) 
(la cantidad puede variar dependiendo de los posteriores avances en las paginas faltantes).
Tablas reales** con `<caption>` y `<th scope="col">`: Contacto, Horarios y Salas.
Formulario con `label`/`id` asociados.
Diseño responsive con media queries.
Animaciones y transiciones: carrusel de pósters, efectos hover en tarjetas, cambio de póster a trailer 
(tambien puede aumentar la cantidad usada en posteriores avances de las paginas).
Accesibilidad básica: `aria-label`, `alt` descriptivo y `aria-hidden` en íconos decorativos.

6. Estructura del proyecto

```
CineHub/
├── index.html
├── README.md
├── CSS/
│   ├── CSSGeneral.css
│   ├── CSSInicio.css
│   ├── CSSCartelera.css
│   ├── CSSHorarios.css
│   ├── CSSDulceria.css
│   ├── CSSPromociones.css
│   ├── CSSNosotros.css
│   ├── CSSContacto.css
│   ├── CSSSalas.css
│   └── CSSSedes.css
├── Pages/
│   ├── cartelera.html
│   ├── horarios.html
│   ├── dulceria.html
│   ├── promociones.html
│   ├── nosotros.html
│   ├── contacto.html
│   ├── salas.html
│   └── sedes.html
└── Recursos/
    ├── Audio/
    │   └── Dulceria/
    ├── Fuentes/
    ├── Imagenes/
    │   ├── Compartidos/        (logos, iconos, pósters, redes sociales)
    │   ├── Contacto/
    │   ├── Dulceria/
    │   ├── Horarios/
    │   ├── Nosotros/
    │   ├── Promociones/
    │   ├── Salas/
    │   └── Sedes/
    └── Videos/
        ├── Compartidos/
        │   └── Trailer/
        ├── Dulceria/
        ├── Inicio/
        └── Nosotros/
```

Criterio de organización de `Recursos/`: lo que se usa en más de una página va en
`Compartidos/`; lo exclusivo de una página va en la carpeta con su nombre.

7. Cómo ejecutarlo

   1. Descargar o clonar el proyecto.
   2. Abrir `index.html` en el navegador (o con el servidor integrado de IntelliJ).
   3. Navegar con el menú superior.

Las rutas son relativas: se debe mantener la estructura de carpetas tal como está.

8. Próximos pasos

Terminar las páginas por desarrollar (estrenos, películas y géneros).
Incorporar una tipografía externa en `Recursos/Fuentes/`.
Reemplazar los datos de demostración por contenido final.

Nota:
Para un futuro se planea implementar JavaScript para dar funcionabilidad a algunas paginas como por ejemplo: 
selector de fechas y filtros de Horarios,
orden y paginación de Cartelera, validación del formulario de Contacto,
indicadores del carrusel y selección de asientos, 
entre otras ideas que se nos iran ocurriendo.
