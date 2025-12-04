/* ============================================================
   form_equipo.js
   Formulario de datos del equipo usando formEngine.js
   ============================================================ */

(function () {

    // ----- Campos simples -----
    const fields_equipo = [
        { key: "grupo", label: "Grupo", max: 2, help: "Ejemplo: 01, 02..." },
        { key: "equipo", label: "Número de equipo", max: 2, help: "Ejemplo: 01, 02, 03..." },
        { key: "proyecto", label: "Nombre del proyecto", max: 150, help: "Nombre oficial del proyecto." },
        { key: "semestre", label: "Semestre", max: 6, help: "Ejemplo: 2025-1, 2025-2..." }
    ];

    // ----- Campo LISTA -----
    const lists_equipo = [
        {
            key: "integrantes",
            label: "Integrantes del equipo",
            maxItems: 7,
            help: "Agrega hasta siete integrantes. Se ordenan automáticamente."
        }
    ];

    window.renderForm_Equipo = function (containerId) {
        renderForm({
            id: "equipo",
            containerId: containerId,
            title: "Equipo de trabajo",
            intro: "Completa los datos básicos del equipo para el proyecto.",
            pdfName: "form_equipo.pdf",
            fields: fields_equipo,
            integrantes: true,

            // Agregamos el generador PDF especial:
            pdfCustom: generateEquipoPDF
        });
    };


    // ======================================================================
    // PDF ESPECIAL PARA PORTADA DEL PROYECTO
    // ======================================================================
    async function generateEquipoPDF(data) {
        const { jsPDF } = window.jspdf;
        const fechaActual = getFechaSistema();

        const pdf = new jsPDF({
            unit: "pt",
            format: "letter"
        });

        const pageWidth = pdf.internal.pageSize.getWidth();

        // ===========================================================
        // CARGA DE LOGOS DESDE img/
        // ===========================================================
        async function loadImgAsBase64(url) {
            const res = await fetch(url);
            const blob = await res.blob();
            return await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        }

        const logoUNAM = await loadImgAsBase64("img/escudoUNAM.png");
        const logoFI = await loadImgAsBase64("img/escudoFI.png");

        // ===========================================================
        // PORTADA
        // ===========================================================
        const center = pageWidth / 2;

        // LOGOS
        pdf.addImage(logoUNAM, "PNG", 80, 40, 90, 90);
        pdf.addImage(logoFI, "PNG", pageWidth - 170, 40, 90, 90);

        let y = 160;

        // Encabezado institución
        pdf.setFont("Times", "bold");
        pdf.setFontSize(20);
        pdf.text("Universidad Nacional Autónoma de México", center, y, { align: "center" });

        y += 32;
        pdf.setFontSize(16);
        pdf.setFont("Times", "normal");
        pdf.text("Facultad de Ingeniería", center, y, { align: "center" });

        y += 22;
        pdf.text("Ingeniería de Diseño", center, y, { align: "center" });

        // Grupo / semestre
        y += 28;
        pdf.setFontSize(13);
        pdf.text(`Grupo: ${data.grupo || "(sin grupo)"} - Semestre: ${data.semestre || "(sin semestre)"}`, center, y, { align: "center" });

        // Proyecto final
        y += 55;
        pdf.setFont("Times", "italic");
        pdf.setFontSize(15);
        pdf.text("Proyecto Final", center, y, { align: "center" });

        // Título
        y += 28;
        pdf.setFont("Times", "bold");
        pdf.setFontSize(18);
        pdf.text(data.proyecto || "(Sin título)", center, y, { align: "center" });

        // Profesor
        y += 55;
        pdf.setFont("Times", "italic");
        pdf.setFontSize(14);
        pdf.text("Profesor:", center, y, { align: "center" });

        y += 22;
        pdf.setFont("Times", "normal");
        pdf.text(data.profesor || "Dr. Leopoldo Adrián González González", center, y, { align: "center" });

        // Integrantes
        y += 40;
        pdf.setFont("Times", "italic");
        pdf.setFontSize(14);
        pdf.text("Integrantes:", center, y, { align: "center" });

        y += 25;
        pdf.setFont("Times", "normal");
        pdf.setFontSize(13);

        if (Array.isArray(data.integrantes) && data.integrantes.length > 0) {
            data.integrantes.forEach(nombre => {
                pdf.text(nombre, center, y, { align: "center" });
                y += 18;
            });
        } else {
            pdf.text("(No se registraron integrantes)", center, y, { align: "center" });
            y += 18;
        }

        // Pie de página
        y += 40;
        pdf.setFontSize(12);
        pdf.text(`Ciudad Universitaria, México CDMX, ${fechaActual}`, center, y, { align: "center" });


        // Guardar PDF
        pdf.save("portada_equipo.pdf");
    }

    function getFechaSistema() {
        const hoy = new Date();

        const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        const dia = hoy.getDate();
        const mes = meses[hoy.getMonth()];
        const año = hoy.getFullYear();

        return `${dia} de ${mes} de ${año}`;
    }


})();
