import Paciente from "../models/PacienteModel.js";

const validarCampos = (data) => {
  const requiredFields = [
    "nombre",
    "apellido",
    "dni",
    "cobertura",
    "email",
    "telefono",
    "domicilio",
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

const mostrarPacientes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 12;
    const dni = req.query.dni || "";

    const { pacientes, totalPages } = await Paciente.listar(page, perPage, dni);
    res.render("paciente/pacientes", {
      pacientes,
      page,
      totalPages,
      dni,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error(error);
    res.render("paciente/pacientes", {
      pacientes: [],
      page: 1,
      totalPages: 1,
      dni: "",
      modalMessage: "Error al cargar pacientes",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const formularioNuevoPaciente = (req, res) => {
  res.render("paciente/nuevoPaciente", {
    formData: {},
    modalMessage: null,
    modalType: null,
    modalTitle: null,
  });
};

const guardarPaciente = async (req, res) => {
  const data = req.body;

  const errorValidacion = validarCampos(data);
  if (errorValidacion) {
    return res.render("paciente/nuevoPaciente", {
      modalMessage: errorValidacion,
      modalType: "error",
      modalTitle: "Error",
      formData: data,
    });
  }

  try {
    await Paciente.crearPaciente(data);
    res.redirect("/pacientes");
  } catch (error) {
    console.error(error);

    let message = "Error al guardar paciente";
    if (error.code === 11000) message = "Ya existe un paciente con ese DNI";

    res.render("paciente/nuevoPaciente", {
      modalMessage: message,
      modalType: "error",
      modalTitle: "Error",
      formData: data,
    });
  }
};

const formularioEditarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.obtenerPorId(req.params.id);
    if (!paciente) {
      return res.redirect("/pacientes");
    }
    res.render("paciente/editarPaciente", {
      paciente,
      modalMessage: null,
      modalType: null,
      modalTitle: null,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/pacientes");
  }
};

const actualizarPaciente = async (req, res) => {
  const data = req.body;

  const errorValidacion = validarCampos(data);
  if (errorValidacion) {
    return res.render("paciente/editarPaciente", {
      modalMessage: errorValidacion,
      modalType: "error",
      modalTitle: "Error",
      paciente: { _id: req.params.id, ...data },
    });
  }

  try {
    await Paciente.actualizarPaciente(req.params.id, data);
    res.redirect("/pacientes");
  } catch (error) {
    console.error(error);

    let message = "Error al actualizar paciente";
    if (error.code === 11000) message = "Ya existe un paciente con ese DNI";

    res.render("paciente/editarPaciente", {
      modalMessage: message,
      modalType: "error",
      modalTitle: "Error",
      paciente: { _id: req.params.id, ...data },
    });
  }
};

const eliminarPaciente = async (req, res) => {
  try {
    await Paciente.eliminarPaciente(req.params.id);
    res.redirect("/pacientes");
  } catch (error) {
    console.error(error);
    const page = 1;
    const perPage = 12;
    const { pacientes, totalPages } = await Paciente.listar(page, perPage);
    res.render("paciente/pacientes", {
      pacientes,
      page,
      totalPages,
      dni: "",
      modalMessage: "Error al eliminar paciente",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

export default {
  mostrarPacientes,
  formularioNuevoPaciente,
  guardarPaciente,
  formularioEditarPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
