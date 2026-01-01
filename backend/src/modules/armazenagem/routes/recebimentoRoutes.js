// src/routes/recebimentoRoutes.js

import express from 'express';
import RecebimentoController from '../controllers/RecebimentoController.js'; // Novo Controller
const router = express.Router();

// ----------------------------------------------------------------------
// ROTAS DO MÓDULO RECEBIMENTO
// ----------------------------------------------------------------------

/**
 * Processa o recebimento do pallet (dados do OCR)
 * Cria o Pallet no banco e inicia a quarentena de 48h no 'chão'
 * POST /api/recebimento/processar
 */
router.post('/processar', RecebimentoController.processarRecebimentoPorOCR);

// ----------------------------------------------------------------------

export default router;