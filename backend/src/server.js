import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

// Rotas
app.use("/api", userRoutes);

// Conectar ao banco
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("📦 Banco conectado!");

        // 🔥 AQUI É O QUE ESTAVA FALTANDO
        await sequelize.sync({ force: false });
        console.log("🛠️ Tabelas sincronizadas!");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1);
    }
}

startServer();


