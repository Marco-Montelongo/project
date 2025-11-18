/****************************************************
 * MENÚ DINÁMICO ACORDEÓN PARA sidebarMenu
 ****************************************************/

const menuData = [
    { type: "link", label: "Registro de equipos", section: "registroEquipos" },
    { type: "link", label: "Selección de equipos", section: "seleccionEquipos" },

    {
        type: "group",
        label: "1. Elaboración del problema",
        items: [
            { label: "1.1 Identificación de la necesidad", section: "identificarNecesidad" },
            { label: "1.2 Definir el problema", section: "definirProblema" },
            { label: "1.3 Búsqueda de información", section: "buscarInformación" },
            { label: "1.4 Especificaciones y requerimientos", section: "especificacionesRequerimientos" },
            { label: "1.5 Plan de trabajo", section: "planTrabajo" }
        ]
    },

    {
        type: "group",
        label: "2. Diseño conceptual",
        items: [
            { label: "2.1 Diagrama de caja negra", section: "cajaNegra" },
            { label: "2.2 Sistemas funcionales", section: "sistemaFuncional" },
            { label: "2.3 Generación de conceptos", section: "conceptosSistemaFuncional" },
            { label: "2.4 Matriz morfológica", section: "matrizMorfologica" },
            { label: "2.5 Matriz de decisión", section: "matrizDecision" },
            { label: "2.6 Diseño conceptual", section: "diseñoConceptual" }
        ]
    }
];

function generarMenu() {
    const sidebar = document.getElementById("sidebarMenu");
    sidebar.innerHTML = "";

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.textContent = "✕";
    closeBtn.onclick = toggleMenu;
    sidebar.appendChild(closeBtn);

    menuData.forEach((item, idx) => {
        if (item.type === "link") {
            const h3 = document.createElement("h3");
            h3.className = "clickable";
            h3.textContent = item.label;
            h3.onclick = () => guardarSeccionActualYCambiar(item.section);
            sidebar.appendChild(h3);
        }

        if (item.type === "group") {
            const groupHeader = document.createElement("h3");
            groupHeader.className = "menu-group-title";
            groupHeader.textContent = item.label;

            const ul = document.createElement("ul");
            ul.className = "submenu hidden";

            item.items.forEach(sub => {
                const li = document.createElement("li");
                li.textContent = sub.label;
                li.onclick = () => guardarSeccionActualYCambiar(sub.section);
                ul.appendChild(li);
            });

            groupHeader.addEventListener("click", () => {
                ul.classList.toggle("hidden");
            });

            sidebar.appendChild(groupHeader);
            sidebar.appendChild(ul);
        }
    });
}

document.addEventListener("DOMContentLoaded", generarMenu);
