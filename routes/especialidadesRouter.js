import express from "express";
import especialidadController from "../controllers/especialidadController.js";

const router = express.Router();

router.get("/", especialidadController.obtenerEspecialidadesJson);

export default router;
