window.PROYECTO = {
    formularios: {}
};

function toggleMenu() {
    document.getElementById("sidebarMenu").classList.toggle("active");
}

function descargarProyecto() {
    const data = window.PROYECTO || {};

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proyecto.json";
    a.click();
    URL.revokeObjectURL(url);
}

// -----------------------------------------------------------
// CARGAR DATOS DESDE UN JSON
// -----------------------------------------------------------
async function loadProjectData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const json = JSON.parse(text);

            // Validación mínima
            if (typeof json !== "object" || json === null) {
                alert("El archivo JSON no es válido.");
                return;
            }

            // Se llena la variable global
            window.PROYECTO = json;

            alert("Proyecto cargado correctamente.");
        } catch (error) {
            console.error("Error al leer JSON:", error);
            alert("Hubo un error al cargar el archivo JSON.");
        }
    };

    // Abre el selector de archivos
    input.click();
}

function generarPDF() {
    // Aquí completarás luego
}
