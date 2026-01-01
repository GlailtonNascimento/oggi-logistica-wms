import express from 'express';
import RecebimentoController from '../controllers/recebimentoControllers.js';
const router = express.Router();

// Rotas Antigas (Fluxo de Documento de Entrada)
router.post('/', RecebimentoController.criarRecebimento);
router.get('/', RecebimentoController.listarRecebimentos);

export default router;