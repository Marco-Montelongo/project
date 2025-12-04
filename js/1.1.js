/* form_1_1.js
   Formulario 1.1 utilizando el motor común formEngine.js
*/

(function () {

    const fields_1_1 = [
        { key: "situacion", label: "Identifica la situación", max: 1200, help: "Identifica la situación que genera malestar, dificultad o insatisfacción." },
        { key: "contexto", label: "Contexto", max: 1200, help: "Contexto en el que ocurre la necesidad." },
        { key: "afectados", label: "Personas/grupos afectados", max: 1200, help: "Personas o grupos afectados." },
        { key: "consecuencias", label: "Consecuencias", max: 1200, help: "Consecuencias de no resolver la necesidad." },
        { key: "intentos", label: "Intentos/soluciones previas", max: 2000, help: "Intentos previos y por qué no funcionaron." },
        { key: "recursos", label: "Recursos/limitaciones", max: 1200, help: "Recursos o limitantes que influyen en la situación." },
        { key: "resumen", label: "Resumen de la necesidad", max: 1200, help: "Resumen de la necesidad identificada." }
    ];

    window.renderForm1_1 = function (containerId) {
        renderForm({
            id: "1.1",
            containerId: containerId,
            title: "1.1 Identificación de la necesidad",
            intro: "Escribe una explicación breve según la guía. El contador indica el máximo permitido.",
            pdfName: "formulario_1_1.pdf",
            fields: fields_1_1
        });
    };

})();
