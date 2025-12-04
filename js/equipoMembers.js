/* equipoMembers.js
   Módulo plug-in para formEngine.js
   Añade y gestiona el campo especial "integrantes" con máximo 7 registros.
*/

(function () {

    const MAX = 7;

    // --- API pública -----------------------------
    window.equipoMembers = {
        render,
        getData,
        setData
    };

    // ---------------------------------------------
    // render(container)
    // Construye el campo dentro de formEngine
    // ---------------------------------------------
    function render(container) {
        const wrapper = document.createElement("div");
        wrapper.className = "form-field";

        const label = document.createElement("label");
        label.className = "field-label";
        label.textContent = "Integrantes del equipo (máx. 7, se ordenan alfabéticamente)";
        wrapper.appendChild(label);

        const list = document.createElement("div");
        list.className = "integrantes-list";
        list.dataset.type = "integrantes"; // clave para formEngine
        wrapper.appendChild(list);

        const row = document.createElement("div");
        row.className = "integrante-input-row";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Nombre del integrante…";
        input.className = "integrante-input";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-save";
        btn.textContent = "Agregar";

        row.appendChild(input);
        row.appendChild(btn);

        wrapper.appendChild(row);
        container.appendChild(wrapper);

        // agregar
        btn.onclick = () => {
            const name = input.value.trim();
            if (!name) return;

            const items = getCurrent(list);
            if (items.length >= MAX) {
                alert("Máximo 7 integrantes permitidos.");
                return;
            }

            items.push(name);
            renderList(list, items);
            input.value = "";
        };
    }

    // ---------------------------------------------
    // getData(container)
    // Devuelve el arreglo de integrantes
    // ---------------------------------------------
    function getData(container) {
        const list = container.querySelector('[data-type="integrantes"]');
        if (!list) return [];
        return getCurrent(list);
    }

    // ---------------------------------------------
    // setData(container, array)
    // Carga valores desde PROYECTO
    // ---------------------------------------------
    function setData(container, array) {
        const list = container.querySelector('[data-type="integrantes"]');
        if (!list || !Array.isArray(array)) return;
        renderList(list, array);
    }

    // ---------------------------------------------
    // Helpers internos
    // ---------------------------------------------
    function getCurrent(list) {
        return Array.from(list.querySelectorAll(".integrante-item"))
            .map(div => div.dataset.name);
    }

    function renderList(list, array) {
        const sorted = [...array].sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
        );

        list.innerHTML = "";

        sorted.forEach(n => {
            const div = document.createElement("div");
            div.className = "integrante-item";
            div.dataset.name = n;

            const span = document.createElement("span");
            span.className = "integrante-name";
            span.textContent = n;

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "remove-member";
            remove.textContent = "✕";

            remove.onclick = () => {
                const filtered = sorted.filter(x => x !== n);
                renderList(list, filtered);
            };

            div.appendChild(span);
            div.appendChild(remove);
            list.appendChild(div);
        });
    }

})();
