// Promociones: guarda el código de la promo elegida y la marca en pantalla

(function () {
    "use strict";

    const CLAVE = "cinehubPromo";

    const CODIGOS = {
        "doble diversion":    { codigo: "DOBLE2X1",  tipo: "2x1",        valor: 0,  minimo: 2, detalle: "2x1 en entradas" },
        "plan en familia":    { codigo: "FAMILIA15", tipo: "porcentaje", valor: 15, minimo: 1, detalle: "15 % en entradas" },
        "semana de estrenos": { codigo: "ESTRENO10", tipo: "porcentaje", valor: 10, minimo: 1, detalle: "10 % en entradas" },
        "juntos es mejor":    { codigo: "GRUPO20",   tipo: "porcentaje", valor: 20, minimo: 4, detalle: "20 % desde 4 entradas" }
    };

    const tarjetas = document.querySelectorAll(".promo-card");
    if (tarjetas.length === 0) {
        return;
    }

    // Pasa el texto a minúsculas y sin tildes para comparar
    function normalizar(texto) {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    // Lee la promoción activa guardada
    function leerActiva() {
        try {
            const datos = JSON.parse(localStorage.getItem(CLAVE));
            return datos && datos.codigo ? datos.codigo : null;
        } catch (error) {
            return null;
        }
    }

    // Guarda la promoción elegida en localStorage
    function guardarActiva(promo, titulo) {
        try {
            if (promo) {
                localStorage.setItem(CLAVE, JSON.stringify({
                    codigo: promo.codigo,
                    nombre: titulo,
                    tipo: promo.tipo,
                    valor: promo.valor,
                    minimo: promo.minimo,
                    detalle: promo.detalle
                }));
            } else {
                localStorage.removeItem(CLAVE);
            }
        } catch (error) {
            console.warn("CineHub: no se pudo guardar la promoción", error);
        }
    }

    let temporizadorAviso = null;

    // Muestra un aviso flotante por unos segundos
    function aviso(texto) {
        let caja = document.getElementById("aviso-flotante");

        if (!caja) {
            caja = document.createElement("div");
            caja.className = "aviso-flotante";
            caja.id = "aviso-flotante";
            caja.setAttribute("role", "status");
            document.body.appendChild(caja);
        }

        caja.textContent = texto;
        caja.classList.add("visible");

        clearTimeout(temporizadorAviso);
        temporizadorAviso = setTimeout(function () {
            caja.classList.remove("visible");
        }, 2200);
    }

    const botones = [];

    // Marca la tarjeta de la promoción activa
    function marcar(codigoActivo) {
        botones.forEach(function (item) {
            const activo = item.promo.codigo === codigoActivo;
            item.boton.classList.toggle("activo", activo);
            item.boton.setAttribute("aria-pressed", String(activo));
            item.boton.textContent = activo
                ? "✓ Código " + item.promo.codigo + " activo · Quitar"
                : "Usar código " + item.promo.codigo;
        });
    }

    tarjetas.forEach(function (tarjeta) {
        const titulo = tarjeta.querySelector("h3").textContent.trim();
        const promo = CODIGOS[normalizar(titulo)];

        if (!promo) {
            return;
        }

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "promo-codigo";
        boton.setAttribute("aria-pressed", "false");

        boton.addEventListener("click", function () {
            const yaActivo = leerActiva() === promo.codigo;

            if (yaActivo) {
                guardarActiva(null);
                marcar(null);
                aviso("Código " + promo.codigo + " quitado");
                return;
            }

            guardarActiva(promo, titulo);
            marcar(promo.codigo);

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(promo.codigo).catch(function () {  });
            }

            aviso("Código " + promo.codigo + " activado: " + promo.detalle);
        });

        tarjeta.querySelector(".promo-informacion").appendChild(boton);
        botones.push({ boton: boton, promo: promo });
    });

    marcar(leerActiva());
    console.log("CineHub: promociones listas (" + botones.length + " con código)");

})();