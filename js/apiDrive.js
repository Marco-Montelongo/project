// js/apiDrive.js
(function (global) {
  // REEMPLAZA con la URL que obtuviste al desplegar el WebApp
  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxr7_-nCJIAAY3wmSLTXEdddH1wH8zVA7sXFDrsxT3TuK2t2_EfvUvWfzC6BWrcFUyp/exec"; 

  async function getFromDrive(pin, grupo, equipo) {
    const url = `${WEBAPP_URL}?action=get&grupo=${encodeURIComponent(grupo)}&equipo=${encodeURIComponent(equipo)}&pin=${encodeURIComponent(pin)}`;
    const resp = await fetch(url, { method: "GET", mode: "cors" });
    return resp.json();
  }

  async function saveToDrive(pin, grupo, equipo, data) {
    const payload = { action: "save", pin, grupo: String(grupo), equipo: String(equipo), data };
    const resp = await fetch(WEBAPP_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return resp.json();
  }

  global.ApiDrive = { getFromDrive, saveToDrive, WEBAPP_URL };
})(window);


async function driveGuardarJSON(nombreArchivo, datos) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: nombreArchivo,
        content: datos
      })
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Error guardando:", err);
    return { ok: false, error: err };
  }
}
