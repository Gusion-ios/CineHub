// Contacto: valida el formulario, cuenta caracteres y muestra el modal de gracias

(function () {
    "use strict";

    const CLAVE_MENSAJES = "cinehubMensajes";
    const LIMITE_MENSAJE = 500;

    const formulario = document.querySelector(".formulario-contacto");
    if (!formulario) {
        return;
    }

    if (formulario.dataset.listo === "si") {
        return;
    }
    formulario.dataset.listo = "si";

    formulario.noValidate = true;

    const nombre = document.getElementById("nombre");
    const telefono = document.getElementById("telefono");
    const correo = document.getElementById("correo");
    const asunto = document.getElementById("asunto");
    const mensaje = document.getElementById("mensaje");

    const reglas = {
        nombre: function (valor) {
            if (valor.length < 3) {
                return "Escribe tu nombre completo (mínimo 3 letras).";
            }
            if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(valor)) {
                return "El nombre solo puede tener letras y espacios.";
            }
            return "";
        },
        telefono: function (valor) {
            if (valor === "") {
                return "";   /* es opcional */
            }
            const digitos = valor.replace(/[\s-]/g, "");
            if (!/^9\d{8}$/.test(digitos)) {
                return "Ingresa un celular de 9 dígitos que empiece con 9.";
            }
            return "";
        },
        correo: function (valor) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
                return "Escribe un correo válido, por ejemplo nombre@correo.com.";
            }
            return "";
        },
        mensaje: function (valor) {
            if (valor.length < 10) {
                return "Cuéntanos un poco más (mínimo 10 caracteres).";
            }
            return "";
        }
    };

    const campos = { nombre: nombre, telefono: telefono, correo: correo, mensaje: mensaje };

    /* Ventana flotante de "mensaje enviado" */
    const ventanaGracias = crearModal(document.getElementById("modal-gracias"));

    /* ---------- Mostrar / quitar errores ---------- */
    // Muestra u oculta el mensaje de error de un campo
    function mostrarError(campo, texto) {
        const contenedor = campo.closest(".campo");
        let aviso = contenedor.querySelector(".campo-error");

        if (texto === "") {
            if (aviso) {
                aviso.remove();
            }
            campo.removeAttribute("aria-invalid");
            campo.removeAttribute("aria-describedby");
            return;
        }

        if (!aviso) {
            aviso = document.createElement("small");
            aviso.className = "campo-error";
            aviso.id = "error-" + campo.id;
            contenedor.appendChild(aviso);
        }

        aviso.textContent = texto;
        campo.setAttribute("aria-invalid", "true");
        campo.setAttribute("aria-describedby", aviso.id);
    }

    // Valida un campo según sus reglas
    function validarCampo(clave) {
        const campo = campos[clave];
        const error = reglas[clave](campo.value.trim());
        mostrarError(campo, error);
        return error === "";
    }

    Object.keys(campos).forEach(function (clave) {
        campos[clave].addEventListener("blur", function () {
            validarCampo(clave);
        });

        /* Si ya tenía error, se corrige mientras escribe */
        campos[clave].addEventListener("input", function () {
            if (campos[clave].hasAttribute("aria-invalid")) {
                validarCampo(clave);
            }
        });
    });

    /* ---------- Contador de caracteres del mensaje ---------- */
    mensaje.maxLength = LIMITE_MENSAJE;

    const contador = document.createElement("small");
    contador.className = "campo-contador";
    mensaje.closest(".campo").appendChild(contador);

    // Actualiza el contador de caracteres del mensaje
    function actualizarContador() {
        contador.textContent = mensaje.value.length + " / " + LIMITE_MENSAJE;
    }

    mensaje.addEventListener("input", actualizarContador);
    actualizarContador();

    /* ---------- Guardar el mensaje (envío simulado) ---------- */
    // Guarda el mensaje enviado en localStorage
    function guardarMensaje(datos) {
        try {
            const lista = JSON.parse(localStorage.getItem(CLAVE_MENSAJES)) || [];
            lista.push(datos);
            localStorage.setItem(CLAVE_MENSAJES, JSON.stringify(lista));
        } catch (error) {
            console.warn("CineHub: no se pudo guardar el mensaje", error);
        }
    }

    /* ---------- Envío ---------- */
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        /* 1. Validar todo y enfocar el primer error */
        let primerError = null;

        Object.keys(campos).forEach(function (clave) {
            if (!validarCampo(clave) && !primerError) {
                primerError = campos[clave];
            }
        });

        if (primerError) {
            primerError.focus();
            return;
        }

        /* 2. Si no dejó teléfono, se lo ofrecemos (hasta 3 intentos) */
        if (telefono.value.trim() === "") {
            let intentos = 0;
            let respuesta;

            do {
                respuesta = prompt(
                    "No dejaste un teléfono.\n" +
                    "Escríbelo (9 dígitos) o pulsa Cancelar para continuar sin él:"
                );

                /* Cancelar o vacío: continúa sin teléfono */
                if (respuesta === null || respuesta.trim() === "") {
                    break;
                }

                telefono.value = respuesta.trim();
                intentos++;
            } while (!validarCampo("telefono") && intentos < 3);

            /* Si escribió algo y sigue siendo inválido, se vuelve al campo */
            if (telefono.value.trim() !== "" && !validarCampo("telefono")) {
                telefono.focus();
                return;
            }
        }

        /* 3. Confirmar */
        const textoAsunto = asunto.options[asunto.selectedIndex].textContent;

        if (!confirm("¿Enviar tu mensaje sobre «" + textoAsunto + "»?")) {
            return;
        }

        /* 4. "Enviar": se recogen los datos con FormData y se guardan */
        const datos = Object.fromEntries(new FormData(formulario));
        console.table(datos);

        guardarMensaje({
            nombre: nombre.value.trim(),
            telefono: telefono.value.trim(),
            correo: correo.value.trim(),
            asunto: textoAsunto,
            mensaje: mensaje.value.trim(),
            fecha: new Date().toISOString()
        });

        /* 5. Ventana de agradecimiento (reemplaza a alert()) */
        document.getElementById("modal-gracias-nombre").textContent = nombre.value.trim().split(" ")[0];
        ventanaGracias.abrir();

        formulario.reset();
        actualizarContador();
        Object.keys(campos).forEach(function (clave) {
            mostrarError(campos[clave], "");
        });
    });

    console.log("CineHub: formulario de contacto listo");

})();