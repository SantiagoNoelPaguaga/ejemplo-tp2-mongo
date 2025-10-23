import express from "express";
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("turno/nuevoTurno");
});

router.post("/new", (req, res) => {
  console.log("Datos recibidos del formulario de turno:");
  console.log(req.body);
  res.send("Turno recibido.");
});

router.get("/", (req, res) => {
  const turnos = [];

  const estados = ["Pendiente", "Confirmado", "Cancelado"];
  const tipos = ["Consulta", "Estudio", "Control"];
  const nombresPacientes = [
    "Juan",
    "María",
    "Carlos",
    "Laura",
    "Ana",
    "Luis",
    "Sofía",
    "Pedro",
    "Lucía",
    "Mateo",
  ];
  const apellidosPacientes = [
    "Pérez",
    "Gómez",
    "López",
    "Martínez",
    "Rodríguez",
    "Fernández",
  ];
  const nombresMedicos = ["Juan", "María", "Carlos", "Laura", "Luis"];
  const apellidosMedicos = ["Pérez", "Gómez", "López", "Martínez", "Rodríguez"];

  for (let i = 1; i <= 40; i++) {
    const pacienteNombre =
      nombresPacientes[Math.floor(Math.random() * nombresPacientes.length)];
    const pacienteApellido =
      apellidosPacientes[Math.floor(Math.random() * apellidosPacientes.length)];
    const medicoNombre =
      nombresMedicos[Math.floor(Math.random() * nombresMedicos.length)];
    const medicoApellido =
      apellidosMedicos[Math.floor(Math.random() * apellidosMedicos.length)];

    const fecha = new Date(Date.now() + i * 86400000);
    console.log(fecha);

    turnos.push({
      _id: i.toString(),
      paciente: {
        nombre: pacienteNombre,
        apellido: pacienteApellido,
        dni: (10000000 + i).toString(),
      },
      fecha: fecha,
      tipoTurno: tipos[Math.floor(Math.random() * tipos.length)],
      descripcion: "Descripción de ejemplo",
      medico: {
        nombre: medicoNombre,
        apellido: medicoApellido,
      },
      estado: estados[Math.floor(Math.random() * estados.length)],
    });
  }

  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  const totalPages = Math.ceil(turnos.length / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const turnosPagina = turnos.slice(start, end);

  res.render("turno/turnos", {
    turnos: turnosPagina,
    page,
    totalPages,
    dni: req.query.dni || "",
    fecha: req.query.fecha || "",
  });
});

export default router;
