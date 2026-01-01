import AuditoriaService from '../services/auditoriaService.js';
import { StatusCodes } from 'http-status-codes';

class AuditoriaController {
    /**
     * Bloqueia um lote inteiro (Código + Lote)
     */
    async bloquearLote(req, res) {
        try {
            const { codigoProduto, lote, motivo, usuarioId, observacoes } = req.body;

            if (!codigoProduto || !lote || !motivo || !usuarioId) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: 'Dados obrigatórios ausentes: codigoProduto, lote, motivo e usuarioId.'
                });
            }

            const resultado = await AuditoriaService.bloquearLote(codigoProduto, lote, motivo, usuarioId, observacoes);
            res.status(resultado.success ? StatusCodes.OK : StatusCodes.CONFLICT).json(resultado);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }

    /**
     * Libera um lote que estava bloqueado pela qualidade
     */
    async liberarLote(req, res) {
        try {
            const { codigoProduto, lote, motivo, usuarioId, observacoes } = req.body;

            const resultado = await AuditoriaService.liberarLote(codigoProduto, lote, motivo, usuarioId, observacoes);
            res.status(resultado.success ? StatusCodes.OK : StatusCodes.CONFLICT).json(resultado);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }
}

export default new AuditoriaController();