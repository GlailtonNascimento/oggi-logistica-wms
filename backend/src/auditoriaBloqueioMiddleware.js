import AuditoriaService from '../modules/auditoria/services/auditoriaService.js';

/**
 * 🔒 Middleware Global de Auditoria e Bloqueio
 * Impede movimentações indevidas de pallets
 */
export default async function auditoriaBloqueioMiddleware(req, res, next) {
    try {
        const { palletId, localOperacao } = req.body;

        // Se a rota não movimenta pallet, segue
        if (!palletId) {
            return next();
        }

        // Local padrão se não informar
        const local = localOperacao || 'FABRICA';

        const validacao = await AuditoriaService.validarMovimentacao(
            palletId,
            local
        );

        if (!validacao.permitido) {
            return res.status(423).json({
                success: false,
                bloqueado: true,
                tipoBloqueio: validacao.tipoBloqueio,
                motivo: validacao.motivo,
                mensagem: '🚫 Movimentação bloqueada pela Auditoria.'
            });
        }

        // Tudo ok, segue o fluxo
        next();

    } catch (error) {
        console.error('Erro no middleware de auditoria:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno na validação de auditoria.'
        });
    }
}
