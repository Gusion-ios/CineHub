// Compras: maneja la selección de película, horarios, asientos y la confirmación de la entrada

(function () {
    "use strict";

    if (document.body.dataset.comprasListo === "si") {
        return;
    }
    document.body.dataset.comprasListo = "si";

    // Claves de localStorage
    const CLAVE = "cinehubReserva";
    const MAX_ASIENTOS = 8;
    const CARGO_SERVICIO = 2;
    const PRECIOS = { "2d": 18, "3d": 25, "imax": 30 };
    const PRECIO_BASE = 25;

    const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

    // Lee la reserva guardada en localStorage
    function leerReserva() {
        try {
            return JSON.parse(localStorage.getItem(CLAVE)) || null;
        } catch (error) {
            return null;
        }
    }

    // Guarda la reserva en localStorage
    function guardarReserva(reserva) {
        try {
            localStorage.setItem(CLAVE, JSON.stringify(reserva));
        } catch (error) {
            console.warn("CineHub: no se pudo guardar la reserva", error);
        }
    }

    // Borra la reserva guardada
    function borrarReserva() {
        try {
            localStorage.removeItem(CLAVE);
        } catch (error) {  }
    }

    // Da formato de soles (S/) a un número
    function moneda(numero) {
        return "S/ " + numero.toFixed(2);
    }

    // Pasa el texto a minúsculas y sin tildes para comparar
    function normalizar(texto) {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    // Busca una película por su título
    function peliculaPorTitulo(titulo) {
        const buscado = normalizar(titulo);
        return PELICULAS.find(function (p) {
            return normalizar(p.titulo) === buscado;
        }) || null;
    }

    // Convierte la hora a formato de 12 horas con a. m. o p. m.
    function formatearHora(texto) {

        const partes = texto.trim().split(":");
        const hora = parseInt(partes[0], 10);
        const minutos = partes[1];
        const sufijo = hora >= 12 ? "p. m." : "a. m.";
        const hora12 = hora % 12 === 0 ? 12 : hora % 12;
        return hora12 + ":" + minutos + " " + sufijo;
    }

    // Convierte una fecha ISO a texto legible
    function formatearFecha(iso) {

        const f = new Date(iso + "T00:00:00");
        return DIAS[f.getDay()] + " " + f.getDate() + " " + MESES[f.getMonth()] + " " + f.getFullYear();
    }

    // Crea un código aleatorio para la reserva
    function generarCodigo() {
        return "CH-2026-" + String(Math.floor(10000 + Math.random() * 90000));
    }

    // Devuelve el nombre de la sala según el formato (2D, 3D o IMAX)
    function nombreSala(formato) {
        switch (formato) {
            case "2d":
                return "Sala 2D";
            case "imax":
                return "Sala IMAX";
            default:
                return "Sala 3D";
        }
    }

    // Lee la promoción activa guardada
    function leerPromo() {
        try {
            const promo = JSON.parse(localStorage.getItem("cinehubPromo"));

            return promo && typeof promo === "object" && promo.codigo ? promo : null;
        } catch (error) {
            return null;
        }
    }

    // Borra la promoción guardada
    function borrarPromo() {
        try {
            localStorage.removeItem("cinehubPromo");
        } catch (error) {  }
    }

    // Calcula cuánto se descuenta según la promoción
    function calcularDescuento(cantidad, precio, promo) {
        if (!promo || cantidad < (promo.minimo || 1)) {
            return 0;
        }
        if (promo.tipo === "2x1") {
            return Math.floor(cantidad / 2) * precio;
        }
        return cantidad * precio * (promo.valor / 100);
    }

    // Hace que los enlaces "Seleccionar" lleven a la ficha de su película
    function iniciarSeleccion() {
        const enlaces = Array.from(document.querySelectorAll("a")).filter(function (a) {
            return a.textContent.toLowerCase().indexOf("seleccionar") !== -1;
        });

        if (enlaces.length === 0) {
            return;
        }

        enlaces.forEach(function (enlace) {
            const tarjeta = enlace.closest("article") || enlace.parentElement.parentElement;
            const titulo = tarjeta ? tarjeta.querySelector("h2, h3") : null;
            const pelicula = titulo ? peliculaPorTitulo(titulo.textContent) : null;

            if (pelicula) {
                enlace.href = "pelicula.html?id=" + pelicula.id;
            } else {
                console.warn("CineHub: sin ficha para", titulo ? titulo.textContent : "(tarjeta sin título)");
            }
        });

        console.log("CineHub: " + enlaces.length + " enlaces de selección conectados");
    }

    // Activa las fechas y guarda la función elegida antes de ir a los asientos
    function iniciarHorarios() {
        const tarjetas = document.querySelectorAll(".funcion-pelicula");
        if (tarjetas.length === 0) {
            return;
        }

        const fechas = document.querySelectorAll(".fecha-item");
        fechas.forEach(function (boton) {
            boton.addEventListener("click", function () {
                fechas.forEach(function (otro) {
                    otro.classList.remove("fecha-activa");
                });
                boton.classList.add("fecha-activa");
            });
        });

        // Devuelve la fecha seleccionada
        function fechaElegida() {
            const activa = document.querySelector(".fecha-item.fecha-activa");
            return activa ? activa.dataset.fecha : "2026-10-24";
        }

        // Devuelve la sede seleccionada
        function sedeElegida() {
            const selector = document.getElementById("filtro-sede");
            if (!selector || selector.value === "") {
                return "CineHub Arequipa";
            }
            return selector.options[selector.selectedIndex].textContent;
        }

        tarjetas.forEach(function (tarjeta) {
            const titulo = tarjeta.querySelector("h3").textContent;
            const pelicula = peliculaPorTitulo(titulo);
            const formatoEtiqueta = tarjeta.querySelector(".funcion-formatos span");
            const formato = formatoEtiqueta ? formatoEtiqueta.textContent.trim().toLowerCase() : "2d";

            tarjeta.querySelectorAll("a").forEach(function (enlace) {
                enlace.addEventListener("click", function () {

                    const esHora = enlace.classList.contains("hora-funcion");
                    const horaTexto = esHora
                        ? enlace.textContent
                        : tarjeta.querySelector(".hora-funcion").textContent;

                    guardarReserva({
                        peliculaId: pelicula ? pelicula.id : null,
                        titulo: titulo,
                        poster: tarjeta.querySelector("img").getAttribute("src"),
                        generos: pelicula ? pelicula.generos : [],
                        duracion: pelicula ? pelicula.duracion : null,
                        formato: formato,
                        fecha: fechaElegida(),
                        hora: formatearHora(horaTexto),
                        sede: sedeElegida(),
                        asientos: [],
                        total: 0,
                        codigo: null
                    });
                });
            });
        });

        const id = new URLSearchParams(window.location.search).get("pelicula");
        const pelicula = buscarPelicula(id);

        if (pelicula) {
            const tarjeta = Array.from(tarjetas).find(function (t) {
                return normalizar(t.querySelector("h3").textContent) === normalizar(pelicula.titulo);
            });

            if (tarjeta) {
                tarjeta.classList.add("funcion-destacada");
                tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                console.info("CineHub: " + pelicula.titulo + " no tiene funciones de ejemplo en Horarios");
            }
        }

        console.log("CineHub: horarios conectados");
    }

    // Maneja la sala: elegir asientos, calcular el total y confirmar
    function iniciarAsientos() {
        const sala = document.getElementById("sala");
        if (!sala) {
            return;
        }

        const reserva = leerReserva();
        const pelicula = reserva ? buscarPelicula(reserva.peliculaId) : null;
        const promo = leerPromo();

        if (reserva) {
            const imagen = document.querySelector(".pelicula-seleccionada-icono img");
            const titulo = document.querySelector(".pelicula-seleccionada-info h2");
            const detalle = document.querySelector(".pelicula-seleccionada-info p");
            const hora = document.querySelector(".funcion-seleccionada strong");
            const etiquetaSala = document.querySelector(".asientos-encabezado .compra-etiqueta");

            imagen.src = reserva.poster;
            imagen.alt = "Póster de " + reserva.titulo;
            titulo.textContent = reserva.titulo;
            hora.textContent = reserva.hora;
            etiquetaSala.textContent = nombreSala(reserva.formato).toUpperCase();

            const partes = [];
            if (reserva.generos && reserva.generos.length) {
                partes.push(reserva.generos.slice(0, 2).join(" · "));
            }
            if (reserva.duracion) {
                partes.push(formatearDuracion(reserva.duracion));
            }
            partes.push(String(reserva.formato).toUpperCase());
            detalle.textContent = partes.join(" · ");

            sala.dataset.precio = String(PRECIOS[reserva.formato] || PRECIO_BASE);
        }

        if (pelicula && typeof aplicarAmbiente === "function") {
            const ambiente = ambientacionDe(pelicula);
            if (ambiente) {
                aplicarAmbiente(ambiente, pelicula.ambientacion);
                iniciarCursor(ambiente.cursor);
            }
        }

        const precio = parseFloat(sala.dataset.precio) || PRECIO_BASE;
        const cantidad = document.getElementById("resumen-cantidad");
        const lista = document.getElementById("resumen-lista");
        const total = document.getElementById("resumen-total");
        const continuar = document.querySelector(".boton-continuar-asientos");

        const notaPromo = document.createElement("small");
        notaPromo.className = "resumen-promo";
        notaPromo.hidden = !promo;
        total.parentElement.appendChild(notaPromo);

        // Devuelve los asientos marcados
        function seleccionados() {
            return Array.from(sala.querySelectorAll(".asiento-seleccionado")).map(function (a) {
                return a.dataset.asiento;
            });
        }

        // Actualiza el resumen con cantidad, asientos y total
        function actualizarResumen() {
            const elegidos = seleccionados();
            const n = elegidos.length;
            const subtotal = n * precio;
            const descuento = calcularDescuento(n, precio, promo);

            cantidad.textContent = n + (n === 1 ? " asiento" : " asientos");
            lista.textContent = n > 0 ? elegidos.join(", ") : "Selecciona tus lugares en la sala.";
            total.textContent = moneda(subtotal - descuento);

            if (promo) {
                if (descuento > 0) {
                    notaPromo.textContent = "Código " + promo.codigo + ": −" + moneda(descuento);
                } else if (n === 0) {
                    notaPromo.textContent = "Código " + promo.codigo + " listo: " + promo.detalle;
                } else {
                    notaPromo.textContent = "El código " + promo.codigo + " se aplica con " + promo.minimo + " o más entradas";
                }
            }
        }

        sala.addEventListener("click", function (evento) {
            const asiento = evento.target.closest(".asiento");

            if (!asiento || asiento.disabled || asiento.classList.contains("asiento-ocupado")) {
                return;
            }

            const yaElegido = asiento.classList.contains("asiento-seleccionado");

            if (!yaElegido && seleccionados().length >= MAX_ASIENTOS) {
                alert("Puedes elegir hasta " + MAX_ASIENTOS + " asientos por compra.");
                return;
            }

            asiento.classList.toggle("asiento-seleccionado");
            asiento.setAttribute("aria-pressed", String(!yaElegido));

            if (typeof animarAsiento === "function") {
                animarAsiento(asiento);
            }

            actualizarResumen();
        });

        const ventana = crearModal(document.getElementById("modal-confirmar"));
        const detalleModal = document.getElementById("modal-confirmar-detalle");
        const botonAceptar = document.getElementById("modal-confirmar-aceptar");

        let pendiente = null;

        continuar.addEventListener("click", function (evento) {
            evento.preventDefault();

            const elegidos = seleccionados();

            if (elegidos.length === 0) {
                alert("Selecciona al menos un asiento para continuar.");
                return;
            }

            const subtotal = elegidos.length * precio;
            const descuento = calcularDescuento(elegidos.length, precio, promo);
            pendiente = {
                elegidos: elegidos,
                subtotal: subtotal,
                descuento: descuento,
                importe: subtotal - descuento
            };

            const filas = [
                ["Asientos", elegidos.join(", ")],
                ["Subtotal", moneda(subtotal)]
            ];

            if (descuento > 0) {
                filas.push(["Descuento (" + promo.codigo + ")", "−" + moneda(descuento)]);
            }

            filas.push(["Total", moneda(pendiente.importe)]);

            const fragmento = document.createDocumentFragment();

            for (const [etiqueta, valor] of filas) {
                const fila = document.createElement("div");
                const dt = document.createElement("dt");
                const dd = document.createElement("dd");
                dt.textContent = etiqueta;
                dd.textContent = valor;
                fila.append(dt, dd);
                fragmento.appendChild(fila);
            }

            detalleModal.replaceChildren(fragmento);
            ventana.abrir();
        });

        botonAceptar.addEventListener("click", function () {
            const actual = reserva || {
                peliculaId: null,
                titulo: document.querySelector(".pelicula-seleccionada-info h2").textContent,
                poster: document.querySelector(".pelicula-seleccionada-icono img").getAttribute("src"),
                generos: [],
                duracion: null,
                formato: "3d",
                fecha: "2026-10-24",
                hora: document.querySelector(".funcion-seleccionada strong").textContent,
                sede: "CineHub Arequipa"
            };

            actual.asientos = pendiente.elegidos;
            actual.precio = precio;
            actual.subtotal = pendiente.subtotal;
            actual.descuento = pendiente.descuento;
            actual.codigoPromo = pendiente.descuento > 0 ? promo.codigo : null;
            actual.total = pendiente.importe;
            actual.codigo = generarCodigo();
            guardarReserva(actual);

            window.location.href = "confirmacion.html";
        });

        actualizarResumen();
        console.log("CineHub: asientos conectados (S/ " + precio.toFixed(2) + " c/u)");
    }

    // Llena la entrada digital con los datos de la reserva
    function iniciarConfirmacion() {
        const entrada = document.querySelector(".entrada-digital");
        if (!entrada) {
            return;
        }

        const reserva = leerReserva();

        if (!reserva || !reserva.asientos || reserva.asientos.length === 0) {
            window.location.replace("resultado.html");
            return;
        }

        const pelicula = buscarPelicula(reserva.peliculaId);

        entrada.querySelector(".entrada-poster img").src = reserva.poster;
        entrada.querySelector(".entrada-poster img").alt = "Póster de " + reserva.titulo;
        entrada.querySelector(".entrada-pelicula-info h3").textContent = reserva.titulo;

        if (reserva.generos && reserva.generos.length) {
            entrada.querySelector(".entrada-genero").textContent =
                reserva.generos.slice(0, 2).join(" · ").toUpperCase();
        }

        if (pelicula) {
            entrada.querySelector(".entrada-pelicula-info p").textContent = pelicula.sinopsis.split(". ")[0] + ".";
        }

        const datos = entrada.querySelectorAll(".dato-entrada strong");
        datos[0].textContent = formatearFecha(reserva.fecha);
        datos[1].textContent = reserva.hora;
        datos[2].textContent = reserva.sede;
        datos[3].textContent = nombreSala(reserva.formato);

        const contenedorAsientos = entrada.querySelector(".asientos-confirmados");
        contenedorAsientos.textContent = "";
        reserva.asientos.forEach(function (codigo) {
            const span = document.createElement("span");
            span.textContent = codigo;
            contenedorAsientos.appendChild(span);
        });

        entrada.querySelector(".entrada-pie strong").textContent = reserva.codigo;

        const qr = document.querySelector(".qr-imagen img");
        if (qr) {
            qr.alt = "Código QR de la reserva " + reserva.codigo;
        }

        const filas = document.querySelectorAll(".resumen-pago .resumen-fila");
        const subtotal = reserva.subtotal || reserva.total;
        const descuento = reserva.descuento || 0;

        filas[0].querySelector("span").textContent = "Entradas (" + reserva.asientos.length + ")";
        filas[0].querySelector("strong").textContent = moneda(subtotal);

        if (descuento > 0) {
            const filaDescuento = filas[1].cloneNode(true);
            filaDescuento.classList.add("resumen-descuento");
            filaDescuento.querySelector("span").textContent = "Descuento (" + reserva.codigoPromo + ")";
            filaDescuento.querySelector("strong").textContent = "−" + moneda(descuento);
            filas[1].parentElement.insertBefore(filaDescuento, filas[1]);
        }

        filas[1].querySelector("strong").textContent = moneda(CARGO_SERVICIO);
        filas[2].querySelector("strong").textContent = moneda(reserva.total + CARGO_SERVICIO);

        document.title = "Reserva " + reserva.codigo + " | CineHub";

        document.querySelectorAll(".boton-inicio, .boton-cartelera").forEach(function (boton) {
            boton.addEventListener("click", function () {
                borrarReserva();
                borrarPromo();
            });
        });

        console.log("CineHub: reserva " + reserva.codigo + " mostrada");
    }

    iniciarSeleccion();
    iniciarHorarios();
    iniciarAsientos();
    iniciarConfirmacion();

})();