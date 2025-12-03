import express from "express";
import routes from "./routes/index.js";

const app = express();

// Permitir JSON no corpo das requisições
app.use(express.json());

// Rotas principais
app.use("/api", routes);

// Porta do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
