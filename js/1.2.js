/* form_1_2.js
   Renderiza formulario 1.2 y genera PDF.
*/

(function () {

    // -------- CAMPOS DEL FORMULARIO -----------------
    const fields = [
        { key: "problema", label: "Definir el problema", max: 1200, help: "Define con claridad qué aspecto o situación específica se debe resolver dentro del contexto identificado (1 párrafo)." },

        { key: "objetivo", label: "Objetivo de la solución", max: 1200, help: "Explica qué se busca lograr o alcanzar mediante la solución propuesta (1 párrafo)." },

        { key: "limitaciones", label: "Limitaciones o condiciones", max: 1200, help: "Identifica y describe las limitaciones o condiciones que deben considerarse: espacio, costo, materiales, seguridad, etc. (1 párrafo)." },

        { key: "beneficiarios", label: "Beneficiarios", max: 1200, help: "Reconoce quiénes se beneficiarán directa o indirectamente con la solución (1 párrafo)." },

        { key: "enunciado", label: "Enunciado del problema de diseño", max: 1200, help: "Redacta un enunciado claro y conciso que formule el problema de diseño considerando los puntos anteriores (1 párrafo)." }
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
        title.textContent = "1.2 Definir el problema";
        container.appendChild(title);

        const intro = document.createElement("p");
        intro.className = "form-intro";
        intro.textContent =
            "Completa cada apartado con un párrafo claro y fundamentado. El contador indica el máximo permitido.";
        container.appendChild(intro);

        const form = document.createElement("form");
        form.className = "form-1-2";

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

        window.PROYECTO.formularios["1.2"] = data;

        showSaved(container);
    }


    // ------- NOTA DE GUARDADO ---------
    function showSaved(container) {
        let note = container.querySelector(".saved-note");
        if (!note) {
            note = document.createElement("div");
            note.className = "saved-note";
            note.textContent = "Datos guardados.";
            container.insertBefore(note, container.querySelector(".form-1-2"));
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

        generarPDF_Form1_2(data);
    }


    // -------- EXPONER FUNCIÓN DE RENDER ----------------
    window.renderForm1_2 = function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error("renderForm1_2: contenedor no encontrado:", containerId);
            return;
        }
        buildForm(container);
        const firstText = container.querySelector(".field-textarea");
        if (firstText) firstText.focus();
    };


    // ----------- GENERAR PDF FINAL -----------------------
    window.generarPDF_Form1_2 = function (data) {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert("Error: jsPDF no está cargado.");
            return;
        }

        const pdf = new jsPDF({ unit: "pt", format: "letter" });

        const margin = 72; // 1 pulgada
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

        writeParagraph("1. Problema a resolver", data.problema || "");
        writeParagraph("2. Objetivo de la solución", data.objetivo || "");
        writeParagraph("3. Limitaciones o condiciones", data.limitaciones || "");
        writeParagraph("4. Beneficiarios", data.beneficiarios || "");
        writeParagraph("5. Enunciado del problema de diseño", data.enunciado || "");

        pdf.save("formulario_1_2.pdf");
    };

})();
