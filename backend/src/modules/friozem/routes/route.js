import { Router } from "express";

import FriozemController from "../friozemController.js";
import SeparacaoController from "../separacaoController.js";
import { OrdemMovimentacaoController } from "../controllers/controller.js";

const router = Router();

/**
 * =====================================================
 * ROTAS DE ENTRADA / ARMAZENAGEM (FRIOZEM)
 * =====================================================
 */
router.post("/conferir-entrada", FriozemController.conferirEntrada);
router.patch("/configurar-retrabalho", FriozemController.gerenciarAreaRetrabalho);

/**
 * =====================================================
 * ROTAS DE SEPARAÇÃO (DIA / NOITE)
 * =====================================================
 */
// Equipe do DIA
router.get("/separacao/auditoria", SeparacaoController.checkAbastecimento);

// Equipe da NOITE
router.get("/separacao/painel", SeparacaoController.listarPainelSeparacao);
router.post("/separacao/iniciar", SeparacaoController.iniciarRota);
router.post("/separacao/bipe", SeparacaoController.registrarBipe);
router.patch("/separacao/finalizar-carga", SeparacaoController.finalizarCarregamento);

/**
 * =====================================================
 * ROTAS DE ORDEM DE MOVIMENTAÇÃO (NOVO)
 * =====================================================
 */

/**
 * 🧠 SISTEMA
 * Geração automática de ordens (OCR / Planejamento)
 */
router.post(
    "/movimentacao/gerar",
    OrdemMovimentacaoController.gerarAutomaticas
);

/**
 * 👨‍💼 ANALISTA / ASSISTENTE
 * Confirma ou ajusta a ordem sugerida
 */
router.patch(
    "/movimentacao/confirmar",
    OrdemMovimentacaoController.confirmar
);

/**
 * 👷 EMPILHADOR
 * Lista ordens pendentes por turno
 */
router.get(
    "/movimentacao/pendentes",
    OrdemMovimentacaoController.listarParaExecucao
);

/**
 * 👷 EMPILHADOR
 * Inicia execução da movimentação
 */
router.patch(
    "/movimentacao/iniciar",
    OrdemMovimentacaoController.iniciar
);

/**
 * 📦 CONFERENTE
 * Finaliza a ordem após conferência física
 */
router.patch(
    "/movimentacao/concluir",
    OrdemMovimentacaoController.concluir
);

/**
 * =====================================================
 * TESTE
 * =====================================================
 */
router.get("/teste", (req, res) =>
    res.json({ mensagem: "✅ Módulo Friozem Online!" })
);

export default router;

