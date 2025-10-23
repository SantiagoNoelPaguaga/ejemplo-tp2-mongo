document.addEventListener("DOMContentLoaded", () => {
  const btnBuscarPaciente = document.getElementById("btnBuscarPaciente");
  const dniPaciente = document.getElementById("dniPaciente");
  const tipoTurno = document.getElementById("tipoTurno");
  const estudioLabel = document.querySelector("label[for='estudioMedico']");
  const estudioSelect = document.getElementById("estudioMedico");
  const medicoLabel = document.querySelector("label[for='medicoId']");
  const medicoSelect = document.getElementById("medicoId");
  const nombreMedicoHidden = document.getElementById("nombreMedico");

  if (dniPaciente.value) {
    dniPaciente.readOnly = true;
  }

  btnBuscarPaciente.addEventListener("click", () => {
    const dni = dniPaciente.value.trim();
    if (!dni) return alert("Ingrese un DNI");
    window.location.href = `/pacientes/buscar?dni=${dni}`;
  });

  tipoTurno.addEventListener("change", async () => {
    const tipo = tipoTurno.value;

    if (tipo === "estudio") {
      estudioLabel.hidden = false;
      estudioSelect.hidden = false;
    } else {
      estudioLabel.hidden = true;
      estudioSelect.hidden = true;
      estudioSelect.value = "";
      await cargarMedicos(tipo);
    }
  });

  estudioSelect.addEventListener("change", async () => {
    if (tipoTurno.value === "estudio") {
      await cargarMedicos("estudio", estudioSelect.value);
    }
  });

  async function cargarMedicos(tipo, estudio = null) {
    medicoLabel.hidden = true;
    medicoSelect.hidden = true;
    medicoSelect.innerHTML = `<option value="" selected disabled>Cargando...</option>`;

    try {
      const medicosEjemplo = [
        { _id: "1", nombre: "Juan", apellido: "Pérez" },
        { _id: "2", nombre: "María", apellido: "Gómez" },
        { _id: "3", nombre: "Carlos", apellido: "López" },
        { _id: "4", nombre: "Laura", apellido: "Martínez" },
        { _id: "5", nombre: "Ana", apellido: "Rodríguez" },
      ];

      await new Promise((res) => setTimeout(res, 300));

      const medicos = medicosEjemplo.filter((m) => true);

      medicoSelect.innerHTML = `<option value="" selected disabled>Seleccione un médico</option>`;
      medicos.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m._id;
        opt.textContent = `${m.nombre} ${m.apellido}`;
        opt.dataset.nombreCompleto = `${m.nombre} ${m.apellido}`;
        medicoSelect.appendChild(opt);
      });

      medicoLabel.hidden = false;
      medicoSelect.hidden = false;
    } catch (err) {
      console.error(err);
      alert("Error al cargar médicos de prueba");
    }
  }

  medicoSelect.addEventListener("change", () => {
    const selected = medicoSelect.selectedOptions[0];
    nombreMedicoHidden.value = selected.dataset.nombreCompleto;
  });
});
