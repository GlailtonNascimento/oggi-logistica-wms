// Arquivo: src/modules/auditoria/routes/routes.js
import express from 'express';
import { AuditoriaController } from '../controllers/controller.js'; 

const router = express.Router();

// Rota principal para processar auditoria (Bloqueio ou Liberação)
// Aceita: codigoProduto, lote, palletIds (opcional), motivo, usuarioId, observacoes
router.post('/processar', AuditoriaController.gerenciarQualidade);

export default router;