// js/forms.js
(function (global) {
  const Storage = global.Storage;
  const ApiDrive = global.ApiDrive;

  // cargar en memoria
  let dataGeneral = Storage.loadLocal();

  function persistLocal() { Storage.saveLocal(dataGeneral); }

  async function guardarEquipo({ grupo, equipo, semestre, integrantes }) {
    const key = Storage.keyEquipo(grupo, equipo);
    dataGeneral.equipos[key] = dataGeneral.equipos[key] || {};
    dataGeneral.equipos[key].meta = { grupo, equipo, semestre };
    dataGeneral.equipos[key].registroEquipos = { integrantes };
    persistLocal();

    const pin = Storage.getPin() || Storage.pedirPinSiNoHay();
    if (!pin) return { ok: true, local: true };

    try {
      const r = await ApiDrive.saveToDrive(pin, grupo, equipo, dataGeneral.equipos[key]);
      return r;
    } catch (err) {
      console.warn("Drive save error:", err);
      return { ok: false, error: String(err) };
    }
  }

  async function guardarNecesidad({ grupo, equipo, payload }) {
    const key = Storage.keyEquipo(grupo, equipo);
    dataGeneral.equipos[key] = dataGeneral.equipos[key] || {};
    dataGeneral.equipos[key].identificarNecesidad = payload;
    persistLocal();

    const pin = Storage.getPin() || Storage.pedirPinSiNoHay();
    if (!pin) return { ok: true, local: true };

    try {
      const r = await ApiDrive.saveToDrive(pin, grupo, equipo, dataGeneral.equipos[key]);
      return r;
    } catch (err) {
      console.warn("Drive save error:", err);
      return { ok: false, error: String(err) };
    }
  }

  async function cargarDesdeDriveYFusionar(grupo, equipo) {
    const pin = Storage.getPin() || Storage.pedirPinSiNoHay();
    if (!pin) return { ok: false, msg: "No PIN" };
    try {
      const resp = await ApiDrive.getFromDrive(pin, grupo, equipo);
      if (resp.error) return { ok: false, error: resp.error };
      if (!resp.ok && resp.message === "No existe registro previo") return { ok: true, merged: null };

      const remote = resp.data || {};
      const key = Storage.keyEquipo(grupo, equipo);
      const local = dataGeneral.equipos[key] || {};
      const merged = Object.assign({}, local, remote);
      dataGeneral.equipos[key] = merged;
      persistLocal();
      return { ok: true, merged };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  }

  // Exponer
  global.Forms = { dataGeneral, guardarEquipo, guardarNecesidad, cargarDesdeDriveYFusionar };
})(window);
