// js/ui.js
(function (global) {
  const Forms = global.Forms;
  const Storage = global.Storage;

  function mostrarRegistroEquipos() {
    const html = `
      <h2>Registro de Equipos</h2>
      <form id="formEquipos" class="form-section">
        <label>Número de grupo</label>
        <input type="number" id="numGrupo" min="1" required>

        <label>Número de equipo</label>
        <input type="number" id="numEquipo" min="1" required>

        <label>Semestre</label>
        <select id="semestre" required>
          <option value="">Seleccione...</option>
          <option>2026-1</option>
          <option>2026-2</option>
        </select>

        <label>Integrantes (uno por línea) (máx. 7)</label>
        <textarea id="integrantesText" rows="6" placeholder="Nombre integrante 1&#10;Nombre integrante 2"></textarea>

        <div style="display:flex;gap:8px;margin-top:12px">
          <button type="submit">Guardar</button>
          <button type="button" id="btnCargarDesdeDrive">Cargar desde Drive</button>
        </div>
      </form>
    `;
    document.getElementById("content-area").innerHTML = html;

    const form = document.getElementById("formEquipos");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const grupo = document.getElementById("numGrupo").value.trim();
      const equipo = document.getElementById("numEquipo").value.trim();
      const semestre = document.getElementById("semestre").value;
      const integrantes = document.getElementById("integrantesText").value.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 7);

      if (!grupo || !equipo) return alert("Grupo y equipo son obligatorios.");
      if (integrantes.length === 0) return alert("Agrega al menos 1 integrante.");

      const r = await Forms.guardarEquipo({ grupo, equipo, semestre, integrantes });
      if (r && r.ok) alert("Guardado correctamente en Drive.");
      else if (r && r.local) alert("Guardado local (Drive no accesible).");
      else alert("Error guardando: " + (r.error || JSON.stringify(r)));
    });

    document.getElementById("btnCargarDesdeDrive").addEventListener("click", async () => {
      const grupo = document.getElementById("numGrupo").value.trim();
      const equipo = document.getElementById("numEquipo").value.trim();
      if (!grupo || !equipo) return alert("Ingresa grupo y equipo antes de cargar.");
      const r = await Forms.cargarDesdeDriveYFusionar(grupo, equipo);
      if (!r.ok) return alert("No fue posible cargar desde Drive: " + (r.error || r.msg));
      const key = Storage.keyEquipo(grupo, equipo);
      const obj = Forms.dataGeneral.equipos[key] || {};
      if (obj.meta) document.getElementById("semestre").value = obj.meta.semestre || "";
      if (obj.registroEquipos) document.getElementById("integrantesText").value = (obj.registroEquipos.integrantes || []).join("\n");
      alert("Datos cargados (si existían).");
    });

    window.currentSection = "registroEquipos";
  }

  function mostrarIdentificarNecesidad() {
    const html = `
      <h2>Identificación de la Necesidad</h2>
      <form id="formIdentificarNecesidad" class="form-necesidad">
        
        <section class="form-section">
          <h3>Apoyo</h3>

          <label>1. Situación</label>
          <textarea id="sitSituacion" rows="4" placeholder="Identifica la situación que genera malestar, dificultad o insatisfacción en el contexto analizado." required></textarea>

          <label>2. Contexto</label>
          <textarea id="sitContexto" rows="4" placeholder="Reconoce y describe el contexto en el que ocurre la necesidad identificada." required></textarea>

          <label>3. Personas afectadas</label>
          <textarea id="sitAfectados" rows="4" placeholder="Identifica a las personas, grupos o sectores que se ven afectados por esta situación." required></textarea>

          <label>4. Consecuencias</label>
          <textarea id="sitConsecuencias" rows="4" placeholder="Reconoce y describe las consecuencias o efectos que podrían surgir al no resolver esta necesidad." required></textarea>

          <label>5. Intentos o soluciones actuales</label>
          <textarea id="sitIntentos" rows="6" placeholder="Identifica, lista y describe los intentos o soluciones actuales implementados; explica por qué no satisfacen completamente la necesidad." required></textarea>

          <label>6. Recursos o limitaciones</label>
          <textarea id="sitRecursos" rows="4" placeholder="Identifica y explica los recursos, limitaciones o condiciones que influyen en la aparición o mantenimiento de esta situación." required></textarea>
        </section>

        <section class="form-section">
          <h3>Entregable</h3>

          <label>7. Síntesis final</label>
          <textarea id="sitSintesis" rows="5" placeholder="Sintetiza y redacta un párrafo que resuma claramente la necesidad identificada, considerando los puntos anteriores." required></textarea>
        </section>

        <div class="form-actions">
          <button type="submit">Guardar</button>
        </div>
      </form>
    `;

    document.getElementById("content-area").innerHTML = html;

    const form = document.getElementById("formIdentificarNecesidad");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const grupo = prompt("Introduce número de grupo (para asociar esta necesidad):");
      const equipo = prompt("Introduce número de equipo:");
      if (!grupo || !equipo) return alert("Grupo y equipo obligatorios para guardar.");

      const payload = {
        situacion: document.getElementById("sitSituacion").value.trim(),
        contexto: document.getElementById("sitContexto").value.trim(),
        afectados: document.getElementById("sitAfectados").value.trim(),
        consecuencias: document.getElementById("sitConsecuencias").value.trim(),
        intentosFallidos: document.getElementById("sitIntentos").value.trim(),
        recursosLimitantes: document.getElementById("sitRecursos").value.trim(),
        sintesisFinal: document.getElementById("sitSintesis").value.trim(),
        fechaRegistro: new Date().toISOString()
      };

      const r = await Forms.guardarNecesidad({ grupo, equipo, payload });
      if (r && r.ok) alert("Necesidad guardada correctamente.");
      else if (r && r.local) alert("Guardado local (Drive no accesible).");
      else alert("Error guardando: " + (r.error || JSON.stringify(r)));
    });

    window.currentSection = "identificarNecesidad";
  }

  global.UI = { mostrarRegistroEquipos, mostrarIdentificarNecesidad };
})(window);

