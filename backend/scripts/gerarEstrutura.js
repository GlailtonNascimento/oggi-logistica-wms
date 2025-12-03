// scripts/gerarEstrutura.js
import fs from "fs";
import path from "path";

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

const basePath = path.join("src", "modules");

modules.forEach(module => {
    const modulePath = path.join(basePath, module);

    const subFolders = ["controllers", "models", "routes", "services"];

    subFolders.forEach(folder => {
        const fullPath = path.join(modulePath, folder);

        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log("Criado:", fullPath);
        }

        // Criar arquivo padrão
        const fileName = `${folder.slice(0, -1)}.js`; // ex: controller.js, route.js etc.
        const filePath = path.join(fullPath, fileName);

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, `// ${module} - ${folder}`);
            console.log("Arquivo criado:", filePath);
        }
    });
});

console.log("✔ Estrutura criada com sucesso!");
