import { Router } from 'express';
import RelatorioController from '../controllers/relatorioController.js';

const router = Router();

// 📊 DASHBOARD GERAL
router.get('/dashboard', RelatorioController.dashboard);

export default router;
