// Catálogo: enlaza las fichas, sincroniza datos de peliculas.js, ordena y filtra las tarjetas

(function () {
    "use strict";

    if (typeof PELICULAS === "undefined") {
        console.error("CineHub: falta cargar peliculas.js antes de catalogo.js");
        return;
    }

    // Pasa el texto a minúsculas y sin tildes para comparar
    function normalizar(texto) {
        return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
    }

    // Saca el nombre del archivo de una ruta de imagen
    function nombreArchivo(ruta) {
        return decodeURIComponent(ruta.split("?")[0].split("/").pop());
    }

    // Busca en PELICULAS la película que corresponde a una tarjeta
    function peliculaDeTarjeta(tarjeta) {
        const imagen = tarjeta.querySelector("img");
        if (!imagen) {
            return undefined;
        }

        const archivo = nombreArchivo(imagen.getAttribute("src") || "");
        let pelicula = PELICULAS.find(function (p) {
            return p.poster === archivo;
        });

        if (!pelicula) {
            const titulo = tarjeta.querySelector("h2, h3");
            if (titulo) {
                pelicula = PELICULAS.find(function (p) {
                    return normalizar(p.titulo) === normalizar(titulo.textContent);
                });
            }
        }
        return pelicula;
    }

    // Hace que cada tarjeta lleve a la ficha de su película
    function enlazarFichas() {
        let cambiados = 0;

        document.querySelectorAll("article").forEach(function (tarjeta) {
            const pelicula = peliculaDeTarjeta(tarjeta);
            if (!pelicula) {
                return;
            }

            tarjeta.querySelectorAll('a[href$="seleccion-pelicula.html"]').forEach(function (enlace) {
                const destino = enlace.getAttribute("href").replace(
                    "seleccion-pelicula.html",
                    "pelicula.html?id=" + pelicula.id
                );
                enlace.setAttribute("href", destino);
                cambiados++;
            });

            sincronizarDatos(tarjeta, pelicula);
        });

        if (cambiados > 0) {
            console.log("CineHub: " + cambiados + " enlaces apuntan a la ficha");
        }
    }

    // Copia la duración y calificación de peliculas.js a la tarjeta
    function sincronizarDatos(tarjeta, pelicula) {
        tarjeta.querySelectorAll("span, p").forEach(function (elemento) {
            if (elemento.children.length > 0) {
                return;
            }

            const texto = elemento.textContent.trim();

            if (/^★\s*\d+(\.\d+)?$/.test(texto)) {
                elemento.textContent = "★ " + pelicula.calificacion.toFixed(1);
            } else if (/^\d+\s*min$/.test(texto)) {
                elemento.textContent = pelicula.duracion + " min";
            } else if (/^\d{4}\s*·\s*\d+\s*min$/.test(texto)) {
                elemento.textContent = texto.split("·")[0].trim() + " · " + pelicula.duracion + " min";
            }
        });

        if (tarjeta.dataset.calificacion !== undefined) {
            tarjeta.dataset.calificacion = String(pelicula.calificacion);
        }
    }

    // Reproduce el tráiler de la tarjeta al pasar el mouse
    function iniciarTrailersTarjeta() {
        const tarjetas = document.querySelectorAll(".tarjeta-pelicula");

        if (tarjetas.length === 0) {
            return;
        }

        window.addEventListener("load", function () {
            for (const tarjeta of tarjetas) {
                const video = tarjeta.querySelector(".pelicula-trailer");
                if (!video) {
                    continue;
                }

                tarjeta.addEventListener("mouseenter", function () {

                    video.play().catch(function () {});
                });

                tarjeta.addEventListener("mouseleave", function () {
                    video.pause();
                    video.currentTime = 0;
                });
            }
            console.log("CineHub: tráilers listos (" + tarjetas.length + " tarjetas)");
        });
    }

    // Activa el orden y los filtros de peliculas.html
    function iniciarCatalogo() {
        const grilla = document.getElementById("peliculas-grid");
        const buscador = document.getElementById("buscar-pelicula");
        const selectorOrden = document.getElementById("orden-peliculas");

        if (!grilla || !buscador || !selectorOrden) {
            return;
        }

        const tarjetas = Array.from(grilla.querySelectorAll(".pelicula-card"));
        const cantidad = document.querySelector(".catalogo-cantidad");
        const filtros = document.querySelectorAll(".catalogo-filtros a");

        tarjetas.forEach(function (tarjeta, indice) {
            tarjeta.dataset.orden = String(indice);
        });

        const vacio = document.createElement("p");
        vacio.className = "catalogo-vacio";
        vacio.hidden = true;
        vacio.textContent = "No encontramos películas con esa búsqueda. Prueba con otro título o género.";
        grilla.after(vacio);

        let generoActivo = "todas";

        filtros.forEach(function (enlace) {
            const enPagina = enlace.getAttribute("href").charAt(0) === "#";

            if (!enPagina) {
                return;
            }

            enlace.addEventListener("click", function () {
                generoActivo = normalizar(enlace.textContent);
                filtros.forEach(function (otro) {
                    otro.classList.toggle("filtro-activo", otro === enlace);
                });
                aplicar();
            });
        });

        // Lee qué orden eligió el usuario
        function criterioOrden() {
            return normalizar(selectorOrden.options[selectorOrden.selectedIndex].textContent);
        }

        // Compara dos películas según el orden elegido
        function comparar(a, b, orden) {
            switch (orden) {
                case "nombre":
                    return a.querySelector("h3").textContent.localeCompare(
                        b.querySelector("h3").textContent, "es"
                    );
                case "calificacion":
                    return parseFloat(b.dataset.calificacion) - parseFloat(a.dataset.calificacion);
                default:
                    return parseInt(a.dataset.orden, 10) - parseInt(b.dataset.orden, 10);
            }
        }

        // Reordena y muestra las tarjetas según el filtro
        function aplicar() {
            const texto = normalizar(buscador.value);
            const orden = criterioOrden();
            const visibles = [];

            for (const tarjeta of tarjetas) {
                const titulo = normalizar(tarjeta.querySelector("h3").textContent);
                const generos = normalizar(tarjeta.querySelector(".pelicula-datos p").textContent);

                const coincideTexto = titulo.includes(texto) || generos.includes(texto);
                const coincideGenero = generoActivo === "todas" ||
                    normalizar(tarjeta.dataset.genero.replace("-", " ")) === generoActivo;
                const mostrar = coincideTexto && coincideGenero;

                tarjeta.hidden = !mostrar;

                if (mostrar) {
                    visibles.push(tarjeta);
                }
            }

            visibles.sort(function (a, b) {
                return comparar(a, b, orden);
            });

            const fragmento = document.createDocumentFragment();
            visibles.forEach(function (tarjeta) {
                fragmento.appendChild(tarjeta);
            });
            grilla.appendChild(fragmento);

            if (cantidad) {
                cantidad.textContent = visibles.length + (visibles.length === 1 ? " PELÍCULA" : " PELÍCULAS");
            }

            vacio.hidden = visibles.length !== 0;
        }

        buscador.addEventListener("input", aplicar);
        buscador.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter") {
                evento.preventDefault();
            }
        });
        selectorOrden.addEventListener("change", aplicar);

        if (window.location.hash === "#catalogo") {
            buscador.focus({ preventScroll: true });
        }

        aplicar();
        console.log("CineHub: catálogo listo (" + tarjetas.length + " películas)");
    }

    // Activa el selector "Ordenar" de la cartelera
    function iniciarOrdenCartelera() {
        const selector = document.getElementById("orden-peliculas");
        const lista = document.querySelector(".seccion-cartelera-pagina .peliculas-lista");

        if (!selector || !lista) {
            return;
        }

        const tarjetas = Array.from(lista.querySelectorAll(".tarjeta-pelicula"));

        tarjetas.forEach(function (tarjeta, indice) {
            tarjeta.dataset.orden = String(indice);
        });

        // Lee la calificación numérica de una tarjeta
        function calificacionDe(tarjeta) {
            return parseFloat(tarjeta.querySelector(".pelicula-calificacion").textContent.replace("★", ""));
        }

        // Lee el primer género de la tarjeta (ej. "Terror · Suspenso" da "Terror")
        function generoDe(tarjeta) {
            return tarjeta.querySelector(".pelicula-informacion p").textContent.split("·")[0].trim();
        }

        // Lee la duración en minutos de una tarjeta
        function duracionDe(tarjeta) {
            return parseInt(tarjeta.querySelector(".pelicula-duracion").textContent, 10);
        }

        selector.addEventListener("change", function () {
            const criterio = selector.value;
            const copia = tarjetas.slice();

            copia.sort(function (a, b) {
                switch (criterio) {
                    case "nombre":
                        return a.querySelector("h3").textContent.localeCompare(
                            b.querySelector("h3").textContent, "es"
                        );
                    case "calificacion":
                        return calificacionDe(b) - calificacionDe(a);
                    case "genero":
                        return generoDe(a).localeCompare(generoDe(b), "es");
                    case "duracion":
                        return duracionDe(a) - duracionDe(b);
                    default:
                        return parseInt(a.dataset.orden, 10) - parseInt(b.dataset.orden, 10);
                }
            });

            const fragmento = document.createDocumentFragment();
            copia.forEach(function (tarjeta) {
                fragmento.appendChild(tarjeta);
            });
            lista.appendChild(fragmento);
        });
    }

    const GENEROS = [
        {
            filtros: ".terror-filtros a[data-filtro]",
            activo: "terror-filtro-activo",
            tarjetas: ".terror-pelicula-card",
            atajos: ".terror-subgenero-card[data-filtro]",
            boton: ".terror-destacada-botones .boton-principal",
            destacada: "el-exorcista"
        },
        {
            filtros: ".accion-filtros a[data-filtro]",
            activo: "filtro-seleccionado",
            tarjetas: ".accion-pelicula-card",
            atajos: null,
            boton: ".accion-destacada-botones .boton-principal",
            destacada: "john-wick-4"
        },
        {
            filtros: ".filtros-animacion a[data-filtro]",
            activo: "filtro-animacion-activo",
            tarjetas: ".pelicula-animacion",
            atajos: ".categoria-animacion[data-filtro]",
            boton: ".destacada-animacion-texto .boton-principal",
            destacada: "spider-verse"
        },
        {
            filtros: ".catalogo-filtros a[data-filtro]",
            activo: "filtro-activo",
            tarjetas: ".pelicula-ciencia",
            atajos: ".subgenero-card[data-filtro]",
            boton: ".destacada-informacion .boton-principal",
            destacada: "duna-parte-dos"
        }
    ];

    // Activa el filtro por subgénero en una página de género
    function iniciarGenero(config) {
        const filtros = document.querySelectorAll(config.filtros);
        const tarjetas = document.querySelectorAll(config.tarjetas);

        if (filtros.length === 0 || tarjetas.length === 0) {
            return;
        }

        // Reordena y muestra las tarjetas según el filtro
        function aplicar(filtro) {
            filtros.forEach(function (enlace) {
                const activo = enlace.dataset.filtro === filtro;
                enlace.classList.toggle(config.activo, activo);
                enlace.setAttribute("aria-current", String(activo));
            });

            tarjetas.forEach(function (tarjeta) {
                const categorias = (tarjeta.dataset.categoria || "").split(" ");
                tarjeta.hidden = !(filtro === "todas" || categorias.includes(filtro));
            });
        }

        filtros.forEach(function (enlace) {
            enlace.addEventListener("click", function () {
                aplicar(enlace.dataset.filtro);
            });
        });

        if (config.atajos) {
            document.querySelectorAll(config.atajos).forEach(function (atajo) {
                atajo.addEventListener("click", function () {
                    aplicar(atajo.dataset.filtro);
                });
            });
        }

        const boton = document.querySelector(config.boton);
        if (boton) {
            boton.setAttribute("href", "pelicula.html?id=" + config.destacada);
        }

        console.log("CineHub: filtros de género listos (" + tarjetas.length + " películas)");
    }

    // Inicia todas las páginas de género de la tabla GENEROS
    function iniciarGeneros() {
        GENEROS.forEach(iniciarGenero);
    }

    // Arranque: se ejecuta todo al cargar la página
    enlazarFichas();
    iniciarTrailersTarjeta();
    iniciarCatalogo();
    iniciarOrdenCartelera();
    iniciarGeneros();

})();