/* form_1_3.js
   Renderiza formulario 1.3 y genera PDF.
*/

(function () {

    // -------- CAMPOS DEL FORMULARIO -----------------
    const fields = [
        {
            key: "productos",
            label: "Productos o sistemas similares",
            max: 1200,
            help: "Describe productos o sistemas similares existentes, explicando cómo funcionan y qué propósito cumplen (1 párrafo)."
        },
        {
            key: "tecnologias",
            label: "Materiales, mecanismos o tecnologías",
            max: 1200,
            help: "Explica los materiales, mecanismos o tecnologías empleados en soluciones equivalentes (1 párrafo)."
        },
        {
            key: "normas",
            label: "Normas y especificaciones",
            max: 1200,
            help: "Identifica normas, reglamentos o especificaciones técnicas aplicables (1 párrafo)."
        },
        {
            key: "usuarios",
            label: "Usuarios finales",
            max: 1200,
            help: "Describe a los usuarios finales, sus necesidades, preferencias y condiciones de uso (1 párrafo)."
        },
        {
            key: "condiciones",
            label: "Condiciones de uso",
            max: 1200,
            help: "Analiza condiciones de uso (espacio, ambiente, energía, seguridad, etc.) que influyen en el diseño (1 párrafo)."
        },
        {
            key: "comparativa",
            label: "Comparación de soluciones existentes",
            max: 1200,
            help: "Compara ventajas y desventajas de las soluciones actuales frente a la necesidad identificada (1 párrafo)."
        },
        {
            key: "sintesis",
            label: "Síntesis de fuentes (3 patentes, 3 artículos, 3 libros)",
            max: 5000,
            help: "Sintetiza información de al menos 3 patentes, 3 artículos y 3 libros (3 cuartillas o tabla resumen)."
        }
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
        textarea.rows = 5;
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
        title.textContent = "1.3 Búsqueda de información";
        container.appendChild(title);

        const intro = document.createElement("p");
        intro.className = "form-intro";
        intro.textContent =
            "Completa cada apartado de acuerdo con la guía, proporcionando información clara, fundamentada y verificada.";
        container.appendChild(intro);

        const form = document.createElement("form");
        form.className = "form-1-3";

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
            data[f.key] = document.getElementById(`ta_${f.key}`).value.trim();
        });

        if (!window.PROYECTO) window.PROYECTO = {};
        if (!window.PROYECTO.formularios) window.PROYECTO.formularios = {};

        window.PROYECTO.formularios["1.3"] = data;

        showSaved(container);
    }


    // ------- NOTA DE GUARDADO ---------
    function showSaved(container) {
        let note = container.querySelector(".saved-note");
        if (!note) {
            note = document.createElement("div");
            note.className = "saved-note";
            note.textContent = "Datos guardados.";
            container.insertBefore(note, container.querySelector(".form-1-3"));
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
            data[f.key] = document.getElementById(`ta_${f.key}`).value.trim();
        });

        generarPDF_Form1_3(data);
    }


    // -------- EXPONER FUNCIÓN DE RENDER ----------------
    window.renderForm1_3 = function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error("renderForm1_3: contenedor no encontrado:", containerId);
            return;
        }
        buildForm(container);

        const firstText = container.querySelector(".field-textarea");
        if (firstText) firstText.focus();
    };


    // ----------- GENERAR PDF FINAL -----------------------
    window.generarPDF_Form1_3 = function (data) {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert("Error: jsPDF no está cargado.");
            return;
        }

        const pdf = new jsPDF({ unit: "pt", format: "letter" });

        const margin = 72;
        const lineSpacing = 1.5;
        let y = margin;

        function writeParagraph(title, text) {
            pdf.setFont("Times", "bold");
            pdf.setFontSize(14);
            pdf.text(title, margin, y);
            y += 20;

            pdf.setFont("Times", "normal");
            pdf.setFontSize(12);

            const lines = pdf.splitTextToSize(text, pdf.internal.pageSize.width - margin * 2);

            lines.forEach(line => {
                if (y > pdf.internal.pageSize.height - margin) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(line, margin, y, { align: "justify" });
                y += 14 * lineSpacing;
            });

            y += 10;
        }

        writeParagraph("1. Productos o sistemas similares", data.productos || "");
        writeParagraph("2. Materiales, mecanismos o tecnologías", data.tecnologias || "");
        writeParagraph("3. Normas y especificaciones técnicas", data.normas || "");
        writeParagraph("4. Usuarios finales", data.usuarios || "");
        writeParagraph("5. Condiciones de uso", data.condiciones || "");
        writeParagraph("6. Comparación entre soluciones existentes", data.comparativa || "");
        writeParagraph("7. Síntesis de información documental", data.sintesis || "");

        pdf.save("formulario_1_3.pdf");
    };

})();
