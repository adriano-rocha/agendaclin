import express from "express";
import { usuarioRoutes } from "./infra/http/routes/usuario.routes";
import { autenticacaoRoutes } from "./infra/http/routes/autenticacao.routes";

const app = express();
app.use(express.json());
app.use(usuarioRoutes);
app.use(autenticacaoRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ mensagem: "AgendaClin API rodando" });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});