import express from "express";

import produtos from "../modules/produtos/routes/route.js";
import armazenagem from "../modules/armazenagem/routes/route.js";
import expedicao from "../modules/expedicao/routes/route.js";
import recebimento from "../modules/recebimento/routes/route.js";
// import maturacao from "../modules/maturacao/routes/route.js";
import friozem from "../modules/friozem/routes/route.js";
import auditoria from "../modules/auditoria/routes/route.js";
import relatorios from "../modules/relatorios/routes/route.js";

const router = express.Router();

// 📌 Registrar rotas de cada módulo
router.use("/produtos", produtos);
router.use("/armazenagem", armazenagem);
router.use("/expedicao", expedicao);
router.use("/recebimento", recebimento);
// router.use("/maturacao", maturacao);
router.use("/friozem", friozem);
router.use("/auditoria", auditoria);
router.use("/relatorios", relatorios);

export default router;
