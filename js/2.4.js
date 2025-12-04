/* ============================================================
   2.4.js — Basado en 2.3.js para Matriz Morfológica
   ============================================================ */

(function () {

    const formId = "2.4";

    // ---------- CAMPOS DEL FORMULARIO ----------
    const fields_24 = [
        {
            key: "subfunciones",
            label: "Subfunciones Principales del Sistema",
            max: 1200,
            rows: 6,
            help: "Identifica las subfunciones principales que componen el sistema técnico."
        },
        {
            key: "alternativas",
            label: "Alternativas de Solución",
            max: 1200,
            rows: 6,
            help: "Enumera y describe las alternativas de solución disponibles para cada subfunción."
        },
        {
            key: "compatibilidad",
            label: "Compatibilidad de Alternativas",
            max: 1200,
            rows: 6,
            help: "Examina qué alternativas son compatibles entre sí y pueden integrarse funcionalmente."
        },
        {
            key: "conceptos",
            label: "Nuevos Conceptos Integrales",
            max: 1200,
            rows: 6,
            help: "Explora y formula nuevos conceptos integrales que resulten de la combinación de diferentes opciones."
        },
        {
            key: "evaluacion",
            label: "Evaluación de Combinaciones",
            max: 1200,
            rows: 6,
            help: "Evalúa las combinaciones posibles considerando costo, materiales, complejidad, mantenimiento e impacto ambiental."
        },
        {
            key: "seleccion",
            label: "Selección de Mejores Configuraciones",
            max: 1200,
            rows: 6,
            help: "Determina qué combinaciones ofrecen mejor desempeño técnico y mayor facilidad de uso."
        },
        {
            key: "matriz",
            label: "Matriz Morfológica y Bocetos",
            max: 1500,
            rows: 8,
            help: "Construye una matriz morfológica con subfunciones y alternativas, generando al menos tres configuraciones completas representadas mediante esquemas o bocetos conceptuales."
        }
    ];

    // ---------- CAMPO DE IMAGEN (Bocetos o esquemas) ----------
    function fieldImagenMatriz() {
        const wrapper = document.createElement("div");
        wrapper.className = "form-field";

        const label = document.createElement("label");
        label.className = "field-label";
        label.textContent = "Bocetos / Esquemas Conceptuales (imagen)";
        wrapper.appendChild(label);

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.className = "img-input";
        wrapper.appendChild(input);

        const preview = document.createElement("img");
        preview.className = "img-preview";
        preview.style.maxWidth = "360px";
        preview.style.display = "none";
        wrapper.appendChild(preview);

        // cargar desde memoria si existe
        if (window.PROYECTO?.formularios?.[formId]?.diagrama) {
            preview.src = window.PROYECTO.formularios[formId].diagrama;
            preview.style.display = "block";
        }

        input.onchange = () => {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
                preview.style.display = "block";

                if (!window.PROYECTO) window.PROYECTO = {};
                if (!window.PROYECTO.formularios) window.PROYECTO.formularios = {};
                if (!window.PROYECTO.formularios[formId]) window.PROYECTO.formularios[formId] = {};

                window.PROYECTO.formularios[formId].diagrama = reader.result;
            };
            reader.readAsDataURL(file);
        };

        return wrapper;
    }

    // ---------- PDF PERSONALIZADO ----------
    async function pdfCustom_24(data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ unit: "pt", format: "letter" });

        const margin = 72;

        // --- ENCABEZADO GLOBAL ---
        let y = await buildPDFHeader(pdf, "2.4 Matriz Morfológica");

        pdf.setFont("Times");

        function write(title, text) {
            pdf.setFont("Times", "bold");
            pdf.setFontSize(14);
            pdf.text(title, margin, y);
            y += 22;

            pdf.setFont("Times", "normal");
            pdf.setFontSize(12);

            const lines = pdf.splitTextToSize(text, 470);
            for (const line of lines) {
                if (y >= 720) {  // salto de página
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(line, margin, y);
                y += 16;
            }
            y += 12;
        }

        // --- PREGUNTAS ---
        write("Subfunciones Principales del Sistema", data.subfunciones || "");
        write("Alternativas de Solución", data.alternativas || "");
        write("Compatibilidad de Alternativas", data.compatibilidad || "");
        write("Nuevos Conceptos Integrales", data.conceptos || "");
        write("Evaluación de Combinaciones", data.evaluacion || "");
        write("Selección de Mejores Configuraciones", data.seleccion || "");
        write("Matriz Morfológica y Bocetos", data.matriz || "");

        // ------ IMAGEN (Bocetos) ------
        if (data.diagrama) {
            if (y > 550) {
                pdf.addPage();
                y = margin;
            }

            try {
                pdf.addImage(data.diagrama, "PNG", margin, y, 300, 300);
                y += 320;
            } catch (e) {
                console.error("Error insertando imagen:", e);
            }
        }

        pdf.save("2.4_Matriz_Morfológica.pdf");
    }

    // ---------- RENDERIZAR FORMULARIO ----------
    window.renderForm2_4 = function (containerId) {
        renderForm({
            id: formId,
            containerId,
            title: "2.4 Matriz Morfológica",
            intro: "Registro de subfunciones, alternativas y combinaciones para generar conceptos integrales de diseño.",
            fields: fields_24,
            pdfName: "2.4_Matriz_Morfológica.pdf",
            integrantes: false,
            customFields: [fieldImagenMatriz],
            pdfCustom: pdfCustom_24
        });
    };

})();
