/* form_1_4.js
   Renderiza formulario 1.4 y genera PDF.
   Misma lógica y estilo que los demás módulos (1.1 - 1.3)
*/

(function () {

    // -------- CAMPOS DEL FORMULARIO -----------------
    const fields = [
        { key: "funciones", label: "Funciones del diseño", max: 1200, help: "Identifica y describe las funciones que el diseño debe cumplir para resolver el problema planteado (1 párrafo)." },
        { key: "dimensiones", label: "Dimensiones, capacidades o alcances", max: 1200, help: "Determina las dimensiones, capacidades o alcances necesarios para el correcto funcionamiento del producto o sistema (1 párrafo)." },
        { key: "materiales", label: "Materiales y mecanismos", max: 1200, help: "Selecciona y explica los materiales y mecanismos más adecuados según el contexto y las condiciones de uso (1 párrafo)." },
        { key: "seguridad", label: "Seguridad, ergonomía y mantenimiento", max: 1200, help: "Reconoce y especifica las condiciones de seguridad, ergonomía y mantenimiento que deben considerarse en el diseño (1 párrafo)." },
        { key: "estetica", label: "Criterios estéticos e integración", max: 1200, help: "Define los criterios estéticos y de integración con el entorno que orientarán el desarrollo del proyecto (1 párrafo)." },
        { key: "sostenibilidad", label: "Requerimientos ambientales y sostenibilidad", max: 1200, help: "Identifica y detalla los requerimientos ambientales o de sostenibilidad que debe cumplir el diseño (1 párrafo)." },
        { key: "limitaciones", label: "Limitaciones económicas/técnicas", max: 1200, help: "Analiza y describe las limitaciones económicas, técnicas o estructurales que condicionan el desarrollo del proyecto (1 párrafo)." },
        { key: "lista", label: "Lista final de especificaciones y requerimientos", max: 3000, help: "Elabora la lista final de especificaciones y requerimientos del producto, organizándola de forma clara y estructurada (puede usar viñetas o formato de tabla resumida)." }
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
        textarea.rows = field.key === "lista" ? 8 : 5;
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
        title.textContent = "1.4 Especificaciones y requerimientos";
        container.appendChild(title);

        const intro = document.createElement("p");
        intro.className = "form-intro";
        intro.textContent = "Complete cada apartado con la información solicitada. El campo final puede contener el listado o una tabla resumida en texto.";
        container.appendChild(intro);

        const form = document.createElement("form");
        form.className = "form-1-4";
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

        window.PROYECTO.formularios["1.4"] = data;

        showSaved(container);
    }

    // ------- NOTA DE GUARDADO ---------
    function showSaved(container) {
        let note = container.querySelector(".saved-note");
        if (!note) {
            note = document.createElement("div");
            note.className = "saved-note";
            note.textContent = "Datos guardados.";
            container.insertBefore(note, container.querySelector(".form-1-4"));
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
        generarPDF_Form1_4(data);
    }

    // -------- EXPONER FUNCIÓN DE RENDER ----------------
    window.renderForm1_4 = function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error("renderForm1_4: contenedor no encontrado:", containerId);
            return;
        }
        buildForm(container);
        const firstText = container.querySelector(".field-textarea");
        if (firstText) firstText.focus();
    };

    // ----------- GENERAR PDF FINAL -----------------------
    window.generarPDF_Form1_4 = function (data) {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert("Error: jsPDF no está cargado.");
            return;
        }

        const pdf = new jsPDF({ unit: "pt", format: "letter" });
        const margin = 72; // 1 pulgada
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

        // Escribir párrafos
        writeParagraph("1. Funciones del diseño", data.funciones || "");
        writeParagraph("2. Dimensiones, capacidades o alcances", data.dimensiones || "");
        writeParagraph("3. Materiales y mecanismos", data.materiales || "");
        writeParagraph("4. Seguridad, ergonomía y mantenimiento", data.seguridad || "");
        writeParagraph("5. Criterios estéticos e integración", data.estetica || "");
        writeParagraph("6. Requerimientos ambientales y sostenibilidad", data.sostenibilidad || "");
        writeParagraph("7. Limitaciones económicas, técnicas o estructurales", data.limitaciones || "");

        // Para la lista final, escribimos como listado si viene en líneas
        pdf.setFont("Times", "bold");
        pdf.setFontSize(14);
        pdf.text("8. Lista final de especificaciones y requerimientos", margin, y);
        y += 20;

        pdf.setFont("Times", "normal");
        pdf.setFontSize(12);

        const listaText = data.lista || "";
        if (listaText.trim() === "") {
            const emptyNote = "(No se proporcionó lista de especificaciones.)";
            const linesEmpty = pdf.splitTextToSize(emptyNote, pdf.internal.pageSize.width - margin * 2);
            ensurePageFor(linesEmpty.length, 14 * lineSpacing);
            linesEmpty.forEach(line => {
                pdf.text(line, margin, y, { align: "justify" });
                y += 14 * lineSpacing;
            });
        } else {
            // Si el usuario puso viñetas o saltos de línea, respetarlos
            const items = listaText.split(/\r?\n/).filter(s => s.trim() !== "");
            items.forEach(item => {
                const bullet = "• " + item.trim();
                const lines = pdf.splitTextToSize(bullet, pdf.internal.pageSize.width - margin * 2);
                ensurePageFor(lines.length, 14 * lineSpacing);
                lines.forEach(line => {
                    pdf.text(line, margin, y, { align: "left" });
                    y += 14 * lineSpacing;
                });
                y += 6;
            });
        }

        pdf.save("formulario_1_4.pdf");
    };

})();
