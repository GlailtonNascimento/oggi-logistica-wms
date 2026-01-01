import express from 'express';
const router = express.Router();

// 1. Importa as rotas do fluxo antigo/principal
import recebimentoRoutesAntigas from './recebimentoRoutesAntigas.js';
// 2. Importa as rotas do novo fluxo de Lote/Turno
import registroTurnoRoutes from './registroTurnoRoutes.js';

// ----------------------------------------------------------------------
// Montagem das Rotas Internas
// ----------------------------------------------------------------------

// 1. Monta o fluxo Antigo/Principal na raiz do módulo (Ex: /api/recebimento/)
router.use('/', recebimentoRoutesAntigas);

// 2. Monta o novo fluxo de Registro de Turno sob o prefixo /registro 
// Ex: /api/recebimento/registro/pallet
router.use('/registro', registroTurnoRoutes);

export default router;