// Ambientes: cambia colores, cursor, sonido y efectos de la página según el género de la película

const EFECTOS_SIN_PARTICULAS = ["parpadeo", "corte", "telarana", "cuenta-atras"];

// Revisa si el usuario pidió menos animaciones en su sistema
function prefiereMenosMovimiento() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Pone los colores del ambiente en el body usando variables CSS
function aplicarAmbiente(ambiente, clave) {
    const cuerpo = document.body;
    cuerpo.dataset.ambiente = clave;
    cuerpo.dataset.asientos = ambiente.asientos;
    cuerpo.style.setProperty("--acento", ambiente.acento);
    cuerpo.style.setProperty("--acento-rgb", ambiente.acentoRgb);
}

// Activa el cursor personalizado del género (solo con mouse)
function iniciarCursor(tipo) {
    const hayRaton = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hayRaton || prefiereMenosMovimiento()) {
        return;
    }

    const cursor = document.createElement("div");
    cursor.className = "cursor-ambiente";
    cursor.dataset.tipo = tipo;
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);

    let objetivoX = -100;
    let objetivoY = -100;
    let actualX = -100;
    let actualY = -100;

    document.addEventListener("mousemove", function (evento) {
        objetivoX = evento.clientX;
        objetivoY = evento.clientY;
        cursor.classList.add("visible");
    });

    document.addEventListener("mouseleave", function () {
        cursor.classList.remove("visible");
    });

    document.addEventListener("mouseover", function (evento) {
        cursor.classList.toggle("grande", Boolean(evento.target.closest("a, button")));
    });

    // Mueve el cursor personalizado de forma suave hacia el mouse
    function seguir() {
        actualX += (objetivoX - actualX) * 0.18;
        actualY += (objetivoY - actualY) * 0.18;
        cursor.style.transform = "translate(" + actualX + "px, " + actualY + "px)";
        requestAnimationFrame(seguir);
    }

    seguir();
}

// Muestra la animación de apertura una vez por película
function reproducirApertura(pelicula, ambiente, forzar) {
    if (prefiereMenosMovimiento()) {
        return;
    }

    const clave = "cinehubApertura_" + pelicula.id;

    if (!forzar) {
        try {
            if (sessionStorage.getItem(clave)) {
                return;
            }
            sessionStorage.setItem(clave, "1");
        } catch (error) {

        }
    }

    const tipo = ambiente.apertura;

    const capa = document.createElement("div");
    capa.className = "apertura";
    capa.dataset.tipo = tipo;

    const efecto = document.createElement("div");
    efecto.className = "apertura-efecto";
    efecto.setAttribute("aria-hidden", "true");

    if (EFECTOS_SIN_PARTICULAS.indexOf(tipo) === -1) {
        for (let i = 0; i < 28; i++) {
            const particula = document.createElement("span");
            particula.className = "apertura-particula";
            particula.style.setProperty("--x", Math.random() * 100 + "%");
            particula.style.setProperty("--y", Math.random() * 100 + "%");
            particula.style.setProperty("--t", (3 + Math.random() * 9) + "px");
            particula.style.setProperty("--d", (Math.random() * 0.9) + "s");
            particula.style.setProperty("--h", Math.floor(Math.random() * 360));
            efecto.appendChild(particula);
        }
    }

    if (tipo === "cuenta-atras") {
        ["3", "2", "1"].forEach(function (numero) {
            const b = document.createElement("b");
            b.textContent = numero;
            efecto.appendChild(b);
        });
    }

    const texto = document.createElement("div");
    texto.className = "apertura-texto";

    const nombre = document.createElement("span");
    nombre.textContent = ambiente.nombre;

    const titulo = document.createElement("h2");
    titulo.textContent = pelicula.titulo;

    const frase = document.createElement("p");
    frase.textContent = ambiente.frase;

    texto.append(nombre, titulo, frase);

    const saltar = document.createElement("button");
    saltar.type = "button";
    saltar.className = "apertura-saltar";
    saltar.textContent = "Saltar";

    capa.append(efecto, texto, saltar);
    document.body.appendChild(capa);
    document.body.classList.add("apertura-activa");

    // Cierra la animación de apertura
    function cerrar() {
        capa.remove();
        document.body.classList.remove("apertura-activa");
        document.removeEventListener("keydown", alPulsarTecla);
    }

    // Permite saltar la animación de apertura con el teclado
    function alPulsarTecla(evento) {
        if (evento.key === "Escape") {
            cerrar();
        }
    }

    saltar.addEventListener("click", cerrar);
    document.addEventListener("keydown", alPulsarTecla);

    capa.addEventListener("animationend", function (evento) {
        if (evento.animationName === "aperturaSalida") {
            cerrar();
        }
    });

    setTimeout(cerrar, 4200);
}

// Configura el botón que activa o apaga el sonido ambiente
function iniciarSonido(boton, ambiente) {
    const audio = new Audio(RUTAS.audio + ambiente.audio);
    audio.loop = true;
    audio.volume = 0.35;

    let sonando = false;

    // Cambia el texto del botón según si el sonido está activo
    function actualizarBoton() {
        boton.setAttribute("aria-pressed", String(sonando));
        boton.textContent = sonando ? "Silenciar ambiente" : "Activar sonido";
    }

    boton.addEventListener("click", function () {
        if (sonando) {
            audio.pause();
            sonando = false;
            actualizarBoton();
            return;
        }

        audio.play().then(function () {
            sonando = true;
            actualizarBoton();
        }).catch(function () {

            boton.textContent = "Audio no disponible";
            boton.disabled = true;
        });
    });

    window.addEventListener("pagehide", function () {
        audio.pause();
    });
}

// Hace una animación al tocar un asiento de la sala de ejemplo
function animarAsiento(asiento) {
    asiento.classList.remove("asiento-animar");
    void asiento.offsetWidth;
    asiento.classList.add("asiento-animar");

    asiento.addEventListener("animationend", function () {
        asiento.classList.remove("asiento-animar");
    }, { once: true });
}

// Aplica el ambiente completo de la película y lo devuelve
function activarAmbiente(pelicula, forzarApertura) {
    const ambiente = ambientacionDe(pelicula);
    if (!ambiente) {
        return null;
    }

    aplicarAmbiente(ambiente, pelicula.ambientacion);
    iniciarCursor(ambiente.cursor);
    reproducirApertura(pelicula, ambiente, forzarApertura);

    return ambiente;
}