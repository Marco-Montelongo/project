/* form_1_2.js
   Formulario 1.2 utilizando el motor común formEngine.js
*/

(function () {

    const fields_1_2 = [
        { 
            key: "problema", 
            label: "Definir el problema", 
            max: 1200, 
            help: "Define con claridad qué aspecto o situación específica se debe resolver dentro del contexto identificado (1 párrafo)." 
        },
        { 
            key: "objetivo", 
            label: "Objetivo de la solución", 
            max: 1200, 
            help: "Explica qué se busca lograr o alcanzar mediante la solución propuesta (1 párrafo)." 
        },
        { 
            key: "limitaciones", 
            label: "Limitaciones o condiciones", 
            max: 1200, 
            help: "Identifica limitaciones o condiciones como espacio, costo, materiales, seguridad, etc. (1 párrafo)." 
        },
        { 
            key: "beneficiarios", 
            label: "Beneficiarios", 
            max: 1200, 
            help: "Reconoce quiénes se beneficiarán directa o indirectamente con la solución (1 párrafo)." 
        },
        { 
            key: "enunciado", 
            label: "Enunciado del problema de diseño", 
            max: 1200, 
            help: "Formula un enunciado claro y conciso que describa el problema de diseño." 
        }
    ];

    window.renderForm1_2 = function (containerId) {
        renderForm({
            id: "1.2",
            containerId: containerId,
            title: "1.2 Definir el problema",
            intro: "Completa cada apartado según la guía. El contador indica el máximo permitido.",
            pdfName: "formulario_1_2.pdf",
            fields: fields_1_2
        });
    };

})();
