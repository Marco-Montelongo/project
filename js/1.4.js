/* form_1_4.js
   Formulario 1.4 utilizando el motor común formEngine.js
*/

(function () {

    const fields_1_4 = [
        { 
            key: "funciones", 
            label: "Funciones del diseño", 
            max: 1200, 
            help: "Identifica y describe las funciones que el diseño debe cumplir para resolver el problema planteado (1 párrafo)." 
        },
        { 
            key: "dimensiones", 
            label: "Dimensiones, capacidades o alcances", 
            max: 1200, 
            help: "Determina las dimensiones, capacidades o alcances necesarios para el funcionamiento del producto o sistema." 
        },
        { 
            key: "materiales", 
            label: "Materiales y mecanismos", 
            max: 1200, 
            help: "Selecciona y explica los materiales y mecanismos más adecuados según el contexto y uso." 
        },
        { 
            key: "seguridad", 
            label: "Seguridad, ergonomía y mantenimiento", 
            max: 1200, 
            help: "Especifica condiciones de seguridad, ergonomía y mantenimiento que influyen en el diseño." 
        },
        { 
            key: "estetica", 
            label: "Criterios estéticos e integración", 
            max: 1200, 
            help: "Define los criterios estéticos y de integración con el entorno." 
        },
        { 
            key: "sostenibilidad", 
            label: "Requerimientos ambientales y sostenibilidad", 
            max: 1200, 
            help: "Identifica los requerimientos ambientales y de sostenibilidad aplicables." 
        },
        { 
            key: "limitaciones", 
            label: "Limitaciones económicas/técnicas", 
            max: 1200, 
            help: "Describe limitaciones económicas, técnicas o estructurales." 
        },
        { 
            key: "lista", 
            label: "Lista final de especificaciones y requerimientos", 
            max: 3000, 
            help: "Elabora la lista final de especificaciones y requerimientos (puede usar viñetas o texto libre)." 
        }
    ];

    window.renderForm1_4 = function (containerId) {
        renderForm({
            id: "1.4",
            containerId: containerId,
            title: "1.4 Especificaciones y requerimientos",
            intro: "Complete cada apartado con la información solicitada. Puede usar viñetas o texto libre en el último campo.",
            pdfName: "formulario_1_4.pdf",
            fields: fields_1_4
        });
    };

})();
