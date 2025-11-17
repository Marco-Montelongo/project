import { renderMenu } from "../view/renderListView.js";
import { menuData } from "../model/exercisesModel.js";

document.addEventListener("DOMContentLoaded", () => {
  renderMenu(menuData);
});


document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".menu-toggle");

  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const submenu = btn.nextElementSibling;
      if (submenu) submenu.style.display = submenu.style.display === "block" ? "none" : "block";
    });
  });
});

// Función para autoajustar altura de textareas
function autoResizeTextarea(textarea) {
  textarea.style.height = "auto"; // reset
  textarea.style.height = textarea.scrollHeight + "px";
}

// Seleccionar todos los textareas y agregar evento
document.querySelectorAll("textarea").forEach(textarea => {
  textarea.classList.add("auto-height");
  textarea.addEventListener("input", () => autoResizeTextarea(textarea));
});

// Manejo del formulario
const needsForm = document.getElementById("needsForm");
const output = document.getElementById("output");

needsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {};
  new FormData(needsForm).forEach((value, key) => {
    data[key] = value.trim();
  });

  const jsonData = JSON.stringify(data, null, 2);
  output.textContent = jsonData;
  console.log("Datos guardados:", jsonData);

  // Limpiar formulario si se desea
  // needsForm.reset();
});

// appController.js
document.querySelectorAll('#sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault(); // evitar salto brusco
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth', // desplazamiento suave
        block: 'start'      // al inicio de la sección
      });
    }
  });
});

