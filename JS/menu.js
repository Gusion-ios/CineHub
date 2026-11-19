// Menú responsive: crea el botón hamburguesa y abre o cierra el menú

(function () {
    "use strict";

    const ANCHO_MOVIL = 1050;

    document.addEventListener("DOMContentLoaded", iniciarMenu);

    // Busca las partes del header, crea el botón y activa los eventos
    function iniciarMenu() {
        const encabezado = document.querySelector(".encabezado");
        if (!encabezado) {
            return;
        }

        // Evita crear dos botones si el script se carga dos veces
        if (encabezado.querySelector(".boton-menu")) {
            return;
        }

        const navegacion = encabezado.querySelector(".navegacion");
        const acciones = encabezado.querySelector(".acciones-encabezado");
        const menu = encabezado.querySelector(".menu");
        if (!navegacion || !acciones || !menu) {
            return;
        }

        menu.id = menu.id || "menu-principal";

        // Crea el botón hamburguesa con createElement porque no está en el HTML
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "boton-menu";
        boton.setAttribute("aria-label", "Abrir menú");
        boton.setAttribute("aria-expanded", "false");
        boton.setAttribute("aria-controls", menu.id);
        boton.innerHTML = "<span></span><span></span><span></span>";
        acciones.appendChild(boton);

        // Muestra el menú agregando la clase "navegacion-abierta"
        function abrirMenu() {
            navegacion.classList.add("navegacion-abierta");
            boton.setAttribute("aria-expanded", "true");
            boton.setAttribute("aria-label", "Cerrar menú");
        }

        // Oculta el menú quitando la clase "navegacion-abierta"
        function cerrarMenu() {
            navegacion.classList.remove("navegacion-abierta");
            boton.setAttribute("aria-expanded", "false");
            boton.setAttribute("aria-label", "Abrir menú");
        }

        // Abre el menú si está cerrado y lo cierra si está abierto
        function alternarMenu() {
            if (navegacion.classList.contains("navegacion-abierta")) {
                cerrarMenu();
            } else {
                abrirMenu();
            }
        }

        // Un solo click en el header atiende al botón y a los enlaces (delegación)
        encabezado.addEventListener("click", function (evento) {
            const zona = evento.currentTarget;
            const objetivo = evento.target;

            if (objetivo.closest(".boton-menu") === zona.querySelector(".boton-menu")) {
                alternarMenu();
            } else if (objetivo.closest("a") && objetivo.closest(".menu")) {

                cerrarMenu();
            }
        });

        // Cierra el menú con la tecla Esc
        document.addEventListener("keydown", function (evento) {
            if (evento.key === "Escape") {
                cerrarMenu();
                boton.focus();
            }
        });

        // Cierra el menú al hacer click fuera del header
        document.addEventListener("click", function (evento) {
            if (!encabezado.contains(evento.target)) {
                cerrarMenu();
            }
        });

        // Cierra el menú si la pantalla pasa de 1050px
        window.addEventListener("resize", function () {
            if (window.innerWidth > ANCHO_MOVIL) {
                cerrarMenu();
            }
        });

        console.log("CineHub: menú responsive listo");
    }

})();