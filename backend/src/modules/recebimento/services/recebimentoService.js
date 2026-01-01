import Recebimento from '../models/recebimentoModel.js';
import PalletRegistro from '../models/PalletRegistro.js'; // Ajustado para o model padrão

class RecebimentoService {

    async processarRecebimento(dados) {
        try {
            const recebimento = await Recebimento.create({
                tipoEntrada: dados.tipoEntrada,
                usuarioId: dados.usuarioId,
                observacoes: dados.observacoes,
                status: 'CONCLUIDO'
            });

            if (dados.pallets && dados.pallets.length > 0) {
                const agora = new Date();
                const dataVenc = new Date();
                dataVenc.setMonth(dataVenc.getMonth() + 24);

                const dataLib = new Date();
                dataLib.setHours(dataLib.getHours() + 48);

                await Promise.all(dados.pallets.map(palletData =>
                    PalletRegistro.create({
                        ...palletData,
                        registroTurnoId: null, // Recebimento externo pode não ter turno
                        status: 'EM_QUARENTENA',
                        dataFabricacao: palletData.dataFabricacao || agora,
                        dataVencimento: dataVenc,
                        dataQuarentenaFim: dataLib,
                        statusProducao: palletData.statusProducao || 'COMPLETO'
                    })
                ));
            }

            return { success: true, message: 'Recebimento e Maturação processados.' };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    async listarRecebimentos(filtros = {}) {
        try {
            const recebimentos = await Recebimento.findAll({
                where: { ...filtros },
                order: [['createdAt', 'DESC']]
            });
            return { success: true, recebimentos };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
export default new RecebimentoService();