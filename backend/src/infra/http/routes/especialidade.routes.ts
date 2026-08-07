import { Router } from "express";
import { EspecialidadeController } from "../controllers/EspecialidadeController";
import { autenticar } from "../middlewares/autenticar";
import { somenteAdmin } from "../middlewares/somenteAdmin";

const especialidadeRoutes = Router();
const especialidadeController = new EspecialidadeController();

especialidadeRoutes.post(
  "/especialidades",
  autenticar,
  somenteAdmin,
  (req, res) => especialidadeController.cadastrar(req, res)
);

especialidadeRoutes.get("/especialidades", (req, res) =>
  especialidadeController.listar(req, res)
);

export { especialidadeRoutes };