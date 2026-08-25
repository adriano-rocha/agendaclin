import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { autenticar } from "../middlewares/autenticar";

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

usuarioRoutes.post("/usuarios", (req, res) => usuarioController.cadastrar(req, res));

usuarioRoutes.patch("/usuarios/me", autenticar, (req, res) =>
  usuarioController.atualizarPerfil(req, res)
);

usuarioRoutes.patch("/usuarios/me/senha", autenticar, (req, res) =>
  usuarioController.alterarSenha(req, res)
);

export { usuarioRoutes };