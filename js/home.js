// home.js

// Función para renderizar el Home / Manual de usuario
function renderHome(contentId) {
  const container = document.getElementById(contentId);
  container.innerHTML = `
    <section class="content">
      <h1 style="margin-bottom: 15px;">Manual de Usuario</h1>
      <p>Bienvenido al sistema de gestión de proyectos y formularios. A continuación se describe el flujo de uso:</p>
    </section>

    <section class="content">
      <h2>Proceso Inicial</h2>
      <ol>
        <li>Al ingresar por primera vez, registre los integrantes del equipo en el formulario correspondiente.</li>
        <li>Presione <strong>Guardar y Generar PDF</strong> para crear un archivo PDF con la información registrada.</li>
        <li>En la parte inferior, encontrará el botón <strong>Descargar JSON</strong> que permite guardar todos los datos en un archivo JSON local.</li>
      </ol>
    </section>

    <section class="content">
      <h2>Uso Posterior</h2>
      <ol>
        <li>Si vuelve a ingresar a la página, encontrará un botón <strong>Cargar JSON</strong> en la parte inferior.</li>
        <li>Seleccione el JSON descargado previamente para que los datos del equipo y formularios se carguen automáticamente en la página.</li>
        <li>Esto permite visualizar y actualizar los datos sin perder la información registrada anteriormente.</li>
      </ol>
    </section>

    <section class="content">
      <h2>Formulario y Actualización de Datos</h2>
      <ol>
        <li>Cada formulario puede ser completado o modificado.</li>
        <li>Al finalizar, presione <strong>Guardar</strong> para actualizar los datos internos.</li>
        <li>Después de cada modificación, use <strong>Descargar JSON</strong> nuevamente para mantener la información actualizada en un archivo local.</li>
      </ol>
    </section>

    <section class="content">
      <h2>Resumen</h2>
      <ul>
        <li>Registrar datos iniciales del equipo.</li>
        <li>Generar PDF con la información.</li>
        <li>Respaldar y restaurar datos mediante JSON.</li>
        <li>Actualizar formularios y mantener información consistente.</li>
      </ul>
      <p style="margin-top:10px; font-weight: 600; color: #0C2340;">
        Recuerde siempre descargar el JSON después de cualquier cambio para no perder la información.
      </p>
    </section>
  `;
}
