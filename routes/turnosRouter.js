import express from "express";
const router = express.Router();

// 📄 Mostrar formulario para registrar un nuevo turno
router.get("/new", (req, res) => {
  res.render("turno/nuevoTurno");
});

// 📨 Procesar el formulario (verificar datos recibidos)
router.post("/new", (req, res) => {
  console.log("🧾 Datos recibidos del formulario de turno:");
  console.log(req.body);

  // Muestra en consola el objeto anidado como lo entiende Express
  // Luego podrías guardar en MongoDB, pero por ahora solo devolvemos respuesta
  res.send("Turno recibido. Revisa la consola del servidor 👀");
});

export default router;
