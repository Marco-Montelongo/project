/* ============================================================
   2.5.js — Basado en 2.3.js / 2.4.js para Matriz de Decisión
   ============================================================ */

(function () {

    const formId = "2.5";

    // ---------- CAMPOS DEL FORMULARIO ----------
    const fields_25 = [
        {
            key: "criterios",
            label: "Criterios de Evaluación",
            max: 1200,
            rows: 6,
            help: "Define los criterios de evaluación relevantes para el proyecto."
        },
        {
            key: "peso",
            label: "Peso de los Criterios",
            max: 1200,
            rows: 6,
            help: "Asigna un peso o importancia relativa a cada criterio dentro de la evaluación general."
        },
        {
            key: "alternativas",
            label: "Alternativas de Concepto",
            max: 1200,
            rows: 6,
            help: "Selecciona las alternativas de concepto que serán objeto de comparación."
        },
        {
            key: "analisis",
            label: "Análisis de Desempeño",
            max: 1200,
            rows: 6,
            help: "Analiza el desempeño de cada concepto frente a cada criterio establecido."
        },
        {
            key: "puntaje",
            label: "Cálculo de Puntaje",
            max: 1200,
            rows: 6,
            help: "Calcula el puntaje total o ponderado obtenido por cada alternativa."
        },
        {
            key: "seleccion",
            label: "Concepto Seleccionado",
            max: 1200,
            rows: 6,
            help: "Determina y justifica qué concepto resulta más equilibrado y viable según los resultados."
        },
        {
            key: "matriz",
            label: "Matriz de Decisión y Justificación",
            max: 1500,
            rows: 8,
            help: "Elabora la matriz de decisión comparando alternativas frente a criterios, asigna valores ponderados y califica numéricamente. Incluye un párrafo breve justificando la elección del concepto seleccionado."
        }
    ];

    // ---------- CAMPO DE IMAGEN (Opcional para la matriz) ----------
    function fieldImagenMatrizDecision() {
        const wrapper = document.createElement("div");
        wrapper.className = "form-field";

        const label = document.createElement("label");
        label.className = "field-label";
        label.textContent = "Matriz de Decisión (imagen opcional)";
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
    async function pdfCustom_25(data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ unit: "pt", format: "letter" });

        const margin = 72;

        // --- ENCABEZADO GLOBAL ---
        let y = await buildPDFHeader(pdf, "2.5 Matriz de Decisión");

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
        write("Criterios de Evaluación", data.criterios || "");
        write("Peso de los Criterios", data.peso || "");
        write("Alternativas de Concepto", data.alternativas || "");
        write("Análisis de Desempeño", data.analisis || "");
        write("Cálculo de Puntaje", data.puntaje || "");
        write("Concepto Seleccionado", data.seleccion || "");
        write("Matriz de Decisión y Justificación", data.matriz || "");

        // ------ IMAGEN (Opcional) ------
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

        pdf.save("2.5_Matriz_de_Decisión.pdf");
    }

    // ---------- RENDERIZAR FORMULARIO ----------
    window.renderForm2_5 = function (containerId) {
        renderForm({
            id: formId,
            containerId,
            title: "2.5 Matriz de Decisión",
            intro: "Registro de criterios, alternativas y puntajes para seleccionar la mejor opción de concepto.",
            fields: fields_25,
            pdfName: "2.5_Matriz_de_Decisión.pdf",
            integrantes: false,
            customFields: [fieldImagenMatrizDecision],
            pdfCustom: pdfCustom_25
        });
    };

})();
