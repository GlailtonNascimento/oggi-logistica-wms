import express from 'express';
import planejamentoController from '../controllers/planejamentoController.js';

const router = express.Router();

/**
 * Upload do planejamento do turno (PDF, imagem ou Excel)
 */
router.post(
    '/upload',
    planejamentoController.uploadPlanejamento
);

export default router;
