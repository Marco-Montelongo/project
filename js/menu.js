const menuData = [
  {
    id: "inicio",
    title: "Inicio",
    items: [
      { id: "home", label: "Página principal" }
    ]
  },
  {
    id: "equipoInfo",
    title: "Datos del equipo",
    items: [
      { id: "equipo", label: "Equipo y Proyecto" }
    ]
  },
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

      sub.addEventListener("click", () => loadForm(item.id));
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
  const contentId = "content-area";

  if (id === "home") {
    return handleFormLoad("renderHome", contentId, "home");
  }


  // ---- FORMULARIOS DEL EQUIPO ----
  if (id === "equipo") {
    return handleFormLoad("renderForm_Equipo", contentId, "form_equipo");
  }

  // ---- FORMULARIOS 1.X ----
  if (id === "1_1") return handleFormLoad("renderForm1_1", contentId, "form_1_1");
  if (id === "1_2") return handleFormLoad("renderForm1_2", contentId, "form_1_2");
  if (id === "1_3") return handleFormLoad("renderForm1_3", contentId, "form_1_3");
  if (id === "1_4") return handleFormLoad("renderForm1_4", contentId, "form_1_4");
  if (id === "1_5") return handleFormLoad("renderForm1_5", contentId, "form_1_5");

  // ---- FORMULARIOS 2.X ----
  if (id === "2_1") return handleFormLoad("renderForm2_1", contentId, "form_2_1");
  if (id === "2_2") return handleFormLoad("renderForm2_2", contentId, "form_2_2");
  if (id === "2_3") return handleFormLoad("renderForm2_3", contentId, "form_2_3");
  if (id === "2_4") return handleFormLoad("renderForm2_4", contentId, "form_2_4");
  if (id === "2_5") return handleFormLoad("renderForm2_5", contentId, "form_2_5");
  if (id === "2_6") return handleFormLoad("renderForm2_6", contentId, "form_2_6");

  document.getElementById(contentId).innerHTML = "<p>Formulario aún no implementado.</p>";
}

function handleFormLoad(functionName, contentId, errorName) {
  if (window[functionName]) {
    window[functionName](contentId);
  } else {
    console.error(`${errorName} no cargado`);
    document.getElementById(contentId).innerText = "Formulario no disponible.";
  }
}

renderMenu();
loadForm("home"); // Cargar la página principal al inicio

