// routes/consultaEstoqueFriozem.routes.js
import express from 'express';
import controller from '../controllers/consultaEstoqueFriozemController.js';

const router = express.Router();

router.get('/saldo', controller.consultarSaldo);

export default router;
