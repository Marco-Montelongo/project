/* ============================================================
   formEngine.js
   Motor universal para crear formularios dinámicos.
   Simplifica estructuras repetidas y estandariza PDF/almacenamiento.
   ============================================================ */

(function () {

    // ============================================================
    // CREAR CAMPO
    // ============================================================
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
        textarea.rows = field.rows || 5;
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

    // ============================================================
    // CAMPO ESPECIAL: LISTA DE INTEGRANTES
    // ============================================================
    function createIntegrantesList(listConfig, formId) {
        const wrapper = document.createElement("div");
        wrapper.className = "integrantes-wrapper";

        const title = document.createElement("label");
        title.className = "field-label";
        title.textContent = listConfig.label;
        wrapper.appendChild(title);

        const addBox = document.createElement("div");
        addBox.className = "integrantes-add-box";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Nombre del integrante";
        input.className = "integrantes-input";
        addBox.appendChild(input);

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.textContent = "Agregar";
        addBtn.className = "btn-add";
        addBox.appendChild(addBtn);

        wrapper.appendChild(addBox);

        const listEl = document.createElement("ul");
        listEl.className = "integrantes-list";
        wrapper.appendChild(listEl);

        let integrantes = [];

        if (!window.PROYECTO) window.PROYECTO = {};
        if (!window.PROYECTO.integrantes) window.PROYECTO.integrantes = {};
        if (window.PROYECTO.integrantes[formId])
            integrantes = [...window.PROYECTO.integrantes[formId]];

        function renderList() {
            listEl.innerHTML = "";
            integrantes.forEach((name, index) => {
                const li = document.createElement("li");
                li.textContent = name;

                const del = document.createElement("button");
                del.textContent = "✕";
                del.className = "btn-del";
                del.onclick = () => {
                    integrantes.splice(index, 1);
                    save();
                    renderList();
                };

                li.appendChild(del);
                listEl.appendChild(li);
            });
        }

        function save() {
            window.PROYECTO.integrantes[formId] = [...integrantes];
        }

        addBtn.onclick = () => {
            const name = input.value.trim();
            if (!name) return;
            if (integrantes.length >= listConfig.maxItems) return alert("Límite alcanzado.");
            integrantes.push(name);
            input.value = "";
            save();
            renderList();
        };

        renderList();
        return wrapper;
    }


    // ============================================================
    // *** NUEVO *** CREAR CAMPO DE INTEGRANTES (GENÉRICO)
    // ============================================================
    function createIntegrantesField_Generic(config) {

        const maxIntegrantes = config.max || 7;
        const id = config.id;  // ej: "equipo"

        const wrapper = document.createElement("div");
        wrapper.className = "form-field";

        const label = document.createElement("label");
        label.className = "field-label";
        label.textContent = config.label || "Integrantes (máx. " + maxIntegrantes + ")";
        wrapper.appendChild(label);

        const list = document.createElement("div");
        list.id = `integrantes_list_${id}`;
        list.className = "integrantes-list";
        wrapper.appendChild(list);

        const inputRow = document.createElement("div");
        inputRow.className = "integrante-input-row";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Escribe un nombre y presiona Agregar";
        input.className = "integrante-input";

        const btnAdd = document.createElement("button");
        btnAdd.type = "button";
        btnAdd.textContent = "Agregar";
        btnAdd.className = "btn-save";

        inputRow.appendChild(input);
        inputRow.appendChild(btnAdd);
        wrapper.appendChild(inputRow);

        // ------ Lógica ------
        function render(items) {
            list.innerHTML = "";
            items.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

            items.forEach(n => {
                const div = document.createElement("div");
                div.className = "integrante-item";
                div.dataset.name = n;

                const sp = document.createElement("span");
                sp.className = "integrante-name";
                sp.textContent = n;

                const rm = document.createElement("button");
                rm.type = "button";
                rm.className = "remove-member";
                rm.textContent = "✕";

                rm.onclick = () => {
                    const arr = items.filter(i => i !== n);
                    save(arr);
                    render(arr);
                };

                div.appendChild(sp);
                div.appendChild(rm);
                list.appendChild(div);
            });
        }

        function save(array) {
            if (!window.PROYECTO) window.PROYECTO = {};
            if (!window.PROYECTO.formularios) window.PROYECTO.formularios = {};
            if (!window.PROYECTO.formularios[id]) window.PROYECTO.formularios[id] = {};

            window.PROYECTO.formularios[id].integrantes = array;
        }

        btnAdd.onclick = () => {
            const name = input.value.trim();
            if (!name) return;

            const items = Array.from(list.querySelectorAll(".integrante-item"))
                .map(d => d.dataset.name);

            if (items.length >= maxIntegrantes) {
                alert(`Máximo ${maxIntegrantes} integrantes.`);
                return;
            }

            items.push(name);
            save(items);
            render(items);
            input.value = "";
            input.focus();
        };

        // --- cargar si existen ---
        if (window.PROYECTO?.formularios?.[id]?.integrantes) {
            render([...window.PROYECTO.formularios[id].integrantes]);
        }

        return wrapper;
    }

    // ============================================================
    // GUARDAR FORMULARIO
    // ============================================================
    function saveForm(id, fields) {
        const data = {};

        fields.forEach(f => {
            const ta = document.getElementById(`ta_${f.key}`);
            data[f.key] = ta?.value.trim() || "";
        });

        if (!window.PROYECTO) window.PROYECTO = {};
        if (!window.PROYECTO.formularios) window.PROYECTO.formularios = {};

        // si ya existían integrantes, preservarlos
        if (window.PROYECTO.formularios[id]?.integrantes) {
            data.integrantes = [...window.PROYECTO.formularios[id].integrantes];
        }

        window.PROYECTO.formularios[id] = data;
        return data;
    }

    // ============================================================
    // CARGAR FORMULARIO
    // ============================================================
    function loadIfExists(id, fields) {
        if (!window.PROYECTO || !window.PROYECTO.formularios) return;

        const data = window.PROYECTO.formularios[id];
        if (!data) return;

        fields.forEach(f => {
            const ta = document.getElementById(`ta_${f.key}`);
            if (!ta) return;

            ta.value = data[f.key] || "";

            const counter = ta.parentElement.querySelector(".char-counter");
            if (counter) counter.textContent = `${ta.value.length} / ${f.max}`;
        });
    }

    // ============================================================
    // MENSAJE GUARDADO
    // ============================================================
    function showSaved(container, formClass) {
        let note = container.querySelector(".saved-note");
        if (!note) {
            note = document.createElement("div");
            note.className = "saved-note";
            note.textContent = "Datos guardados.";
            container.insertBefore(note, container.querySelector(`.${formClass}`));
        }

        note.style.opacity = "1";
        setTimeout(() => {
            note.style.opacity = "0";
            setTimeout(() => note.remove(), 400);
        }, 1600);
    }

    // ============================================================
    // GENERAR PDF GENÉRICO
    // ============================================================
    function generatePDF(pdfName, fields, data) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ unit: "pt", format: "letter" });

        const margin = 72;
        let y = margin;

        pdf.setFont("Times");

        function writeParagraph(title, text) {
            pdf.setFont("Times", "bold");
            pdf.setFontSize(14);
            pdf.text(title, margin, y);
            y += 22;

            pdf.setFont("Times", "normal");
            pdf.setFontSize(12);

            const lines = pdf.splitTextToSize(text, pdf.internal.pageSize.width - margin * 2);

            lines.forEach(line => {
                if (y > pdf.internal.pageSize.height - margin) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(line, margin, y, { align: "justify" });
                y += 16;
            });

            y += 12;
        }

        fields.forEach(f => writeParagraph(f.label, data[f.key] || ""));

        // si hay integrantes, también exportarlos:
        if (data.integrantes) {
            writeParagraph("Integrantes", data.integrantes.join("\n"));
        }

        pdf.save(pdfName);
    }

    // ============================================================
    // RENDERIZADOR GENERAL
    // ============================================================
    window.renderForm = function (config) {

        const { id, containerId, title, intro, fields, pdfName, integrantes } = config;

        const container = document.getElementById(containerId);
        if (!container) return console.error("Contenedor no encontrado:", containerId);

        container.innerHTML = "";

        const h2 = document.createElement("h2");
        h2.textContent = title;
        container.appendChild(h2);

        if (intro) {
            const p = document.createElement("p");
            p.className = "form-intro";
            p.textContent = intro;
            container.appendChild(p);
        }

        const formClass = `form-${id.replace(".", "-")}`;

        const form = document.createElement("form");
        form.className = formClass;

        form.addEventListener("submit", e => {
            e.preventDefault();
            saveForm(id, fields);
            showSaved(container, formClass);
        });

        // --- Campos normales ---
        fields.forEach(f => form.appendChild(createField(f)));

        // Si existen listas, renderizarlas
        if (config.lists) {
            config.lists.forEach(listConf => {
                form.appendChild(createIntegrantesList(listConf, id));
            });
        }



        // --- Integrantes (si aplica) ---
        if (integrantes === true) {
            form.appendChild(createIntegrantesField_Generic({ id, max: 7 }));
        }

        // --- Acciones ---
        const actions = document.createElement("div");
        actions.className = "form-actions";

        const saveBtn = document.createElement("button");
        saveBtn.type = "submit";
        saveBtn.className = "btn-save";
        saveBtn.textContent = "Guardar";
        actions.appendChild(saveBtn);

        const pdfBtn = document.createElement("button");
        pdfBtn.type = "button";
        pdfBtn.className = "btn-pdf";
        pdfBtn.textContent = "Generar PDF";
        pdfBtn.onclick = () => {
            const data = saveForm(id, fields);
            if (config.pdfCustom) {
                config.pdfCustom(data);  // ← Ejecuta tu PDF especial
            } else {
                generatePDF(pdfName, fields, data); // ← Genérico
            }


        };
        actions.appendChild(pdfBtn);

        form.appendChild(actions);
        container.appendChild(form);

        loadIfExists(id, fields);

        const first = container.querySelector(".field-textarea");
        if (first) first.focus();
    };


})();
