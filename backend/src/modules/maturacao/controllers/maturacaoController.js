import MaturacaoService from '../services/maturacaoService.js';
import { StatusCodes } from 'http-status-codes'; // Para respostas HTTP claras

class MaturacaoController {

    /**
     * POST /api/maturacao/bloquear
     * Endpoint para o time de Qualidade BLOQUEAR um Pallet manualmente.
     */
    async bloquearPallet(req, res) {
        try {
            const { palletId, motivo, usuarioId, observacoes } = req.body;

            if (!palletId || !motivo || !usuarioId) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: 'Dados obrigatórios ausentes: palletId, motivo e usuarioId.'
                });
            }

            const resultado = await MaturacaoService.bloquearPallet(palletId, motivo, usuarioId, observacoes);

            if (resultado.success) {
                res.status(StatusCodes.OK).json(resultado);
            } else {
                res.status(StatusCodes.CONFLICT).json(resultado);
            }
        } catch (error) {
            console.error('Erro no bloqueio manual de pallet:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno ao processar o bloqueio.'
            });
        }
    }

    /**
     * POST /api/maturacao/desbloquear
     * Endpoint para o time de Qualidade DESBLOQUEAR um Pallet manualmente.
     */
    async desbloquearPallet(req, res) {
        try {
            const { palletId, motivo, usuarioId, observacoes } = req.body;

            if (!palletId || !motivo || !usuarioId) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: 'Dados obrigatórios ausentes: palletId, motivo e usuarioId.'
                });
            }

            const resultado = await MaturacaoService.desbloquearPallet(palletId, motivo, usuarioId, observacoes);

            if (resultado.success) {
                res.status(StatusCodes.OK).json(resultado);
            } else {
                res.status(StatusCodes.CONFLICT).json(resultado);
            }
        } catch (error) {
            console.error('Erro no desbloqueio manual de pallet:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno ao processar o desbloqueio.'
            });
        }
    }

    /**
     * POST /api/maturacao/verificar-quarentena
     * Endpoint para FORÇAR a rotina de liberação (útil para cron jobs e auditoria).
     */
    async verificarQuarentena(req, res) {
        try {
            // Este endpoint apenas chama a lógica de verificação automática do Service
            const resultado = await MaturacaoService.liberarQuarentenaAutomatica();

            res.status(StatusCodes.OK).json(resultado);

        } catch (error) {
            console.error('Erro na verificação de quarentena:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno ao executar a verificação de quarentena.'
            });
        }
    }
}

export default new MaturacaoController();