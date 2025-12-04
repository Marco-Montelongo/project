/* ============================================================
   form_2_2.js
   Implementación del formulario 2.2 usando formEngine.js
   ============================================================ */

(function () {

    // ----------------------------------------------------------
    // CAMPOS DE TEXTO (se integran al motor universal)
    // ----------------------------------------------------------
    const fields_2_2 = [
        {
            key: "funcion_principal",
            label: "Función principal del sistema técnico",
            max: 1200,
            help: "Identifica y describe la función principal del sistema técnico (1 párrafo)."
        },
        {
            key: "subfunciones",
            label: "Subfunciones necesarias",
            max: 1200,
            help: "Determina las subfunciones o funciones parciales necesarias para cumplir la función principal (1 párrafo)."
        },
        {
            key: "flujo",
            label: "Flujo de energía, materia o información",
            max: 1200,
            help: "Analiza el flujo entre las subfunciones que integran el sistema (1 párrafo)."
        },
        {
            key: "retroalimentacion",
            label: "Procesos de retroalimentación o control",
            max: 1200,
            help: "Reconoce los posibles procesos de retroalimentación o control entre las funciones (1 párrafo)."
        },
        {
            key: "componentes",
            label: "Componentes o mecanismos propuestos",
            max: 1200,
            help: "Propón los componentes o mecanismos que podrían cumplir cada subfunción (1 párrafo)."
        },
        {
            key: "interrelaciones",
            label: "Interrelación entre funciones",
            max: 1200,
            help: "Explica cómo se interrelacionan las funciones dentro del sistema técnico para su funcionamiento global (1 párrafo)."
        },
        {
            key: "descripcion_diagrama",
            label: "Descripción del diagrama funcional",
            max: 1500,
            help: "Descripción breve que acompaña al diagrama de sistemas funcionales (1 párrafo)."
        }
    ];

    // ----------------------------------------------------------
    // CAMPO ESPECIAL: CARGA DE IMAGEN
    // ----------------------------------------------------------
    function createImageField_2_2() {
        const wrapper = document.createElement("div");
        wrapper.className = "form-field";

        const label = document.createElement("label");
        label.className = "field-label";
        label.textContent = "Diagrama de sistemas funcionales (imagen)";
        wrapper.appendChild(label);

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.id = "diagram_2_2";
        input.className = "file-input";
        wrapper.appendChild(input);

        const preview = document.createElement("img");
        preview.id = "diagramPreview_2_2";
        preview.className = "img-preview";
        preview.style.display = "none";
        wrapper.appendChild(preview);

        // Vista previa + guardado inmediato
        input.addEventListener("change", () => {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = e => {
                preview.src = e.target.result;
                preview.style.display = "block";

                if (!window.PROYECTO) window.PROYECTO = {};
                if (!window.PROYECTO.formularios) window.PROYECTO.formularios = {};

                if (!window.PROYECTO.formularios["2.2"])
                    window.PROYECTO.formularios["2.2"] = {};

                window.PROYECTO.formularios["2.2"].diagrama = e.target.result;
            };
            reader.readAsDataURL(file);
        });

        return wrapper;
    }

    // ----------------------------------------------------------
    // Cargar imagen si existe
    // ----------------------------------------------------------
    function loadImageIfExists() {
        const data = window.PROYECTO?.formularios?.["2.2"];
        if (!data || !data.diagrama) return;

        const preview = document.getElementById("diagramPreview_2_2");
        if (preview) {
            preview.src = data.diagrama;
            preview.style.display = "block";
        }
    }

    // ----------------------------------------------------------
    // PDF ESPECIAL DEL FORMULARIO 2.2
    // ----------------------------------------------------------
    function pdfCustom_2_2(data) {
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({ unit: "pt", format: "letter" });
        const margin = 72;
        let y = margin;

        buildPDFHeader(pdf, "Descomposición funcional del sistema (2.2)").then(headerY => {

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

            // ---- CONTENIDO ----
            writeParagraph("Función principal del sistema técnico", data.funcion_principal || "");
            writeParagraph("Subfunciones necesarias", data.subfunciones || "");
            writeParagraph("Flujo entre subfunciones", data.flujo || "");
            writeParagraph("Retroalimentación o control", data.retroalimentacion || "");
            writeParagraph("Componentes o mecanismos propuestos", data.componentes || "");
            writeParagraph("Interrelación entre funciones", data.interrelaciones || "");
            writeParagraph("Descripción del diagrama funcional", data.descripcion_diagrama || "");

            // Imagen
            if (data.diagrama) {
                try {
                    pdf.addPage();
                    pdf.setFont("Times", "bold");
                    pdf.setFontSize(14);
                    pdf.text("Diagrama de sistemas funcionales", margin, margin);

                    const format = data.diagrama.startsWith("data:image/png") ? "PNG" :
                                   data.diagrama.startsWith("data:image/jpeg") ? "JPEG" :
                                   data.diagrama.startsWith("data:image/webp") ? "WEBP" :
                                   "PNG";

                    pdf.addImage(data.diagrama, format, margin, margin + 20, 400, 300);

                } catch (e) {
                    console.error("Error al insertar imagen:", e);
                }
            }

            pdf.save("formulario_2_2.pdf");

        });
    }

    // ----------------------------------------------------------
    // RENDERIZADOR PÚBLICO
    // ----------------------------------------------------------
    window.renderForm2_2 = function (containerId) {

        renderForm({
            id: "2.2",
            containerId,
            title: "2.2 Descomposición funcional del sistema",
            intro:
                "Completa cada apartado según las instrucciones. Incluye también el diagrama funcional.",
            fields: fields_2_2,
            pdfName: "formulario_2_2.pdf",
            pdfCustom: pdfCustom_2_2,

            customFields: [
                createImageField_2_2
            ]
        });

        loadImageIfExists();
    };

})();
