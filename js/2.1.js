/* form_2_1.js
   Módulo que renderiza el formulario 2.1 dentro de un contenedor (por id).
   Expone window.renderForm2_1(containerId).
*/

(function () {

    // ---------------------------------------
    // DEFINICIÓN DE CAMPOS
    // ---------------------------------------
    const fields = [
        {
            key: "funcion",
            label: "Función principal del sistema",
            max: 1200,
            help: "Identifica y describe la función principal que cumple el objeto o sistema técnico (1 párrafo)."
        },
        {
            key: "entradas",
            label: "Entradas al sistema",
            max: 1500,
            help: "Enumera los elementos o recursos que ingresan al sistema (energía, materia, información). Es una lista."
        },
        {
            key: "procesos",
            label: "Procesos o transformaciones",
            max: 1200,
            help: "Explica las transformaciones que ocurren dentro del sistema (1 párrafo)."
        },
        {
            key: "salidas",
            label: "Salidas o productos",
            max: 1200,
            help: "Describe los resultados o productos que genera el sistema (1 párrafo)."
        },
        {
            key: "limites",
            label: "Límites del sistema",
            max: 1200,
            help: "Delimita los límites físicos o funcionales del sistema (1 párrafo)."
        },
        {
            key: "interacciones",
            label: "Interacciones con el entorno",
            max: 1200,
            help: "Analiza las interacciones entre el sistema y su contexto (1 párrafo)."
        },
        {
            key: "explicacion",
            label: "Explicación del diagrama",
            max: 1500,
            help: "Escribe un texto breve que explique cómo el sistema responde a la necesidad identificada."
        }
    ];

    // ---------------------------------------
    // CREAR CAMPO TEXTO
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
    // CAMPO PARA EL DIAGRAMA (imagen)
    // ---------------------------------------
    function createImageField() {
        const wrapper = document.createElement("div");
        wrapper.className = "form-field";

        const label = document.createElement("label");
        label.className = "field-label";
        label.textContent = "Diagrama de caja negra (imagen)";
        wrapper.appendChild(label);

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.id = "diagram_2_1";
        input.className = "file-input";
        wrapper.appendChild(input);

        const preview = document.createElement("img");
        preview.id = "diagramPreview2_1";
        preview.className = "img-preview";
        preview.style.display = "none";
        wrapper.appendChild(preview);

        input.addEventListener("change", () => {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = e => {
                preview.src = e.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        });

        return wrapper;
    }

    // ---------------------------------------
    // ARMAR FORMULARIO
    // ---------------------------------------
    function buildForm(container) {
        container.innerHTML = "";

        const title = document.createElement("h2");
        title.textContent = "2.1 Diagrama de caja negra";
        container.appendChild(title);

        const intro = document.createElement("p");
        intro.className = "form-intro";
        intro.textContent =
            "Completa cada apartado según las instrucciones. Incluye también el diagrama como imagen.";
        container.appendChild(intro);

        const form = document.createElement("form");
        form.className = "form-2-1";

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            guardarDatos();
            showSaved(container);
        });

        fields.forEach(f => form.appendChild(createField(f)));

        form.appendChild(createImageField());

        const actions = document.createElement("div");
        actions.className = "form-actions";

        const saveBtn = document.createElement("button");
        saveBtn.type = "submit";
        saveBtn.className = "btn-save";
        saveBtn.textContent = "Guardar";
        actions.appendChild(saveBtn);

        const pdfBtn = document.createElement("button");
        pdfBtn.type = "button";
        pdfBtn.className = "btn-save";
        pdfBtn.style.background = "#444";
        pdfBtn.textContent = "Generar PDF";
        pdfBtn.onclick = generarPDF_DesdeFormulario_2_1;
        actions.appendChild(pdfBtn);

        form.appendChild(actions);
        container.appendChild(form);
    }

    // ---------------------------------------
    // GUARDAR DATOS
    // ---------------------------------------
    function guardarDatos() {
        const data = {};
        fields.forEach(f => {
            const ta = document.getElementById(`ta_${f.key}`);
            data[f.key] = ta?.value.trim() || "";
        });

        const img = document.getElementById("diagramPreview2_1");
        data.diagrama = img?.src || "";

        if (!window.PROYECTO) window.PROYECTO = {};
        if (!window.PROYECTO.formularios) window.PROYECTO.formularios = {};

        window.PROYECTO.formularios["2.1"] = data;
        return data;
    }

    // ---------------------------------------
    // CARGAR DATOS
    // ---------------------------------------
    function cargarDatosSiExisten() {
        if (!window.PROYECTO?.formularios?.["2.1"]) return;

        const data = window.PROYECTO.formularios["2.1"];

        fields.forEach(f => {
            const ta = document.getElementById(`ta_${f.key}`);
            if (ta) {
                ta.value = data[f.key] || "";
                const counter = ta.parentElement.querySelector(".char-counter");
                if (counter) counter.textContent = `${ta.value.length} / ${f.max}`;
            }
        });

        if (data.diagrama) {
            const preview = document.getElementById("diagramPreview2_1");
            preview.src = data.diagrama;
            preview.style.display = "block";
        }
    }

    // ---------------------------------------
    // NOTA DE “DATOS GUARDADOS”
    // ---------------------------------------
    function showSaved(container) {
        let note = container.querySelector(".saved-note");
        if (!note) {
            note = document.createElement("div");
            note.className = "saved-note";
            note.textContent = "Datos guardados.";
            container.insertBefore(note, container.querySelector(".form-2-1"));
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
    window.renderForm2_1 = function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) return console.error("Contenedor no encontrado:", containerId);

        buildForm(container);
        cargarDatosSiExisten();

        const firstText = container.querySelector(".field-textarea");
        if (firstText) firstText.focus();
    };

    // ---------------------------------------
    // PDF DESDE FORMULARIO
    // ---------------------------------------
    window.generarPDF_DesdeFormulario_2_1 = function () {
        const data = guardarDatos();

        const wrapped = {};
        Object.keys(data).forEach(k => wrapped[k] = { text: data[k] });

        generarPDF_Form2_1(wrapped);
    };

    // ---------------------------------------
    // GENERAR PDF
    // ---------------------------------------
    window.generarPDF_Form2_1 = function (data) {
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            unit: "pt",
            format: "letter"
        });

        const margin = 72;
        let y = margin;

        const titleStyle = { fontSize: 14 };
        const paragraphStyle = { fontSize: 12 };

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
                y += 18;
            });

            y += 10;
        }

        writeParagraph("Función principal del sistema", data.funcion?.text || "");
        writeParagraph("Entradas al sistema", data.entradas?.text || "");
        writeParagraph("Procesos o transformaciones", data.procesos?.text || "");
        writeParagraph("Salidas o productos", data.salidas?.text || "");
        writeParagraph("Límites del sistema", data.limites?.text || "");
        writeParagraph("Interacciones con el entorno", data.interacciones?.text || "");
        writeParagraph("Explicación del diagrama", data.explicacion?.text || "");

        // -------- Imagen del diagrama --------
        if (data.diagrama?.text) {
            try {
                pdf.addPage();
                pdf.setFont("Times", "bold");
                pdf.setFontSize(14);
                pdf.text("Diagrama de caja negra", margin, margin);

                pdf.addImage(data.diagrama.text, "PNG", margin, margin + 20, 400, 300);
            } catch (e) {
                console.error("Error al insertar imagen:", e);
            }
        }

        pdf.save("formulario_2_1.pdf");
    };

})();
