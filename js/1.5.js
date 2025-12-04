/* ============================================================
   form_1_5.js
   Formulario 1.5 utilizando el motor común formEngine.js
   Con soporte de carga de imagen para el diagrama de Gantt
   ============================================================ */

(function () {

    // ----------------------------------------------------------
    // CAMPOS DE TEXTO (motor universal)
    // ----------------------------------------------------------
    const fields_1_5 = [
        { key: "etapas", label: "Etapas principales", max: 2000, help: "Identifica y organiza las etapas principales del proyecto." },
        { key: "actividades", label: "Actividades por etapa", max: 3000, help: "Describe las actividades específicas de cada etapa." },
        { key: "tiempos", label: "Estimación de tiempos", max: 2000, help: "Estima el tiempo necesario de cada actividad (cronograma preliminar)." },
        { key: "responsables", label: "Responsables y roles", max: 2000, help: "Indica responsables y roles de cada tarea." },
        { key: "resultados", label: "Resultados intermedios", max: 2000, help: "Explica los productos o resultados al finalizar cada fase." },
        { key: "gantt", label: "Diagrama de Gantt (resumen)", max: 5000, help: "Pega un resumen textual o tabla del diagrama de Gantt." }
    ];

    // ----------------------------------------------------------
    // CAMPO ESPECIAL: CARGA DE IMAGEN PARA GANTT
    // ----------------------------------------------------------
    function createImageField_1_5() {
        const wrapper = document.createElement("div");
        wrapper.className = "form-field";

        const label = document.createElement("label");
        label.className = "field-label";
        label.textContent = "Diagrama de Gantt (imagen)";
        wrapper.appendChild(label);

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.id = "ganttImg_1_5";
        input.className = "file-input";
        wrapper.appendChild(input);

        const preview = document.createElement("img");
        preview.id = "ganttPreview_1_5";
        preview.className = "img-preview";
        preview.style.display = "none";
        wrapper.appendChild(preview);

        // Vista previa + guardado
        input.addEventListener("change", () => {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = e => {
                preview.src = e.target.result;
                preview.style.display = "block";

                if (!window.PROYECTO) window.PROYECTO = {};
                if (!window.PROYECTO.formularios) window.PROYECTO.formularios = {};
                if (!window.PROYECTO.formularios["1.5"])
                    window.PROYECTO.formularios["1.5"] = {};

                window.PROYECTO.formularios["1.5"].ganttImg = e.target.result;
            };

            reader.readAsDataURL(file);
        });

        return wrapper;
    }

    // ----------------------------------------------------------
    // Cargar imagen si ya existía
    // ----------------------------------------------------------
    function loadImageIfExists_1_5() {
        const data = window.PROYECTO?.formularios?.["1.5"];
        if (!data || !data.ganttImg) return;

        const preview = document.getElementById("ganttPreview_1_5");
        if (preview) {
            preview.src = data.ganttImg;
            preview.style.display = "block";
        }
    }

    // ----------------------------------------------------------
    // PDF PERSONALIZADO
    // ----------------------------------------------------------
    async function pdfCustom_1_5(data) {
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({ unit: "pt", format: "letter" });
        const margin = 72;
        let y = margin;

        // --- INSERTAR ENCABEZADO ---
        buildPDFHeader(pdf, "Plan de Trabajo (1.5)").then(headerY => {
            y = headerY;

            function writeParagraph(title, text) {
                pdf.setFont("Times", "bold");
                pdf.setFontSize(14);
                pdf.text(title, margin, y);
                y += 20;

                pdf.setFont("Times", "normal");
                pdf.setFontSize(12);

                const lines = pdf.splitTextToSize(
                    text,
                    pdf.internal.pageSize.width - margin * 2
                );

                lines.forEach(line => {
                    if (y > pdf.internal.pageSize.height - margin) {
                        pdf.addPage();
                        y = margin;
                    }
                    pdf.text(line, margin, y, { align: "justify" });
                    y += 18;
                });

                y += 10;
            }

            // --- Contenido del formulario ---
            writeParagraph("Etapas principales", data.etapas || "");
            writeParagraph("Actividades por etapa", data.actividades || "");
            writeParagraph("Estimación de tiempos", data.tiempos || "");
            writeParagraph("Responsables y roles", data.responsables || "");
            writeParagraph("Resultados intermedios", data.resultados || "");
            writeParagraph("Diagrama de Gantt (resumen textual)", data.gantt || "");

            // --- Imagen del diagrama de Gantt ---
            if (data.ganttImg) {
                pdf.addPage();
                pdf.setFont("Times", "bold");
                pdf.setFontSize(14);
                pdf.text("Diagrama de Gantt (imagen)", margin, margin);

                const format = data.ganttImg.startsWith("data:image/jpeg") ? "JPEG" :
                    data.ganttImg.startsWith("data:image/webp") ? "WEBP" : "PNG";

                try {
                    pdf.addImage(data.ganttImg, format, margin, margin + 20, 400, 300);
                } catch (e) {
                    console.error("Error insertando imagen en PDF 1.5:", e);
                }
            }

            pdf.save("formulario_1_5_plan_trabajo.pdf");
        });
    }

    // ----------------------------------------------------------
    // RENDERIZADOR PRINCIPAL
    // ----------------------------------------------------------
    window.renderForm1_5 = function (containerId) {
        renderForm({
            id: "1.5",
            containerId,
            title: "1.5 Plan de trabajo",
            intro: "Proporciona un plan claro: etapas, actividades, tiempos, responsables y resultados. " +
                "Puedes incluir el diagrama de Gantt como imagen.",
            fields: fields_1_5,
            pdfName: "formulario_1_5_plan_trabajo.pdf",
            pdfCustom: pdfCustom_1_5,

            customFields: [
                createImageField_1_5
            ]
        });

        loadImageIfExists_1_5();
    };

})();
