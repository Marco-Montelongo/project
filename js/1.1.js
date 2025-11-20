/* form_1_1.js
   Módulo que renderiza el formulario 1.1 dentro de un contenedor (por id).
   Expone window.renderForm1_1(containerId).
*/

(function () {

    // ---------------------------------------
    // DEFINICIÓN DE CAMPOS
    // ---------------------------------------
    const fields = [
        { key: "situacion", label: "Identifica la situación", max: 1200, help: "Identifica la situación que genera malestar, dificultad o insatisfacción (1 párrafo)." },
        { key: "contexto", label: "Contexto", max: 1200, help: "Reconoce y describe el contexto en el que ocurre la necesidad (1 párrafo)." },
        { key: "afectados", label: "Personas/grupos afectados", max: 1200, help: "Identifica a las personas, grupos o sectores afectados (1 párrafo)." },
        { key: "consecuencias", label: "Consecuencias", max: 1200, help: "Consecuencias o efectos de no resolver la necesidad (1 párrafo)." },
        { key: "intentos", label: "Intentos/soluciones previas", max: 2000, help: "Lista intentos o soluciones previas y explica por qué no satisfacen." },
        { key: "recursos", label: "Recursos/limitaciones", max: 1200, help: "Recursos o limitaciones que influyen en la situación." },
        { key: "resumen", label: "Resumen de la necesidad", max: 1200, help: "Párrafo que sintetice la necesidad." }
    ];

    // ---------------------------------------
    // CREAR CAMPO
    // ---------------------------------------
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

    // ---------------------------------------
    // ARMAR FORMULARIO
    // ---------------------------------------
    function buildForm(container) {
        container.innerHTML = "";

        const title = document.createElement("h2");
        title.textContent = "1.1 Identificación de la necesidad";
        container.appendChild(title);

        const intro = document.createElement("p");
        intro.className = "form-intro";
        intro.textContent =
            "Para cada apartado escribe una explicación breve según la guía. El contador indica el máximo de caracteres permitidos.";
        container.appendChild(intro);

        const form = document.createElement("form");
        form.className = "form-1-1";

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            guardarDatos();
            showSaved(container);
        });

        fields.forEach(f => form.appendChild(createField(f)));

        const actions = document.createElement("div");
        actions.className = "form-actions";

        const saveBtn = document.createElement("button");
        saveBtn.type = "submit";
        saveBtn.className = "btn-save";
        saveBtn.textContent = "Guardar";
        actions.appendChild(saveBtn);

        // -------------------------------
        // BOTÓN PARA GENERAR PDF
        // -------------------------------
        const pdfBtn = document.createElement("button");
        pdfBtn.type = "button";
        pdfBtn.className = "btn-save";
        pdfBtn.style.background = "#444"; // otro color opcional
        pdfBtn.textContent = "Generar PDF";
        pdfBtn.onclick = generarPDF_DesdeFormulario;
        actions.appendChild(pdfBtn);

        form.appendChild(actions);
        container.appendChild(form);
    }

    // ---------------------------------------
    // GUARDAR DATOS EN window.PROYECTO
    // ---------------------------------------
    function guardarDatos() {
        const data = {};
        fields.forEach(f => {
            const ta = document.getElementById(`ta_${f.key}`);
            data[f.key] = ta?.value.trim() || "";
        });

        if (!window.PROYECTO) window.PROYECTO = {};
        if (!window.PROYECTO.formularios) window.PROYECTO.formularios = {};

        window.PROYECTO.formularios["1.1"] = data;
        return data;
    }

    // ---------------------------------------
    // LÓGICA DE "DATOS GUARDADOS"
    // ---------------------------------------
    function showSaved(container) {
        let note = container.querySelector(".saved-note");
        if (!note) {
            note = document.createElement("div");
            note.className = "saved-note";
            note.textContent = "Datos guardados.";
            container.insertBefore(note, container.querySelector(".form-1-1"));
        }
        note.style.opacity = "1";
        setTimeout(() => {
            note.style.opacity = "0";
            setTimeout(() => note.remove(), 400);
        }, 1600);
    }

    // ---------------------------------------
    // RENDERIZADOR PÚBLICO
    // ---------------------------------------
    window.renderForm1_1 = function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) return console.error("Contenedor no encontrado:", containerId);
        buildForm(container);
        const firstText = container.querySelector(".field-textarea");
        if (firstText) firstText.focus();
    };

    // ---------------------------------------
    // GENERAR PDF DESDE EL FORMULARIO
    // ---------------------------------------
    window.generarPDF_DesdeFormulario = function () {
        const data = guardarDatos();
        const wrapped = {};

        Object.keys(data).forEach(k => {
            wrapped[k] = { text: data[k] };
        });

        generarPDF_Form1_1(wrapped);
    };

    // ---------------------------------------
    // FUNCIÓN GENERAR PDF
    // ---------------------------------------
    window.generarPDF_Form1_1 = function (data) {
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            unit: "pt",
            format: "letter"
        });

        const margin = 72;
        const lineSpacing = 1.5;

        const titleStyle = { fontSize: 14 };
        const paragraphStyle = { fontSize: 12 };

        let y = margin;

        function writeParagraph(title, text) {
            pdf.setFont("Times", "bold");
            pdf.setFontSize(titleStyle.fontSize);
            pdf.text(title, margin, y);
            y += 20;

            pdf.setFont("Times", "normal");
            pdf.setFontSize(paragraphStyle.fontSize);

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

        writeParagraph("1. Identificación de la situación", data.situacion?.text || "");
        writeParagraph("2. Contexto", data.contexto?.text || "");
        writeParagraph("3. Personas o grupos afectados", data.afectados?.text || "");
        writeParagraph("4. Consecuencias de no resolver la necesidad", data.consecuencias?.text || "");
        writeParagraph("5. Intentos o soluciones previas", data.intentos?.text || "");
        writeParagraph("6. Recursos o limitaciones", data.recursos?.text || "");
        writeParagraph("7. Resumen de la necesidad", data.resumen?.text || "");

        pdf.save("formulario_1_1.pdf");
    };

})();
