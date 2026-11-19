// Dulcería: carrito de productos con total, cantidades y guardado en localStorage

(function () {
    "use strict";

    const CLAVE = "cinehubCarrito";

    const tarjetas = document.querySelectorAll(".producto-card, .combo-card");
    if (tarjetas.length === 0) {
        return;
    }

    // Da formato de soles (S/) a un número
    function moneda(numero) {
        return "S/ " + numero.toFixed(2);
    }

    // Convierte el texto del precio en número
    function precioDe(texto) {
        const numero = parseFloat(texto.replace(/[^\d.]/g, ""));
        return isNaN(numero) ? 0 : numero;
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

    // Lee el carrito guardado en localStorage
    function leerCarrito() {
        try {
            const datos = JSON.parse(localStorage.getItem(CLAVE)) || {};
            const limpio = {};

            Object.keys(datos).forEach(function (nombre) {
                const item = datos[nombre];
                if (item && isFinite(item.precio) && item.cantidad > 0) {
                    limpio[nombre] = { precio: Number(item.precio), cantidad: Math.floor(item.cantidad) };
                }
            });

            return limpio;
        } catch (error) {
            return {};
        }
    }

    // Guarda el carrito en localStorage
    function guardarCarrito() {
        try {
            localStorage.setItem(CLAVE, JSON.stringify(carrito));
        } catch (error) {
            console.warn("CineHub: no se pudo guardar el carrito", error);
        }
    }

    let carrito = leerCarrito();

    let temporizadorAviso = null;

    // Muestra un aviso flotante por unos segundos
    function aviso(texto) {
        let caja = document.getElementById("aviso-flotante");

        if (!caja) {
            caja = crear("div", "aviso-flotante");
            caja.id = "aviso-flotante";
            caja.setAttribute("role", "status");
            document.body.appendChild(caja);
        }

        caja.textContent = texto;
        caja.classList.add("visible");

        clearTimeout(temporizadorAviso);
        temporizadorAviso = setTimeout(function () {
            caja.classList.remove("visible");
        }, 1800);
    }

    const botonCarrito = crear("button", "carrito-boton");
    botonCarrito.type = "button";
    botonCarrito.setAttribute("aria-controls", "carrito-panel");
    botonCarrito.setAttribute("aria-expanded", "false");

    const etiquetaCarrito = crear("span", "", "Mi pedido");
    const cantidadCarrito = crear("span", "carrito-cantidad", "0");
    const totalBoton = crear("strong", "", "S/ 0.00");
    botonCarrito.append(etiquetaCarrito, cantidadCarrito, totalBoton);

    const panel = crear("aside", "carrito-panel");
    panel.id = "carrito-panel";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Mi pedido");

    const cabecera = crear("div", "carrito-cabecera");
    const titulo = crear("h2", "", "Mi pedido");
    const cerrar = crear("button", "carrito-cerrar", "×");
    cerrar.type = "button";
    cerrar.setAttribute("aria-label", "Cerrar pedido");
    cabecera.append(titulo, cerrar);

    const lista = crear("ul", "carrito-lista");
    const vacio = crear("p", "carrito-vacio", "Aún no agregaste productos. Usa el botón + de cada producto.");

    const pie = crear("div", "carrito-pie");
    const filaTotal = crear("div", "carrito-total");
    filaTotal.append(crear("span", "", "Total"));
    const totalPanel = crear("strong", "", "S/ 0.00");
    filaTotal.appendChild(totalPanel);

    const acciones = crear("div", "carrito-acciones");
    const botonVaciar = crear("button", "carrito-vaciar", "Vaciar");
    botonVaciar.type = "button";
    const botonConfirmar = crear("button", "carrito-confirmar", "Confirmar pedido");
    botonConfirmar.type = "button";
    acciones.append(botonVaciar, botonConfirmar);

    pie.append(filaTotal, acciones);
    panel.append(cabecera, lista, vacio, pie);
    document.body.append(botonCarrito, panel);

    // Calcula la cantidad de productos y el total a pagar
    function totales() {
        let cantidad = 0;
        let total = 0;

        Object.keys(carrito).forEach(function (nombre) {
            cantidad += carrito[nombre].cantidad;
            total += carrito[nombre].cantidad * carrito[nombre].precio;
        });

        return { cantidad: cantidad, total: total };
    }

    // Suma o resta la cantidad de un producto
    function cambiarCantidad(nombre, diferencia) {
        if (!carrito[nombre]) {
            return;
        }

        carrito[nombre].cantidad += diferencia;

        if (carrito[nombre].cantidad <= 0) {
            delete carrito[nombre];
        }

        guardarCarrito();
        pintar();
    }

    // Dibuja el carrito en pantalla
    function pintar() {
        const resumen = totales();

        cantidadCarrito.textContent = String(resumen.cantidad);
        totalBoton.textContent = moneda(resumen.total);
        totalPanel.textContent = moneda(resumen.total);

        lista.textContent = "";

        Object.keys(carrito).forEach(function (nombre) {
            const item = carrito[nombre];
            const fila = crear("li", "carrito-item");

            const info = crear("div", "carrito-item-info");
            info.appendChild(crear("strong", "", nombre));
            info.appendChild(crear("span", "", moneda(item.precio) + " c/u"));

            const controles = crear("div", "carrito-controles");

            const menos = crear("button", "", "−");
            menos.type = "button";
            menos.setAttribute("aria-label", "Quitar una unidad de " + nombre);
            menos.addEventListener("click", function () {
                cambiarCantidad(nombre, -1);
            });

            const cantidad = crear("span", "", String(item.cantidad));

            const mas = crear("button", "", "+");
            mas.type = "button";
            mas.setAttribute("aria-label", "Agregar una unidad de " + nombre);
            mas.addEventListener("click", function () {
                cambiarCantidad(nombre, 1);
            });

            controles.append(menos, cantidad, mas);

            const subtotal = crear("strong", "carrito-subtotal", moneda(item.precio * item.cantidad));

            fila.append(info, controles, subtotal);
            lista.appendChild(fila);
        });

        const hayProductos = resumen.cantidad > 0;
        vacio.hidden = hayProductos;
        pie.hidden = !hayProductos;
    }

    // Muestra u oculta el panel del carrito
    function abrirPanel(abrir) {
        panel.hidden = !abrir;
        botonCarrito.setAttribute("aria-expanded", String(abrir));
    }

    botonCarrito.addEventListener("click", function () {
        abrirPanel(panel.hidden);
    });

    cerrar.addEventListener("click", function () {
        abrirPanel(false);
        botonCarrito.focus();
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && !panel.hidden) {
            abrirPanel(false);
            botonCarrito.focus();
        }
    });

    tarjetas.forEach(function (tarjeta) {
        const boton = tarjeta.querySelector(".producto-boton, .combo-pie button");
        const nombre = tarjeta.querySelector("h3").textContent.trim();
        const precio = precioDe(tarjeta.querySelector("strong").textContent);

        if (!boton || precio === 0) {
            return;
        }

        boton.setAttribute("aria-label", "Agregar " + nombre + " al pedido");

        boton.addEventListener("click", function () {
            if (carrito[nombre]) {
                carrito[nombre].cantidad += 1;
            } else {
                carrito[nombre] = { precio: precio, cantidad: 1 };
            }

            guardarCarrito();
            pintar();
            aviso(nombre + " agregado al pedido");
        });
    });

    botonVaciar.addEventListener("click", function () {
        if (confirm("¿Quieres vaciar todo tu pedido?")) {
            carrito = {};
            guardarCarrito();
            pintar();
        }
    });

    botonConfirmar.addEventListener("click", function () {
        const resumen = totales();

        if (resumen.cantidad === 0) {
            alert("Tu pedido está vacío.");
            return;
        }

        const detalle = Object.keys(carrito).map(function (nombre) {
            return carrito[nombre].cantidad + " × " + nombre;
        }).join("\n");

        if (!confirm("Tu pedido:\n\n" + detalle + "\n\nTotal: " + moneda(resumen.total) + "\n\n¿Confirmar?")) {
            return;
        }

        alert("¡Pedido registrado! Podrás recogerlo en la dulcería de tu sede.");

        carrito = {};
        guardarCarrito();
        pintar();
        abrirPanel(false);
    });

    const audio = document.getElementById("audio-fondo");

    if (audio) {
        audio.volume = 0.3;

        const botonMusica = crear("button", "boton-musica", "♪ Música");
        botonMusica.type = "button";
        botonMusica.setAttribute("aria-pressed", "false");
        document.body.appendChild(botonMusica);

        // Cambia el texto del botón de música
        function actualizarMusica() {
            botonMusica.setAttribute("aria-pressed", String(!audio.paused));
            botonMusica.textContent = audio.paused ? "♪ Música" : "♪ Pausar";
        }

        botonMusica.addEventListener("click", function () {
            if (audio.paused) {
                audio.play().then(actualizarMusica).catch(function () {
                    botonMusica.textContent = "Audio no disponible";
                    botonMusica.disabled = true;
                });
            } else {
                audio.pause();
                actualizarMusica();
            }
        });

        audio.play().then(actualizarMusica).catch(actualizarMusica);
    }

    pintar();
    console.log("CineHub: dulcería lista (" + tarjetas.length + " productos)");

})();