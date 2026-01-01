
import Recebimento from '../models/recebimentoModel.js';
// Importe seu Pallet Model principal aqui, se aplicável, ex:
// import Pallet from '../../../../models/Pallet.js';

class RecebimentoService {

    /**
     * Processa a criação de um novo documento de Recebimento e seus pallets associados.
     * Este é o fluxo de entrada de mercadoria (antigo).
     */
    async processarRecebimento(dados) {
        try {
            // 1. Criar registro de recebimento (documento pai)
            const recebimento = await Recebimento.create({
                tipoEntrada: dados.tipoEntrada,
                usuarioId: dados.usuarioId,
                observacoes: dados.observacoes
            });

            // 2. Simulação de processamento de pallets (O Pallet Model principal deve ser usado aqui)
            // if (dados.pallets) {
            //     const palletsCriados = await Promise.all(dados.pallets.map(palletData => 
            //         Pallet.create({ 
            //             ...palletData,
            //             recebimentoId: recebimento.id, 
            //             status: 'EM_PROCESSAMENTO' 
            //         })
            //     ));
            // }

            // 3. Atualizar status para Concluído se todos os pallets forem registrados (simulação)
            await recebimento.update({ status: 'CONCLUIDO' });

            return {
                success: true,
                recebimento,
                message: `Documento de Recebimento criado e concluído.`
            };

        } catch (error) {
            console.error('Erro no processamento do recebimento:', error);
            return { success: false, error: error.message || 'Erro ao processar recebimento.' };
        }
    }

    /**
     * Lista todos os documentos de Recebimento.
     */
    async listarRecebimentos(filtros = {}) {
        try {
            const recebimentos = await Recebimento.findAll({
                // where: { ...filtros }, 
                // include: [...associações...], 
                order: [['dataHora', 'DESC']]
            });
            return { success: true, recebimentos };
        } catch (error) {
            return { success: false, error: error.message || 'Erro ao listar recebimentos.' };
        }
    }
}

export default new RecebimentoService();