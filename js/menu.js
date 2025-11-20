const menuData = [
    {
        id: "elaboracionProblema",
        title: "1. Elaboración del problema",
        items: [
            { id: "1_1", label: "1.1 Identificación de la necesidad" },
            { id: "1_2", label: "1.2 Definir el problema" },
            { id: "1_3", label: "1.3 Búsqueda de información" },
            { id: "1_4", label: "1.4 Especificaciones y requerimientos" },
            { id: "1_5", label: "1.5 Plan de trabajo" }
        ]
    },
    {
        id: "disenoConceptual",
        title: "2. Diseño Conceptual",
        items: [
            { id: "2_1", label: "2.1 Diagrama de caja negra" },
            { id: "2_2", label: "2.2 Definición de sistemas funcionales" },
            { id: "2_3", label: "2.3 Generación de conceptos" },
            { id: "2_4", label: "2.4 Matriz morfológica" },
            { id: "2_5", label: "2.5 Matriz de decisión" },
            { id: "2_6", label: "2.6 Propuesta de diseño conceptual" }
        ]
    }
];

function renderMenu() {
    const container = document.getElementById("sidebarContent");
    container.innerHTML = "";

    menuData.forEach(section => {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "sidebar-section";

        const title = document.createElement("div");
        title.className = "sidebar-title";
        title.textContent = section.title;

        const subitems = document.createElement("div");
        subitems.className = "sidebar-subitems";

        section.items.forEach(item => {
            const sub = document.createElement("div");
            sub.className = "sidebar-subitem";
            sub.textContent = item.label;

            sub.addEventListener("click", () => {
                loadForm(item.id);
            });

            subitems.appendChild(sub);
        });

        title.addEventListener("click", () => {
            subitems.style.display =
                subitems.style.display === "block" ? "none" : "block";
        });

        sectionDiv.appendChild(title);
        sectionDiv.appendChild(subitems);
        container.appendChild(sectionDiv);
    });
}

function loadForm(id) {
  const contentId = "content-area"; // el id de tu main
  if (id === "1_1") {
    // si usas módulos estáticos, asegúrate de haber incluido <script src="form_1_1.js"></script>
    if (window.renderForm1_1) {
      window.renderForm1_1(contentId);
    } else {
      console.error("form_1_1 no cargado");
      document.getElementById(contentId).innerText = "Formulario no disponible.";
    }
    return;
  }

  if (id === "1_2") {
    // si usas módulos estáticos, asegúrate de haber incluido <script src="form_1_1.js"></script>
    if (window.renderForm1_2) {
      window.renderForm1_2(contentId);
    } else {
      console.error("form_1_2 no cargado");
      document.getElementById(contentId).innerText = "Formulario no disponible.";
    }
    return;
  }

  if (id === "1_3") {
    // si usas módulos estáticos, asegúrate de haber incluido <script src="form_1_1.js"></script>
    if (window.renderForm1_3) {
      window.renderForm1_3(contentId);
    } else {
      console.error("form_1_3 no cargado");
      document.getElementById(contentId).innerText = "Formulario no disponible.";
    }
    return;
  }

  if (id === "1_4") {
    // si usas módulos estáticos, asegúrate de haber incluido <script src="form_1_1.js"></script>
    if (window.renderForm1_4) {
      window.renderForm1_4(contentId);
    } else {
      console.error("form_1_4 no cargado");
      document.getElementById(contentId).innerText = "Formulario no disponible.";
    }
    return;
  }

  if (id === "1_5") {
    // si usas módulos estáticos, asegúrate de haber incluido <script src="form_1_1.js"></script>
    if (window.renderForm1_5) {
      window.renderForm1_5(contentId);
    } else {
      console.error("form_1_5 no cargado");
      document.getElementById(contentId).innerText = "Formulario no disponible.";
    }
    return;
  }

  // otros casos...
  document.getElementById(contentId).innerHTML = "<p>Formulario aún no implementado.</p>";
}


renderMenu();
