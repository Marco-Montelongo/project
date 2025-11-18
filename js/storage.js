// js/storage.js
(function (global) {
  const LOCAL_KEY = "dataGeneral_v1";

  function defaultData() { return { equipos: {} }; }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : defaultData();
    } catch (e) {
      console.error("Error parseando localStorage:", e);
      return defaultData();
    }
  }

  function saveLocal(data) { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); }

  function setPin(pin) { sessionStorage.setItem("teacherPin", pin); }
  function getPin() { return sessionStorage.getItem("teacherPin") || null; }
  function pedirPinSiNoHay() {
    let pin = getPin();
    if (!pin) {
      pin = prompt("Introduce el PIN del profesor:");
      if (pin) setPin(pin);
    }
    return getPin();
  }

  function keyEquipo(grupo, equipo) { return `G${grupo}_E${equipo}`; }

  global.Storage = { loadLocal, saveLocal, setPin, getPin, pedirPinSiNoHay, keyEquipo };
})(window);
