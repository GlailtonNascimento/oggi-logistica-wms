// maturacao - import express from 'express';
// Importa o Controller usando o arquivo índice que criamos antes (controller.js)
import { MaturacaoController } from '../controllers/controller.js'; 

const router = express.Router();

// ----------------------------------------------------------------------
// ROTAS DO MÓDULO MATURAÇÃO (Controle de Qualidade)
// ----------------------------------------------------------------------

/**
 * 1. Ações Manuais do Time de Qualidade
 * São utilizadas pelo frontend para bloqueios e liberações manuais.
 */

// Rota POST para bloquear um pallet:
// URL: POST /api/maturacao/bloquear
router.post('/bloquear', MaturacaoController.bloquearPallet);

// Rota POST para desbloquear um pallet:
// URL: POST /api/maturacao/desbloquear
router.post('/desbloquear', MaturacaoController.desbloquearPallet);


/**
 * 2. Rotinas de Sistema/Auditoria
 * Usada por um cron job (tarefa agendada) ou para forçar a rotina de verificação.
 */

// Rota POST para forçar a verificação da quarentena de 48h e liberar pallets.
// URL: POST /api/maturacao/verificar-quarentena
router.post('/verificar-quarentena', MaturacaoController.verificarQuarentena);

// ----------------------------------------------------------------------

export default router;routes