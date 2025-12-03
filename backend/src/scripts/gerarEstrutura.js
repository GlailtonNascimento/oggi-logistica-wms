// scripts/gerarEstrutura.js
import fs from "fs";
import path from "path";

const raiz = path.resolve("src/modules");

const modulos = [
    "produtos",
    "armazenagem",
    "expedicao",
    "recebimento",
    "maturacao",
    "friozem",
    "auditoria",
    "relatorios"
];

const subpastas = ["controllers", "models", "routes", "services"];

function criarPasta(p) {
    if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true });
        console.log("📁 Criado:", p);
    }
}

function criarArquivo(caminho, conteudo = "") {
    if (!fs.existsSync(caminho)) {
        fs.writeFileSync(caminho, conteudo);
        console.log("📄 Criado arquivo:", caminho);
    }
}

// Template base para cada arquivo
const templateModel = (nome) => `
import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

const ${nome} = sequelize.define("${nome}", {
    // Campos aqui
}, {
    timestamps: true,
    tableName: "${nome.toLowerCase()}"
});

export default ${nome};
`;

const templateController = (nome) => `
export default {
    async listar(req, res) {
        res.json({ msg: "Listar ${nome}" });
    },
    async criar(req, res) {
        res.json({ msg: "Criar ${nome}" });
    }
};
`;

const templateService = (nome) => `
export default {
    async exemplo() {
        return "${nome} service funcionando";
    }
};
`;

const templateRoute = (nome) => `
import { Router } from "express";
import controller from "../controllers/${nome}Controller.js";

const router = Router();

router.get("/", controller.listar);
router.post("/", controller.criar);

export default router;
`;

// Gerar estrutura
console.log("\n🚀 Iniciando geração da estrutura dos módulos...\n");

modulos.forEach((modulo) => {
    const pastaModulo = path.join(raiz, modulo);
    criarPasta(pastaModulo);

    subpastas.forEach((sub) => {
        const caminhoSub = path.join(pastaModulo, sub);
        criarPasta(caminhoSub);

        const nome = modulo.charAt(0).toUpperCase() + modulo.slice(1);

        // Criar arquivos padrões
        if (sub === "models") {
            criarArquivo(path.join(caminhoSub, `${modulo}.js`), templateModel(nome));
        }
        if (sub === "controllers") {
            criarArquivo(path.join(caminhoSub, `${modulo}Controller.js`), templateController(nome));
        }
        if (sub === "services") {
            criarArquivo(path.join(caminhoSub, `${modulo}Service.js`), templateService(nome));
        }
        if (sub === "routes") {
            criarArquivo(path.join(caminhoSub, `${modulo}Routes.js`), templateRoute(modulo));
        }
    });

    // Criar index.js do módulo
    const indexConteudo = `
import routes from "./routes/${modulo}Routes.js";
export default routes;
    `;
    criarArquivo(path.join(pastaModulo, "index.js"), indexConteudo);
});

console.log("\n✨ Estrutura finalizada com sucesso!\n");
