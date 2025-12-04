/* ============================================================
   2.3.js — ARREGLADO PARA FUNCIONAR CON buildPDFHeader()
   ============================================================ */

(function () {

    const formId = "2.3";

    // ---------- CAMPOS DEL FORMULARIO ----------
    const fields_23 = [
        {
            key: "formas",
            label: "Exploración de Configuraciones Eficientes",
            max: 1200,
            rows: 6,
            help: "Explora qué formas o configuraciones permitirían cumplir la función con mayor eficiencia, seguridad o facilidad de uso."
        },
        {
            key: "referentes",
            label: "Análisis de Productos Referentes",
            max: 1200,
            rows: 6,
            help: "Identifica y compara referentes o productos que resuelvan funciones similares, señalando los elementos que podrían adaptarse."
        },
        {
            key: "mecanismos",
            label: "Propuesta de Mecanismos y Principios Físicos",
            max: 1200,
            rows: 6,
            help: "Propón mecanismos, materiales o principios físicos capaces de realizar cada subfunción."
        },
        {
            key: "integracion",
            label: "Integración de Soluciones Parciales",
            max: 1200,
            rows: 6,
            help: "Analiza cómo podrían integrarse o articularse las distintas soluciones parciales dentro del sistema general."
        },
        {
            key: "limitaciones",
            label: "Limitaciones y Condicionantes",
            max: 1200,
            rows: 6,
            help: "Examina las limitaciones económicas, técnicas, ambientales o espaciales que influyen en cada propuesta."
        },
        {
            key: "propuestas",
            label: "Propuestas y Alternativas para Subfunciones",
            max: 1500,
            rows: 8,
            help: "Propón y representa tres conceptos o alternativas para cada subfunción del sistema."
        }
    ];


    // ---------- CAMPO DE IMAGEN (MISMO FORMATO QUE 2.2) ----------
    function fieldImagenDiagrama() {
        const wrapper = document.createElement("div");
        wrapper.className = "form-field";

        const label = document.createElement("label");
        label.className = "field-label";
        label.textContent = "Generación de conceptos (imagen)";
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
    async function pdfCustom_23(data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ unit: "pt", format: "letter" });

        const margin = 72;

        // --- ENCABEZADO GLOBAL ---
        let y = await buildPDFHeader(pdf, "2.3 Funciones del Sistema");

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

        // --- NUEVAS PREGUNTAS ---
        write("Exploración de Configuraciones Eficientes", data.eficiencia || "");
        write("Análisis de Productos Referentes", data.referentes || "");
        write("Propuesta de Mecanismos y Principios Físicos", data.mecanismos || "");
        write("Integración de Soluciones Parciales", data.integracion || "");
        write("Limitaciones y Condicionantes", data.limitaciones || "");
        write("Propuestas y Alternativas para Subfunciones", data.alternativas || "");

        // ------ IMAGEN (MISMA LÓGICA QUE 2.2) ------
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

        pdf.save("2.3_Generacón_de_Conceptos.pdf");
    }


    // ---------- RENDERIZAR FORMULARIO ----------
    window.renderForm2_3 = function (containerId) {
        renderForm({
            id: formId,
            containerId,
            title: "2.3 Generación de Conceptos",
            intro: "Registro de conceptos y alternativas de diseño para cada subfunción del sistema.",
            fields: fields_23,
            pdfName: "2.3_Funciones_del_Sistema.pdf",
            integrantes: false,
            customFields: [fieldImagenDiagrama],
            pdfCustom: pdfCustom_23
        });
    };

})();
