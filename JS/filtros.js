// Filtros: buscador de películas y filtros de la página de horarios

(function () {
    "use strict";

    // Pasa el texto a minúsculas y sin tildes para comparar
    function normalizar(texto) {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    // Activa el buscador y el género en seleccion-pelicula
    function iniciarFiltrosSeleccion() {
        const buscador = document.getElementById("buscar-pelicula");
        const selectorGenero = document.getElementById("genero");
        const contador = document.getElementById("contador-peliculas");
        const sinResultados = document.getElementById("sin-resultados");
        const tarjetas = document.querySelectorAll(".pelicula-compra-card");

        if (!buscador || !selectorGenero || tarjetas.length === 0) {
            return;
        }

        // Muestra solo las películas que coinciden y actualiza el contador
        function filtrar() {
            const texto = normalizar(buscador.value);
            const genero = selectorGenero.value;
            let visibles = 0;

            tarjetas.forEach(function (tarjeta) {
                const titulo = normalizar(tarjeta.dataset.titulo || "");
                const coincideTexto = titulo.indexOf(texto) !== -1;
                const coincideGenero = genero === "todos" || tarjeta.dataset.genero === genero;
                const mostrar = coincideTexto && coincideGenero;

                tarjeta.hidden = !mostrar;

                if (mostrar) {
                    visibles++;
                }
            });

            contador.textContent = visibles + (visibles === 1 ? " película disponible" : " películas disponibles");

            if (sinResultados) {
                sinResultados.hidden = visibles !== 0;
            }
        }

        buscador.addEventListener("input", filtrar);
        selectorGenero.addEventListener("change", filtrar);

        buscador.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter") {
                evento.preventDefault();
            }
        });

        filtrar();
        console.log("CineHub: filtros de selección listos (" + tarjetas.length + " películas)");
    }

    // Activa los filtros de sede, formato y género en horarios
    function iniciarFiltrosHorarios() {
        const selectorSede = document.getElementById("filtro-sede");
        const selectorFormato = document.getElementById("filtro-formato");
        const selectorGenero = document.getElementById("filtro-genero");
        const sinFunciones = document.getElementById("sin-funciones");
        const funciones = document.querySelectorAll(".funcion-pelicula");

        if (!selectorSede || !selectorFormato || !selectorGenero || funciones.length === 0) {
            return;
        }

        // Muestra solo las funciones que coinciden con los filtros
        function filtrar() {
            const sede = selectorSede.value;
            const formato = selectorFormato.value;
            const genero = selectorGenero.value;
            let visibles = 0;

            funciones.forEach(function (funcion) {

                const sedes = (funcion.dataset.sede || "").split(" ");

                const coincideSede = sede === "" || sedes.indexOf(sede) !== -1;
                const coincideFormato = formato === "" || funcion.dataset.formato === formato;
                const coincideGenero = genero === "" || funcion.dataset.genero === genero;
                const mostrar = coincideSede && coincideFormato && coincideGenero;

                funcion.hidden = !mostrar;

                if (mostrar) {
                    visibles++;
                }
            });

            if (sinFunciones) {
                sinFunciones.hidden = visibles !== 0;
            }
        }

        [selectorSede, selectorFormato, selectorGenero].forEach(function (selector) {
            selector.addEventListener("change", filtrar);
        });

        filtrar();
        console.log("CineHub: filtros de horarios listos (" + funciones.length + " películas)");
    }

    iniciarFiltrosSeleccion();
    iniciarFiltrosHorarios();

})();