/* form_1_5.js
   Formulario 1.5 utilizando el motor común formEngine.js
*/

(function () {

    const fields_1_5 = [
        { key: "etapas", label: "Etapas principales", max: 2000, help: "Identifica y organiza las etapas principales del proyecto." },
        { key: "actividades", label: "Actividades por etapa", max: 3000, help: "Describe las actividades específicas de cada etapa." },
        { key: "tiempos", label: "Estimación de tiempos", max: 2000, help: "Estima el tiempo necesario de cada actividad (cronograma preliminar)." },
        { key: "responsables", label: "Responsables y roles", max: 2000, help: "Indica responsables y roles de cada tarea." },
        { key: "resultados", label: "Resultados intermedios", max: 2000, help: "Explica los productos o resultados al finalizar cada fase." },
        { key: "gantt", label: "Diagrama de Gantt (resumen)", max: 5000, help: "Pega un resumen textual o tabla del diagrama de Gantt." }
    ];

    window.renderForm1_5 = function (containerId) {
        renderForm({
            id: "1.5",
            containerId,
            title: "1.5 Plan de trabajo",
            intro:
                "Proporciona un plan claro: etapas, actividades, tiempos, responsables y resultados. " +
                "Para el Gantt puedes pegar un resumen textual o tabla.",
            pdfName: "formulario_1_5_plan_trabajo.pdf",
            fields: fields_1_5
        });
    };

})();
