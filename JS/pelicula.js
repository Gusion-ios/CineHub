// Película: arma la ficha de la película que viene en la URL (?id=...)

(function () {
    "use strict";

    const CLAVE_PELICULA = "cinehubPelicula";

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");
    // El id de la película viene en la URL, por ejemplo pelicula.html?id=matrix
    const forzarApertura = parametros.get("apertura") === "1";
    const pelicula = buscarPelicula(id);

    const ficha = document.getElementById("ficha");

    if (!pelicula) {
        ficha.classList.add("ficha-sin-pelicula");
        document.getElementById("ficha-error").hidden = false;
        document.title = "Película no encontrada | CineHub";
        return;
    }

    // Crea un elemento con clase y texto
    function crear(etiqueta, clase, texto) {
        const elemento = document.createElement(etiqueta);
        if (clase) {
            elemento.className = clase;
        }
        if (texto !== undefined) {
            elemento.textContent = texto;
        }
        return elemento;
    }

    // Aplica el ambiente del género y llena la ficha con textContent
    const ambiente = activarAmbiente(pelicula, forzarApertura);

    document.title = pelicula.titulo + " | CineHub";
    document.getElementById("migas-titulo").textContent = pelicula.titulo;
    document.getElementById("ficha-titulo").textContent = pelicula.titulo;

    const original = document.getElementById("ficha-original");
    if (pelicula.tituloOriginal && pelicula.tituloOriginal !== pelicula.titulo) {
        original.textContent = pelicula.tituloOriginal;
    } else {
        original.hidden = true;
    }

    const poster = document.getElementById("ficha-poster");
    poster.src = RUTAS.poster + pelicula.poster;
    poster.alt = "Póster de " + pelicula.titulo;

    document.getElementById("ficha-fondo").style.backgroundImage =
        'url("' + RUTAS.poster + pelicula.poster + '")';

    if (ambiente) {
        document.getElementById("ficha-etiqueta").textContent = "Ambientación · " + ambiente.nombre;
    }

    const datos = document.getElementById("ficha-datos");
    datos.appendChild(crear("li", "", String(pelicula.anio)));
    datos.appendChild(crear("li", "", formatearDuracion(pelicula.duracion)));
    datos.appendChild(crear("li", "dato-clasificacion", pelicula.clasificacion));
    datos.appendChild(crear("li", "", pelicula.generos.join(" · ")));
    datos.appendChild(crear("li", "dato-rating", "★ " + pelicula.calificacion.toFixed(1)));

    document.getElementById("ficha-sinopsis").textContent = pelicula.sinopsis;

    const botonHorarios = document.getElementById("boton-horarios");
    botonHorarios.href = "horarios.html?pelicula=" + pelicula.id;

    botonHorarios.addEventListener("click", function () {
        try {
            localStorage.setItem(CLAVE_PELICULA, pelicula.id);
        } catch (error) {

        }
    });

    if (ambiente) {
        iniciarSonido(document.getElementById("boton-sonido"), ambiente);
    }

    document.getElementById("ficha-director").textContent = pelicula.director;

    const reparto = document.getElementById("ficha-reparto");
    pelicula.reparto.forEach(function (actor) {
        reparto.appendChild(crear("li", "", actor));
    });

    const cajaTrailer = document.getElementById("ficha-trailer-caja");

    if (pelicula.trailer) {
        const video = document.createElement("video");
        video.controls = true;
        video.preload = "metadata";
        video.poster = RUTAS.poster + pelicula.poster;

        const fuente = document.createElement("source");
        fuente.src = RUTAS.trailer + pelicula.trailer;
        fuente.type = "video/mp4";

        video.appendChild(fuente);
        video.appendChild(document.createTextNode("Tu navegador no admite la reproducción de video."));
        cajaTrailer.appendChild(video);
    } else {
        cajaTrailer.appendChild(
            crear("p", "ficha-sin-trailer", "El tráiler de esta película estará disponible próximamente.")
        );
        document.getElementById("boton-trailer").hidden = true;
    }

    if (ambiente) {
        document.getElementById("ficha-asientos-texto").textContent =
            "Toca un asiento: en esta ambientación se anima con el efecto \"" + ambiente.asientos + "\".";
    }

    document.querySelectorAll(".asiento-demo").forEach(function (asiento) {
        asiento.addEventListener("click", function () {
            asiento.classList.toggle("activo");
            animarAsiento(asiento);
        });
    });

    // Películas relacionadas del mismo género (máximo 4)
    let relacionadas = filtrarPorGenero(pelicula.genero).filter(function (otra) {
        return otra.id !== pelicula.id;
    });

    if (relacionadas.length > 0) {
        document.getElementById("relacionadas-titulo").textContent = "Más películas del mismo género";
    } else {

        relacionadas = PELICULAS.filter(function (otra) {
            return otra.id !== pelicula.id;
        }).sort(function (a, b) {
            return b.calificacion - a.calificacion;
        });
    }

    const contenedorRelacionadas = document.getElementById("ficha-relacionadas");

    relacionadas.slice(0, 4).forEach(function (otra) {
        const enlace = crear("a", "relacionada");
        enlace.href = "pelicula.html?id=" + otra.id;

        const cajaImagen = crear("div", "relacionada-imagen");
        const imagen = document.createElement("img");
        imagen.src = RUTAS.poster + otra.poster;
        imagen.alt = "Póster de " + otra.titulo;
        imagen.loading = "lazy";
        cajaImagen.appendChild(imagen);

        const info = crear("div", "relacionada-info");
        info.appendChild(crear("h3", "", otra.titulo));
        info.appendChild(crear("p", "", "★ " + otra.calificacion.toFixed(1) + " · " + otra.anio));

        enlace.append(cajaImagen, info);
        contenedorRelacionadas.appendChild(enlace);
    });

    console.log("CineHub: ficha de " + pelicula.titulo + " lista");

})();