import { sequelize } from "./config/db.js";

// MODELS GLOBAIS
import "./models/user.js";

// MODULES (IMPORTA TODOS)
import "./modules/produtos/models/produto.js";
import "./modules/recebimento/models/recebimento.js";
import "./modules/maturacao/models/maturacao.js";
import "./modules/armazenagem/models/endereco.js";
import "./modules/expedicao/models/expedicao.js";
import "./modules/relatorios/models/relatorio.js";
import "./modules/auditoria/models/auditoria.js";
import "./modules/fiozem/models/fiozem.js";

(async () => {
    try {
        console.log("🧨 Resetando tabelas...");
        await sequelize.sync({ force: true });
        console.log("✅ Banco recriado!");
        process.exit();
    } catch (err) {
        console.error("❌ Erro:", err);
        process.exit(1);
    }
})();
