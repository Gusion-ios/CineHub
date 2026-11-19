// Modal: función reutilizable para abrir y cerrar ventanas emergentes

// Devuelve las funciones abrir y cerrar de un modal
function crearModal(modal) {
    "use strict";

    let ultimoFoco = null;

    // Lista los elementos que se pueden enfocar dentro del modal
    function enfocables() {
        return modal.querySelectorAll("button, a[href], input, select, textarea");
    }

    // Muestra el modal y manda el foco adentro
    function abrir() {
        ultimoFoco = document.activeElement;
        modal.hidden = false;
        document.body.classList.add("sin-scroll");

        const inicial = modal.querySelector("[data-modal-foco]") || enfocables()[0];
        if (inicial) {
            inicial.focus();
        }
    }

    // Oculta el modal y devuelve el foco a donde estaba
    function cerrar() {
        modal.hidden = true;
        document.body.classList.remove("sin-scroll");

        if (ultimoFoco) {
            ultimoFoco.focus();
        }
    }

    modal.addEventListener("click", function (evento) {
        if (evento.target === modal || evento.target.closest("[data-modal-cerrar]")) {
            cerrar();
        }
    });

    document.addEventListener("keydown", function (evento) {
        if (modal.hidden) {
            return;
        }

        if (evento.key === "Escape") {
            cerrar();
            return;
        }

        if (evento.key === "Tab") {
            const lista = Array.from(enfocables());
            const primero = lista[0];
            const ultimo = lista[lista.length - 1];

            if (evento.shiftKey && document.activeElement === primero) {
                evento.preventDefault();
                ultimo.focus();
            } else if (!evento.shiftKey && document.activeElement === ultimo) {
                evento.preventDefault();
                primero.focus();
            }
        }
    });

    return { abrir: abrir, cerrar: cerrar };
}