import express from 'express';
import ArmazenagemController from '../controllers/armazenagemControllers.js';
const router = express.Router();

// ----------------------------------------------------------------------
// ROTAS DO MÓDULO ARMAZENAGEM
// ----------------------------------------------------------------------

/**
 * Alocação Inicial (Empilhador coloca o pallet em um endereço pela primeira vez)
 * POST /api/armazenagem/alocar
 */
router.post('/alocar', ArmazenagemController.alocarPalletNoEndereco);

/**
 * Movimentação Interna (Troca de endereço)
 * POST /api/armazenagem/movimentar
 */
router.post('/movimentar', ArmazenagemController.movimentarPallet);

/**
 * Consulta de Endereço (Empilhador escaneia o endereço para ver o conteúdo)
 * GET /api/armazenagem/endereco/:codigo
 */
router.get('/endereco/:codigo', ArmazenagemController.buscarEndereco);

// ----------------------------------------------------------------------

export default router;