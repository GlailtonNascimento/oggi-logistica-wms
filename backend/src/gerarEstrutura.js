import fs from "fs";
import path from "path";

const modulesPath = path.resolve("src/modules");

const modules = [
    "produtos",
    "armazenagem",
    "expedicao",
    "recebimento",
    "maturacao",
    "friozem",
    "auditoria",
    "relatorios"
];

const estruturaDefault = {
    controller: `export default {
    async exemplo(req, res) {
        return res.json({ mensagem: "OK - Controller funcionando" });
    }
};`,
    service: `export default {
    exemploService() {
        return "Service funcionando";
    }
};`,
    model: `import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/database.js";

export const Exemplo = sequelize.define("Exemplo", {
    nome: { type: DataTypes.STRING }
});`,
    route: `import { Router } from "express";
const router = Router();

router.get("/teste", (req, res) => res.json({ mensagem: "Rota funcionando" }));

export default router;`
};

function criarArquivo(caminho, conteudo) {
    if (!fs.existsSync(caminho)) {
        fs.writeFileSync(caminho, conteudo);
        console.log("✔ Criado:", caminho);
    } else {
        console.log("… Já existe:", caminho);
    }
}

function gerarEstrutura() {
    if (!fs.existsSync(modulesPath)) {
        fs.mkdirSync(modulesPath, { recursive: true });
    }

    modules.forEach(mod => {
        const pasta = path.join(modulesPath, mod);
        const controller = path.join(pasta, "controller.js");
        const service = path.join(pasta, "service.js");
        const model = path.join(pasta, `${mod}.model.js`);
        const route = path.join(pasta, "routes.js");

        if (!fs.existsSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true });
            console.log("📁 Pasta criada:", pasta);
        }

        criarArquivo(controller, estruturaDefault.controller);
        criarArquivo(service, estruturaDefault.service);
        criarArquivo(model, estruturaDefault.model.replace("Exemplo", mod));
        criarArquivo(route, estruturaDefault.route);
    });
}

gerarEstrutura();

