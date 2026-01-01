import { Router } from "express";
import FriozemController from "../friozemController.js";
import SeparacaoController from "../separacaoController.js";

const router = Router();

/**
 * ROTAS DE ENTRADA E AVARIA (FriozemController)
 */
router.post("/conferir-entrada", FriozemController.conferirEntrada);
router.patch("/configurar-retrabalho", FriozemController.gerenciarAreaRetrabalho);

/**
 * ROTAS DE SEPARAÇÃO - DIA E NOITE (SeparacaoController)
 */
// Rota da Equipe do Dia (Auditoria de estoque no 01)
router.get("/separacao/auditoria", SeparacaoController.checkAbastecimento);

// Rotas da Equipe da Noite (Processo de Separação)
router.get("/separacao/painel", SeparacaoController.listarPainelSeparacao);
router.post("/separacao/iniciar", SeparacaoController.iniciarRota);
router.post("/separacao/bipe", SeparacaoController.registrarBipe);
router.patch("/separacao/finalizar-carga", SeparacaoController.finalizarCarregamento);

/**
 * TESTES E UTILITÁRIOS
 */
router.get("/teste", (req, res) => res.json({ mensagem: "Módulo Friozem Online!" }));

// O EXPORT DEVE FICAR SEMPRE NA ÚLTIMA LINHA
export default router;
