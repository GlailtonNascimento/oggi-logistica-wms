import { sequelize } from "./config/db.js";

// ============================
// MODELS GLOBAIS
// ============================
import "./models/user.js";

// ============================
// ARMAZENAGEM
// ============================
import "./modules/armazenagem/models/Endereco.js";
import "./modules/armazenagem/models/Pallet.js";

// ============================
// PRODUTOS
// ============================
import "./modules/produtos/models/produtosModel.js";

// ============================
// OUTROS MÓDULOS
// ============================
import "./modules/recebimento/models/recebimento.js";
import "./modules/maturacao/models/maturacao.js";
import "./modules/expedicao/models/expedicao.js";
import "./modules/auditoria/models/auditoria.js";

(async () => {
  try {
    console.log("📡 Conectando ao banco Railway...");
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco estabelecida");

    console.log("🧨 RESET TOTAL DO BANCO (force: true)");
    await sequelize.sync({ force: true });

    console.log("🎉 Banco recriado com sucesso!");
    console.log("📦 Tabelas agora estão IGUAIS ao projeto");

    process.exit(0);
  } catch (error) {
    console.error("❌ ERRO AO SINCRONIZAR BANCO:", error);
    process.exit(1);
  }
})();
