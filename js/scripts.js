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

function generarPDF() {
    
}
