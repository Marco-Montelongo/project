/* form_1_3.js
   Formulario 1.3 utilizando el motor común formEngine.js
*/

(function () {

    const fields_1_3 = [
        { key: "productos", label: "Productos o sistemas similares", max: 1200, help: "Describe productos o sistemas similares existentes." },
        { key: "tecnologias", label: "Materiales, mecanismos o tecnologías", max: 1200, help: "Materiales o tecnologías empleadas." },
        { key: "normas", label: "Normas y especificaciones", max: 1200, help: "Normas o reglamentos aplicables." },
        { key: "usuarios", label: "Usuarios finales", max: 1200, help: "Describe usuarios, necesidades y condiciones." },
        { key: "condiciones", label: "Condiciones de uso", max: 1200, help: "Condiciones de uso que influyen en el diseño." },
        { key: "comparativa", label: "Comparación de soluciones existentes", max: 1200, help: "Comparación entre distintas soluciones." },
        { key: "sintesis", label: "Síntesis de fuentes (3 patentes, 3 artículos, 3 libros)", max: 5000, help: "Síntesis de fuentes documentales." }
    ];

    window.renderForm1_3 = function (containerId) {
        renderForm({
            id: "1.3",
            containerId: containerId,
            title: "1.3 Búsqueda de información",
            intro: "Completa cada apartado con información clara, fundamentada y verificada.",
            pdfName: "formulario_1_3.pdf",
            fields: fields_1_3
        });
    };

})();
