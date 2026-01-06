import FriozemService from '../services/friozemService.js';

/**
 * Controller responsável pelas Ordens de Movimentação
 * Fluxo:
 * SISTEMA → ANALISTA → EMPILHADOR → CONFERENTE
 */
class OrdemMovimentacaoController {

    /**
     * 🧠 SISTEMA
     * Cria ordens automaticamente a partir do planejamento (OCR / Painel)
     */
    async gerarAutomaticas(req, res) {
        try {
            const { planejamento, turno } = req.body;

            if (!Array.isArray(planejamento) || !turno) {
                return res.status(400).json({
                    error: 'Planejamento (array) e turno são obrigatórios'
                });
            }

            const resultado = await FriozemService.gerarOrdensMovimentacaoAutomaticas(
                planejamento,
                turno
            );

            return res.status(201).json(resultado);
        } catch (error) {
            console.error('Erro ao gerar ordens automáticas:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * 👨‍💼 ANALISTA / ASSISTENTE
     * Confirma ou valida a ordem sugerida pelo sistema
     */
    async confirmar(req, res) {
        try {
            const { ordemId, usuario } = req.body;

            if (!ordemId || !usuario) {
                return res.status(400).json({
                    error: 'ordemId e usuario são obrigatórios'
                });
            }

            const ordem = await FriozemService.confirmarOrdem(ordemId, usuario);
            return res.status(200).json(ordem);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * 👷 EMPILHADOR
     * Lista ordens pendentes do turno
     */
    async listarParaExecucao(req, res) {
        try {
            const { turno } = req.query;

            if (!turno) {
                return res.status(400).json({ error: 'Turno é obrigatório' });
            }

            const ordens = await FriozemService.listarOrdensParaExecucao(turno);
            return res.status(200).json(ordens);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * 👷 EMPILHADOR
     * Inicia a movimentação
     */
    async iniciar(req, res) {
        try {
            const { ordemId } = req.body;

            if (!ordemId) {
                return res.status(400).json({ error: 'ordemId é obrigatório' });
            }

            const ordem = await FriozemService.iniciarMovimentacao(ordemId);
            return res.status(200).json(ordem);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * 📦 CONFERENTE
     * Finaliza a ordem após conferência física
     */
    async concluir(req, res) {
        try {
            const { ordemId } = req.body;

            if (!ordemId) {
                return res.status(400).json({ error: 'ordemId é obrigatório' });
            }

            const ordem = await FriozemService.concluirMovimentacao(ordemId);
            return res.status(200).json(ordem);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new OrdemMovimentacaoController();
