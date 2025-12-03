// verificar_railway.cjs
// Uso: node verificar_railway.cjs
const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log("🔍 VERIFICANDO BANCO RAILWAY COM DATABASE_URL...\n");

// Verificar se DATABASE_URL existe
if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL não encontrada no .env");
    process.exit(1);
}

console.log("📋 DATABASE_URL DETECTADA!");
// (opcional) aqui você pode logar partes do URL, mas cuidado para não vazar secrets
console.log("   Host: mainline.proxy.rlwy.net");
console.log("   Porta: 53206");
console.log("   Banco: railway\n");

// Criar conexão usando DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

async function verificarBanco() {
    try {
        // Testar conexão
        await sequelize.authenticate();
        console.log("✅ CONEXÃO COM RAILWAY ESTABELECIDA!\n");

        // Listar tabelas
        console.log("📊 TABELAS EXISTENTES:");
        console.log("=".repeat(50));

        const [tabelas] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        if (!tabelas || tabelas.length === 0) {
            console.log("   ℹ️  Nenhuma tabela encontrada");
        } else {
            tabelas.forEach((t, i) => {
                console.log(`   ${i + 1}. ${t.table_name}`);
            });
        }

        // Mostrar estrutura de cada tabela
        console.log("\n🔍 ESTRUTURA DAS TABELAS:");
        console.log("=".repeat(50));

        for (const tabela of tabelas) {
            console.log(`\n🏷️  ${tabela.table_name.toUpperCase()}:`);

            const [colunas] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = '${tabela.table_name}'
        ORDER BY ordinal_position;
      `);

            if (!colunas || colunas.length === 0) {
                console.log("   (nenhuma coluna encontrada)");
                continue;
            }

            colunas.forEach((col) => {
                const tipo = (col.data_type || "").toUpperCase();
                const nulo = col.is_nullable === "YES" ? "NULL" : "NOT NULL";
                console.log(`   • ${col.column_name.padEnd(20)} ${tipo.padEnd(15)} ${nulo}`);
            });

            // opcional: contar registros (só se tabela pequena)
            try {
                const [countResult] = await sequelize.query(`SELECT COUNT(*)::text as total FROM "${tabela.table_name}";`);
                const total = countResult && countResult[0] ? countResult[0].total : "0";
                console.log(`   ➜ Total registros: ${total}`);
            } catch (err) {
                console.log("   ➜ Não foi possível contar registros (permissão/tamanho).");
            }
        }

        console.log("\n" + "=".repeat(50));
        console.log("✅ VERIFICAÇÃO COMPLETA!");
        console.log("🚀 PRONTO PARA CRIAR OS MODELS!");
        await sequelize.close();
    } catch (error) {
        console.error("\n❌ ERRO:", error.message || error);
        console.log("\n💡 DICAS:");
        console.log("   1. Verifique se o Railway está ativo");
        console.log("   2. A DATABASE_URL pode ter expirado");
        console.log("   3. Tente gerar nova URL no Railway");
        process.exit(1);
    }
}

verificarBanco();
