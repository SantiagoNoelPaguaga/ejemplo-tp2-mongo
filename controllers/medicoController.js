import Medico from "../models/MedicoModel.js";

const validarCampos = (data) => {
  const requiredFields = [
    "nombre",
    "apellido",
    "matricula",
    "dni",
    "telefono",
    "email",
    "domicilio",
    "especialidades",
  ];

  const missingFields = requiredFields.filter(
    (field) => !data[field] || data[field].trim() === ""
  );

  if (missingFields.length > 0) {
    return `Los siguientes campos son obligatorios: ${missingFields.join(
      ", "
    )}`;
  }

  return null;
};

const mostrarMedicos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 12;
    const dni = req.query.dni || "";

    const { medicos, totalPages } = await Medico.listar(page, perPage, dni);
    res.render("medico/medicos", {
      medicos,
      page,
      totalPages,
      dni,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error(error);
    res.render("medico/medicos", {
      medicos: [],
      page: 1,
      totalPages: 1,
      dni: "",
      modalMessage: "Error al cargar médicos",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const formularioNuevoMedico = (req, res) => {
  res.render("medico/nuevoMedico", {
    formData: {},
    modalMessage: null,
    modalType: null,
    modalTitle: null,
  });
};

const guardarMedico = async (req, res) => {
  const data = req.body;
  const errorValidacion = validarCampos(data);

  if (errorValidacion) {
    const medicoData = {
      _id: req.params.id,
      ...data,
      especialidades: data.especialidades
        ? data.especialidades.split(",").map((e) => e.trim())
        : [],
    };

    return res.render("medico/nuevoMedico", {
      modalMessage: errorValidacion,
      modalType: "error",
      modalTitle: "Error",
      formData: medicoData,
    });
  }

  try {
    await Medico.crearMedico({
      ...data,
      especialidades: data.especialidades
        ? data.especialidades.split(",").map((e) => e.trim())
        : [],
    });
    res.redirect("/medicos");
  } catch (error) {
    console.error(error);
    let message = "Error al guardar médico";
    if (error.code === 11000)
      message = "Ya existe un médico con ese DNI o matrícula";

    res.render("medico/nuevoMedico", {
      modalMessage: message,
      modalType: "error",
      modalTitle: "Error",
      formData: {
        ...data,
        especialidades: data.especialidades
          ? data.especialidades.split(",").map((e) => e.trim())
          : [],
      },
    });
  }
};

const formularioEditarMedico = async (req, res) => {
  try {
    const medico = await Medico.obtenerPorId(req.params.id);
    if (!medico) {
      return res.redirect("/medicos");
    }
    res.render("medico/editarMedico", {
      medico,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/medicos");
  }
};

const actualizarMedico = async (req, res) => {
  const data = req.body;
  const errorValidacion = validarCampos(data);

  if (errorValidacion) {
    const medicoData = {
      _id: req.params.id,
      ...data,
      especialidades: data.especialidades
        ? data.especialidades.split(",").map((e) => e.trim())
        : [],
    };

    return res.render("medico/editarMedico", {
      modalMessage: errorValidacion,
      modalType: "error",
      modalTitle: "Error",
      medico: medicoData,
    });
  }

  try {
    await Medico.actualizarMedico(req.params.id, {
      ...data,
      especialidades: data.especialidades
        ? data.especialidades.split(",").map((e) => e.trim())
        : [],
    });
    res.redirect("/medicos");
  } catch (error) {
    console.error(error);
    let message = "Error al actualizar médico";
    if (error.code === 11000)
      message = "Ya existe un médico con ese DNI o matrícula";

    const medicoData = {
      _id: req.params.id,
      ...data,
      especialidades: data.especialidades
        ? data.especialidades.split(",").map((e) => e.trim())
        : [],
    };

    res.render("medico/editarMedico", {
      modalMessage: message,
      modalType: "error",
      modalTitle: "Error",
      medico: medicoData,
    });
  }
};

const eliminarMedico = async (req, res) => {
  try {
    await Medico.eliminarMedico(req.params.id);
    res.redirect("/medicos");
  } catch (error) {
    console.error(error);
    const page = 1;
    const perPage = 12;
    const { medicos, totalPages } = await Medico.listar(page, perPage);
    res.render("medico/medicos", {
      medicos,
      page,
      totalPages,
      dni: "",
      modalMessage: "Error al eliminar médico",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

export default {
  mostrarMedicos,
  formularioNuevoMedico,
  guardarMedico,
  formularioEditarMedico,
  actualizarMedico,
  eliminarMedico,
};
