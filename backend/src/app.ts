import express from "express";
import cors from 'cors';
import { usuarioRoutes } from "./infra/http/routes/usuario.routes";
import { autenticacaoRoutes } from "./infra/http/routes/autenticacao.routes";
import { especialidadeRoutes } from "./infra/http/routes/especialidade.routes";
import { profissionalRoutes } from "./infra/http/routes/profissional.routes";
import { autenticar } from "./infra/http/middlewares/autenticar";
import { agendamentoRoutes } from "./infra/http/routes/agendamento.routes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(usuarioRoutes);
app.use(autenticacaoRoutes);
app.use(especialidadeRoutes);
app.use(profissionalRoutes);
app.use(agendamentoRoutes);

app.get("/perfil", autenticar, (req, res) => {
  res.status(200).json({ mensagem: "Acesso liberado", usuario: req.usuario });
});

app.get("/", (req, res) => {
  res.status(200).json({ mensagem: "AgendaClin API rodando" });
});

export { app };