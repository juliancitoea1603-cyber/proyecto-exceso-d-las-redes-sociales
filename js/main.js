function cargarpagina(pagina) {
    fetch('pages/' + pagina)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la página');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('contenido').innerHTML = data;

            // Si la página es bienvenida.html, actualiza el nombre
            if (pagina === "bienvenida.html") {
                const nombreGuardado = localStorage.getItem("nombreUsuario");
                if (nombreGuardado) {
                    document.getElementById("nombre").innerHTML = nombreGuardado;
                }
            }

            localStorage.setItem("paginaActual", pagina);
        })
        .catch(error => {
            document.getElementById('contenido').innerHTML = "<p>Error cargando el contenido</p>";
            console.error(error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const paginaGuardada = localStorage.getItem("paginaActual");
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    
    if (nombreGuardado) {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("appContent").style.display = "block";
    } else {
        document.getElementById("appContent").style.display = "none";
    }

    if (paginaGuardada) {
        cargarpagina(paginaGuardada);
    } else {
        cargarpagina("bienvenida.html");
    }

    // Manejo del inicio de sesión
    document.getElementById("formLogin").addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("inputNombre").value.trim();
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

        if (!nombre || !regex.test(nombre)) {
            mostrarAlerta("Ingrese un nombre válido", "alert-danger");
        } else {
            localStorage.setItem("nombreUsuario", nombre);
            cargarpagina("bienvenida.html"); // Carga la página de bienvenida
            document.getElementById("loginScreen").style.display = "none";
            document.getElementById("appContent").style.display = "block";
        }
    });
});

// Función para mostrar alerta
function mostrarAlerta(mensaje, clase) {
    const alertContainer = document.getElementById("alertContainer");
    alertContainer.innerHTML = `
        <div class="alert ${clase} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    setTimeout(() => {
        alertContainer.innerHTML = "";
    }, 3000);
}


document.addEventListener("DOMContentLoaded", function () {
    const videoModal = document.getElementById("videoModal");
    const videoFrame = document.getElementById("videoFrame");
    const videoTitle = document.getElementById("videoModalTitle");

    if (videoModal) {
        videoModal.addEventListener("show.bs.modal", function (event) {
            const button = event.relatedTarget;

            const videoUrl = button.getAttribute("data-video");
            const title = button.getAttribute("data-title");

            videoTitle.textContent = title;

            // Si es un enlace externo (como YouTube), le agregamos autoplay.
            // Si es un archivo local .html, lo cargamos directamente.
            if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
                let separator = videoUrl.includes("?") ? "&" : "?";
                videoFrame.src = videoUrl + separator + "autoplay=1";
            } else {
                videoFrame.src = videoUrl;
            }
        });

        videoModal.addEventListener("hidden.bs.modal", function () {
            videoFrame.src = "";
        });
    }
});