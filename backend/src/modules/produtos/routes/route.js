import { Router } from 'express';
import controller from '../controllers/controller.js';

const router = Router();

// ➕ Cadastrar produto
router.post('/', controller.cadastrar);

// ✏️ Atualizar produto
router.put('/:sku', controller.atualizar);

// 🔍 Consultar produto
router.get('/:sku', controller.verificar);

export default router;



