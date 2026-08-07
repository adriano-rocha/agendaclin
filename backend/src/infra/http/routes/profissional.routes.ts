import { Router } from "express";
import { ProfissionalController } from "../controllers/ProfissionalController";
import { autenticar } from "../middlewares/autenticar";
import { somenteAdmin } from "../middlewares/somenteAdmin";

const profissionalRoutes = Router();
const profissionalController = new ProfissionalController();

profissionalRoutes.post(
  "/profissionais",
  autenticar,
  somenteAdmin,
  (req, res) => profissionalController.cadastrar(req, res)
);

profissionalRoutes.get("/profissionais", (req, res) =>
  profissionalController.listar(req, res)
);

export { profissionalRoutes };