// Arquivo: src/modules/maturacao/services/maturacaoService.js

import Pallet from '../../../../models/Pallet.js'; // Importa o Model Pallet Global
import BloqueioQualidade from '../models/maturacaoModel.js'; // O Model de Bloqueio/Desbloqueio
import { Op } from 'sequelize'; // Para usar operadores de comparação de data

class MaturacaoService {

    /**
     * 1. Lógica Crítica: Verifica pallets em quarentena e os libera se 48h expiraram.
     * Este método será chamado periodicamente (Ex: a cada 5 minutos por um cron job).
     */
    async liberarQuarentenaAutomatica() {
        try {
            const dataHoraAtual = new Date();

            // 1. Encontra todos os pallets que estão EM_QUARENTENA e cujo tempo final (48h) já passou.
            const palletsParaLiberar = await Pallet.findAll({
                where: {
                    status: 'EM_QUARENTENA',
                    dataQuarentenaFim: {
                        [Op.lte]: dataHoraAtual // Op.lte = Less Than or Equal (Menor ou Igual)
                    }
                }
            });

            if (palletsParaLiberar.length === 0) {
                return { success: true, message: 'Nenhum pallet em quarentena pronto para liberação.' };
            }

            // 2. Atualiza o status de todos os pallets encontrados.
            const [linhasAfetadas] = await Pallet.update(
                { status: 'LIVRE_EXPEDICAO' },
                {
                    where: {
                        id: palletsParaLiberar.map(p => p.id), // Pega os IDs dos pallets encontrados
                        // Garante que não atualizamos um pallet que foi bloqueado manualmente no último milissegundo
                        status: 'EM_QUARENTENA'
                    }
                }
            );

            return {
                success: true,
                message: `${linhasAfetadas} pallet(s) liberado(s) automaticamente para expedição.`,
                liberados: palletsParaLiberar.map(p => p.codigoBarras)
            };
        } catch (error) {
            console.error('Erro na liberação automática de quarentena:', error);
            return { success: false, error: 'Erro interno na rotina de maturação.' };
        }
    }

    /**
     * 2. Ação Manual: Bloqueia um pallet por ordem da Qualidade.
     */
    async bloquearPallet(palletId, motivo, usuarioId, observacoes) {
        try {
            const pallet = await Pallet.findByPk(palletId);

            if (!pallet) {
                return { success: false, error: 'Pallet não encontrado.' };
            }
            if (pallet.status === 'BLOQUEADO_QUALIDADE') {
                return { success: false, error: 'Pallet já está bloqueado.' };
            }

            // A. Atualiza o status do Pallet
            await pallet.update({ status: 'BLOQUEADO_QUALIDADE' });

            // B. Registra a auditoria no Model BloqueioQualidade
            await BloqueioQualidade.create({
                palletId,
                tipoAcao: 'BLOQUEIO',
                motivo,
                usuarioId,
                observacoes
            });

            return { success: true, message: `Pallet ${pallet.codigoBarras} bloqueado pela Qualidade com sucesso.` };
        } catch (error) {
            console.error('Erro ao bloquear pallet:', error);
            return { success: false, error: error.message || 'Erro ao bloquear pallet.' };
        }
    }

    /**
     * 3. Ação Manual: Desbloqueia um pallet por ordem da Qualidade.
     */
    async desbloquearPallet(palletId, motivo, usuarioId, observacoes) {
        try {
            const pallet = await Pallet.findByPk(palletId);

            if (!pallet || pallet.status !== 'BLOQUEADO_QUALIDADE') {
                return { success: false, error: 'Pallet não encontrado ou não está bloqueado pela Qualidade.' };
            }

            // A. Atualiza o status do Pallet (Volta para LIVRE_EXPEDICAO, pois a quarentena já passou)
            await pallet.update({ status: 'LIVRE_EXPEDICAO' });

            // B. Registra a auditoria no Model BloqueioQualidade
            await BloqueioQualidade.create({
                palletId,
                tipoAcao: 'DESBLOQUEIO',
                motivo: `DESBLOQUEIO: ${motivo}`,
                usuarioId,
                observacoes
            });

            return { success: true, message: `Pallet ${pallet.codigoBarras} desbloqueado e liberado para expedição.` };
        } catch (error) {
            console.error('Erro ao desbloquear pallet:', error);
            return { success: false, error: error.message || 'Erro ao desbloquear pallet.' };
        }
    }
}

export default new MaturacaoService();