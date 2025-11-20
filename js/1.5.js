/* form_1_5.js
   Renderiza formulario 1.5 (Plan de trabajo) y genera PDF.
   Misma lógica, estilo y APIs que los demás módulos (1.1 - 1.4)
*/

(function () {

    // -------- CAMPOS DEL FORMULARIO -----------------
    const fields = [
        { key: "etapas", label: "Etapas principales", max: 2000, help: "Identifica y organiza las etapas principales que componen el desarrollo del proyecto de diseño (1 párrafo o esquema)." },
        { key: "actividades", label: "Actividades por etapa", max: 3000, help: "Define y describe las actividades específicas que se deben realizar en cada etapa, relacionándolas con los objetivos del proyecto (1 párrafo o tabla)." },
        { key: "tiempos", label: "Estimación de tiempos", max: 2000, help: "Estima el tiempo necesario para el desarrollo de cada actividad; puedes usar formato de tabla o listado (cronograma preliminar)." },
        { key: "responsables", label: "Responsables y roles", max: 2000, help: "Asigna los responsables de cada tarea o conjunto de actividades, indicando el rol que desempeñará cada integrante (tabla)." },
        { key: "resultados", label: "Resultados intermedios", max: 2000, help: "Determina y explica los resultados o productos intermedios que deben obtenerse al finalizar cada fase (1 párrafo o esquema)." },
        { key: "gantt", label: "Diagrama de Gantt (resumen)", max: 5000, help: "Diseña o describe el diagrama de Gantt o cronograma equivalente. Si no es posible generar gráfico, pega un resumen o tabla textual." }
    ];

    // ----------- CREAR CAMPO -----------------------
    function createField(field) {
        const wrapper = document.createElement("div");
        wrapper.className = "form-field";

        const label = document.createElement("label");
        label.className = "field-label";
        label.htmlFor = `ta_${field.key}`;
        label.textContent = field.label;
        wrapper.appendChild(label);

        const taWrapper = document.createElement("div");
        taWrapper.className = "textarea-wrapper";

        const textarea = document.createElement("textarea");
        textarea.id = `ta_${field.key}`;
        textarea.className = "field-textarea";
        textarea.rows = (field.key === "gantt") ? 10 : 6;
        textarea.maxLength = field.max;
        textarea.placeholder = field.help;
        taWrapper.appendChild(textarea);

        const counter = document.createElement("div");
        counter.className = "char-counter";
        counter.textContent = `0 / ${field.max}`;
        taWrapper.appendChild(counter);

        textarea.addEventListener("input", () => {
            const len = textarea.value.length;
            counter.textContent = `${len} / ${field.max}`;
            counter.classList.toggle("limit-reached", len >= field.max);
        });

        wrapper.appendChild(taWrapper);
        return wrapper;
    }

    // ------------ CONSTRUCCIÓN DEL FORMULARIO ----------------
    function buildForm(container) {
        container.innerHTML = "";

        const title = document.createElement("h2");
        title.textContent = "1.5 Plan de trabajo";
        container.appendChild(title);

        const intro = document.createElement("p");
        intro.className = "form-intro";
        intro.textContent =
            "Proporciona un plan claro: etapas, actividades, tiempos, responsables y resultados. Para el Gantt puedes pegar un resumen textual o tabla si no subes un gráfico.";
        container.appendChild(intro);

        const form = document.createElement("form");
        form.className = "form-1-5";
        form.addEventListener("submit", (e) => e.preventDefault());

        fields.forEach(f => form.appendChild(createField(f)));

        // ------------------ BOTONES ---------------------
        const actions = document.createElement("div");
        actions.className = "form-actions";

        // Botón Guardar
        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.className = "btn-save";
        saveBtn.textContent = "Guardar";
        saveBtn.onclick = () => guardarFormulario(container);
        actions.appendChild(saveBtn);

        // Botón Generar PDF
        const pdfBtn = document.createElement("button");
        pdfBtn.type = "button";
        pdfBtn.className = "btn-pdf";
        pdfBtn.textContent = "Generar PDF";
        pdfBtn.onclick = generarPDF;
        actions.appendChild(pdfBtn);

        form.appendChild(actions);
        container.appendChild(form);
    }

    // ------- GUARDAR ---------
    function guardarFormulario(container) {
        const data = {};
        fields.forEach(f => {
            const el = document.getElementById(`ta_${f.key}`);
            data[f.key] = el ? el.value.trim() : "";
        });

        if (!window.PROYECTO) window.PROYECTO = {};
        if (!window.PROYECTO.formularios) window.PROYECTO.formularios = {};

        window.PROYECTO.formularios["1.5"] = data;

        showSaved(container);
    }

    // ------- NOTA DE GUARDADO ---------
    function showSaved(container) {
        let note = container.querySelector(".saved-note");
        if (!note) {
            note = document.createElement("div");
            note.className = "saved-note";
            note.textContent = "Datos guardados.";
            container.insertBefore(note, container.querySelector(".form-1-5"));
        }
        note.style.opacity = "1";
        setTimeout(() => {
            note.style.opacity = "0";
            setTimeout(() => note.remove(), 400);
        }, 1600);
    }

    // ========= GENERAR PDF LOCAL DEL FORMULARIO ===========
    function generarPDF() {
        const data = {};
        fields.forEach(f => {
            const el = document.getElementById(`ta_${f.key}`);
            data[f.key] = el ? el.value.trim() : "";
        });
        generarPDF_Form1_5(data);
    }

    // -------- EXPONER FUNCIÓN DE RENDER ----------------
    window.renderForm1_5 = function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error("renderForm1_5: contenedor no encontrado:", containerId);
            return;
        }
        buildForm(container);
        const firstText = container.querySelector(".field-textarea");
        if (firstText) firstText.focus();
    };

    // ----------- GENERAR PDF FINAL -----------------------
    window.generarPDF_Form1_5 = function (data) {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert("Error: jsPDF no está cargado.");
            return;
        }

        const pdf = new jsPDF({ unit: "pt", format: "letter" });
        const margin = 72; // 1"
        const lineSpacing = 1.5;
        let y = margin;

        function ensurePageFor(linesNeeded, lineHeight) {
            const pageHeight = pdf.internal.pageSize.height;
            if (y + (linesNeeded * lineHeight) > pageHeight - margin) {
                pdf.addPage();
                y = margin;
            }
        }

        function writeParagraph(title, text) {
            pdf.setFont("Times", "bold");
            pdf.setFontSize(14);
            pdf.text(title, margin, y);
            y += 20;

            pdf.setFont("Times", "normal");
            pdf.setFontSize(12);

            const lines = pdf.splitTextToSize(text || "", pdf.internal.pageSize.width - margin * 2);
            const lh = 14 * lineSpacing;
            ensurePageFor(lines.length, lh);

            lines.forEach(line => {
                if (y > pdf.internal.pageSize.height - margin) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(line, margin, y, { align: "justify" });
                y += lh;
            });

            y += 10;
        }

        // Escribir secciones
        writeParagraph("1. Etapas principales", data.etapas || "");
        writeParagraph("2. Actividades por etapa", data.actividades || "");
        writeParagraph("3. Estimación de tiempos (cronograma preliminar)", data.tiempos || "");
        writeParagraph("4. Responsables y roles", data.responsables || "");
        writeParagraph("5. Resultados o productos intermedios", data.resultados || "");

        // GANTT / CRONOGRAMA: si el usuario pegó tabla o resumen textual lo imprimimos, intento de formato tipo tabla textual
        pdf.setFont("Times", "bold");
        pdf.setFontSize(14);
        pdf.text("6. Diagrama de Gantt / Cronograma (resumen)", margin, y);
        y += 20;

        pdf.setFont("Times", "normal");
        pdf.setFontSize(12);

        const ganttText = data.gantt || "";
        if (!ganttText.trim()) {
            const note = "(No se proporcionó diagrama de Gantt. Puedes pegar un resumen o tabla aquí.)";
            const lines = pdf.splitTextToSize(note, pdf.internal.pageSize.width - margin * 2);
            ensurePageFor(lines.length, 14 * lineSpacing);
            lines.forEach(line => {
                pdf.text(line, margin, y, { align: "justify" });
                y += 14 * lineSpacing;
            });
        } else {
            // Si incluye líneas tipo tabla, respetar saltos de línea
            const items = ganttText.split(/\r?\n/).filter(s => s.trim() !== "");
            const lh = 14 * lineSpacing;
            items.forEach(item => {
                const lines = pdf.splitTextToSize(item, pdf.internal.pageSize.width - margin * 2);
                ensurePageFor(lines.length, lh);
                lines.forEach(line => {
                    pdf.text(line, margin, y, { align: "left" });
                    y += lh;
                });
                y += 6;
            });
        }

        pdf.save("formulario_1_5_plan_trabajo.pdf");
    };

})();
