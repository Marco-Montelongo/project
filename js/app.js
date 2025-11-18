// js/app.js
(function (global) {
  document.addEventListener("DOMContentLoaded", () => {
    // Mostrar sección inicial
    if (window.UI && window.UI.mostrarRegistroEquipos) window.UI.mostrarRegistroEquipos();

    // Header buttons
    const downloadBtn = document.querySelector(".download-btn");
    if (downloadBtn) downloadBtn.addEventListener("click", () => {
      const data = (window.Forms && window.Forms.dataGeneral) ? window.Forms.dataGeneral : (window.Storage ? window.Storage.loadLocal() : { equipos: {} });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "proyecto_completo.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    const pinBtn = document.querySelector(".pin-btn");
    if (pinBtn) pinBtn.addEventListener("click", () => { window.Storage && window.Storage.pedirPinSiNoHay(); });

    // Define toggleMenu y guardarSeccionActualYCambiar (ya usados en tu HTML)
    window.toggleMenu = function () { document.getElementById("sidebarMenu").classList.toggle("show"); };

    window.guardarSeccionActualYCambiar = async function (nuevaSeccion) {
      try {
        const current = window.currentSection || null;

        if (current === "registroEquipos") {
          const grupo = document.getElementById("numGrupo")?.value?.trim();
          const equipo = document.getElementById("numEquipo")?.value?.trim();
          const semestre = document.getElementById("semestre")?.value || "";
          const integrantes = document.getElementById("integrantesText")?.value.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 7) || [];

          if (grupo && equipo) {
            await window.Forms.guardarEquipo({ grupo, equipo, semestre, integrantes });
          } else {
            // guardar temporal local
            const data = Storage.loadLocal();
            data.tempRegistro = { semestre, integrantes };
            Storage.saveLocal(data);
          }
        }
      } catch (err) {
        console.error("Error autosave:", err);
      } finally {
        // cambiar vista
        if (nuevaSeccion === "registroEquipos") window.UI.mostrarRegistroEquipos();
        else if (nuevaSeccion === "identificarNecesidad") window.UI.mostrarIdentificarNecesidad();
        else window.UI.mostrarRegistroEquipos();
        // cerrar menú en móvil
        document.getElementById("sidebarMenu").classList.remove("show");
      }
    };
  });
})(window);

// Función para descargar JSON
window.descargarProyecto = function() {
    const data = window.Forms.dataGeneral || { equipos: {} };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proyecto_completo.json";
    a.click();
    URL.revokeObjectURL(url);
};

window.generarPDF = function() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    return alert("jsPDF no está cargado.");
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const data = window.Forms.dataGeneral || { equipos: {} };
  let y = 10;

  for (const key in data.equipos) {
    const equipo = data.equipos[key];
    doc.setFontSize(12);
    doc.text(`Equipo: ${key}`, 10, y); y += 8;
    if (equipo.registroEquipos) {
      doc.text(`Integrantes: ${equipo.registroEquipos.integrantes.join(", ")}`, 10, y); y += 8;
    }
    if (equipo.identificarNecesidad) {
      const n = equipo.identificarNecesidad;
      doc.text(`Situación: ${n.situacion}`, 10, y); y += 8;
      doc.text(`Contexto: ${n.contexto}`, 10, y); y += 8;
      doc.text(`Personas afectadas: ${n.afectados}`, 10, y); y += 8;
      doc.text(`Consecuencias: ${n.consecuencias}`, 10, y); y += 8;
      doc.text(`Intentos: ${n.intentosFallidos}`, 10, y); y += 8;
      doc.text(`Recursos: ${n.recursosLimitantes}`, 10, y); y += 8;
      doc.text(`Síntesis: ${n.sintesisFinal}`, 10, y); y += 12;
    }
    y += 4;
    if (y > 280) { doc.addPage(); y = 10; }
  }

  doc.save("reporte_necesidades.pdf");
};


