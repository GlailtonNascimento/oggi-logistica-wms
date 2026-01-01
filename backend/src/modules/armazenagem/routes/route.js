import express from 'express';
// IMPORTANTE: Importando do unificador 'index.js' que contém o alocacaoController
import { alocacaoController } from '../controllers/index.js';

const router = express.Router();

// ----------------------------------------------------------------------
// ROTAS DO MÓDULO ARMAZENAGEM (ALOCAÇÃO)
// ----------------------------------------------------------------------

/**
 * Alocação Inicial (Empilhador coloca o pallet em um endereço)
 * POST /api/armazenagem/alocar
 */
router.post('/alocar', alocacaoController.alocarPalletNoEndereco);

/**
 * Movimentação Interna (Troca de endereço do pallet)
 * POST /api/armazenagem/movimentar
 */
router.post('/movimentar', alocacaoController.movimentarPallet);

/**
 * Consulta de Endereço (Ver o que tem dentro da posição)
 * GET /api/armazenagem/endereco/:codigo
 */
router.get('/endereco/:codigo', alocacaoController.buscarEndereco);

// ----------------------------------------------------------------------

export default router;