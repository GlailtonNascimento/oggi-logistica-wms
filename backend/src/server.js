import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import apiRoutes from "./routes/index.js"; // Suas rotas centrais

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

// --- ROTAS ---
app.use("/api", userRoutes);      // Rotas de Usuário/Login
app.use("/api/v1", apiRoutes);   // 🔥 ATIVE ISSO: Rotas dos módulos (Friozem, etc.)

// Conectar ao banco
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("📦 Banco conectado!");

        // Sincroniza os modelos (Cria as tabelas se não existirem)
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


