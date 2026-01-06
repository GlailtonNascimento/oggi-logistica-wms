import { sequelize } from "./config/db.js";

// MODELS GLOBAIS
import "./models/user.js";

// MODULES (IMPORTAÇÕES COM NOMES ATUALIZADOS)
import "./modules/produtos/models/produtosModel.js"; // Ajustado conforme seu git status
import "./modules/armazenagem/models/Endereco.js"; 
import "./modules/armazenagem/models/Pallet.js";   // O novo local do Pallet

// OUTROS MÓDULOS
import "./modules/recebimento/models/recebimento.js";
import "./modules/maturacao/models/maturacao.js";
import "./modules/expedicao/models/expedicao.js";
import "./modules/auditoria/models/auditoria.js";

(async () => {
    try {
        console.log("🧨 Conectando ao Railway...");
        await sequelize.authenticate();
        console.log("📡 Conexão estabelecida com sucesso.");

        console.log("🧹 Limpando tabelas antigas (Armazem, Palete...)");
        // O force: true vai apagar o que está lá e criar EXATAMENTE o que está no seu código
        await sequelize.sync({ force: true }); 
        
        console.log("✅ Banco de dados atualizado e sincronizado com o projeto!");
        process.exit();
    } catch (err) {
        console.error("❌ Erro na sincronização:", err);
        process.exit(1);
    }
})();
