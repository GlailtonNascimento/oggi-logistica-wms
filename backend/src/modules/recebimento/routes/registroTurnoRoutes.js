import express from 'express';
// Importa o Controller do novo fluxo
import RegistroTurnoController from '../controllers/registroTurnoController.js';
const router = express.Router();

// ----------------------------------------------------------------------
// ROTAS PARA RASTREABILIDADE / LOTE / TURNO
// ----------------------------------------------------------------------

// POST /api/recebimento/registro/pallet
// Registra um pallet individualmente (durante o turno).
router.post('/pallet', RegistroTurnoController.registrarNovoPallet);

// POST /api/recebimento/registro/fechar/:registroTurnoId
// Fecha o Lote/Turno, consolida o documento e gera o resumo.
router.post('/fechar/:registroTurnoId', RegistroTurnoController.fecharLote);

// Exemplo: GET /api/recebimento/registro/documentos (Para auditoria)
// router.get('/documentos', RegistroTurnoController.listarDocumentosFechados);

export default router;