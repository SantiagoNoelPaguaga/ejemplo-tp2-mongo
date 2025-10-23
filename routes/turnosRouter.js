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

export default router;
