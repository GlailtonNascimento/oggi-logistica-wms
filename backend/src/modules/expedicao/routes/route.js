import express from 'express';
import expedicaoController from '../controllers/expedicaoController.js';

const router = express.Router();

// Rota para o Analista criar a ordem
router.post('/iniciar', expedicaoController.iniciarCarregamento);

// Rota para o Empilhador ver onde estão os pallets (Rua/Nível)
router.get('/guia/:ordemCarga', expedicaoController.obterGuiaEmpilhador);

export default router;