/* ============================================================
   2.6.js — Basado en 2.5.js para Propuesta de Diseño Conceptual
   ============================================================ */

(function () {

    const formId = "2.6";

    // ---------- CAMPOS DEL FORMULARIO ----------
    const fields_26 = [
        {
            key: "caracteristicas",
            label: "Características del Concepto Elegido",
            max: 1200,
            rows: 3,
            help: "Identifica y describe las características principales que distinguen al concepto elegido frente a las otras alternativas."
        },
        {
            key: "articulacion",
            label: "Articulación de Funciones",
            max: 1200,
            rows: 3,
            help: "Analiza cómo se articulan las funciones dentro del sistema técnico final."
        },
        {
            key: "principio",
            label: "Principio de Funcionamiento",
            max: 1200,
            rows: 3,
            help: "Explica el principio de funcionamiento que rige el diseño y las ventajas que ofrece."
        },
        {
            key: "materiales",
            label: "Materiales y Componentes",
            max: 1200,
            rows: 3,
            help: "Propón los materiales, mecanismos o componentes considerados en esta etapa."
        },
        {
            key: "materiales",
            label: "Relación Usuario-Sistema",
            max: 1200,
            rows: 3,
            help: "Analiza la relación del usuario con el sistema, considerando ergonomía, accesibilidad e interacción."
        },
        {
            key: "estetica",
            label: "Criterios Estéticos",
            max: 1200,
            rows: 3,
            help: "Describe los criterios estéticos, formales o de identidad incorporados en la propuesta."
        },
        {
            key: "contexto",
            label: "Contexto de Aplicación",
            max: 1200,
            rows: 3,
            help: "Examina cómo la propuesta responde al contexto social, ambiental o institucional en que se desarrollará."
        },
        {
            key: "propuestaIntegral",
            label: "Propuesta Integral de Diseño",
            max: 1500,
            rows: 8,
            help: "Desarrolla una propuesta integral que sintetice el proceso realizado, incluyendo bocetos, esquema funcional y descripción técnica breve, con justificación basada en la matriz de decisión."
        }
    ];

    // ---------- CAMPO DE IMAGEN (Opcional para bocetos / esquema funcional) ----------
    function fieldImagenPropuesta() {
        const wrapper = document.createElement("div");
        wrapper.className = "form-field";

        const label = document.createElement("label");
        label.className = "field-label";
        label.textContent = "Bocetos / Esquema Funcional (imagen opcional)";
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
    async function pdfCustom_26(data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ unit: "pt", format: "letter" });

        const margin = 72;

        // --- ENCABEZADO GLOBAL ---
        let y = await buildPDFHeader(pdf, "2.6 Propuesta de Diseño Conceptual");

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
        write("Características del Concepto Elegido", data.caracteristicas || "");
        write("Articulación de Funciones", data.funciones || "");
        write("Principio de Funcionamiento", data.principio || "");
        write("Materiales y Componentes", data.materiales || "");
        write("Relación Usuario-Sistema", data.usuario || "");
        write("Criterios Estéticos", data.estetica || "");
        write("Contexto de Aplicación", data.contexto || "");
        write("Propuesta Integral de Diseño", data.propuesta_integral || "");

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

        pdf.save("2.6_Propuesta_de_Diseño_Conceptual.pdf");
    }

    // ---------- RENDERIZAR FORMULARIO ----------
    window.renderForm2_6 = function (containerId) {
        renderForm({
            id: formId,
            containerId,
            title: "2.6 Propuesta de Diseño Conceptual",
            intro: "Registro de la propuesta de diseño conceptual, incluyendo descripción técnica, bocetos, esquema funcional y justificación basada en la matriz de decisión.",
            fields: fields_26,
            pdfName: "2.6_Propuesta_de_Diseño_Conceptual.pdf",
            integrantes: false,
            customFields: [fieldImagenPropuesta],
            pdfCustom: pdfCustom_26
        });
    };

})();
