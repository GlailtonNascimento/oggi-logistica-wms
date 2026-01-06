import Expedicao from '../models/expedicaoModel.js';
import Pallet from '../../armazenagem/models/Pallet.js';
import Endereco from '../../armazenagem/models/Endereco.js';
import Produto from '../../produtos/models/produtosModel.js';

class ExpedicaoService {
    /**
     * Consulta global de pallets por código ou produto
     * Identifica se está no Nível/Rua ou se ainda está no Chão (Doca/Recebimento)
     */
    async consultarEstoqueGeral(filtro) {
        return await Pallet.findAll({
            where: filtro,
            include: [
                {
                    model: Endereco,
                    required: false, // LEFT JOIN: traz o pallet mesmo sem endereço fixo
                    attributes: ['rua', 'posicao', 'nivel', 'tipo']
                },
                {
                    model: Produto,
                    attributes: ['nome', 'lote', 'validade']
                }
            ]
        });
    }

    /**
     * Busca a localização de todos os itens de uma Ordem de Carga
     * Essencial para o guia do Empilhador
     */
    async buscarLocalizacaoItens(ordemCarga) {
        const ordem = await Expedicao.findOne({ where: { ordemCarga } });
        if (!ordem) throw new Error("Ordem de Carga não encontrada.");

        return await Pallet.findAll({
            where: { expedicaoId: ordem.id },
            include: [{
                model: Endereco,
                attributes: ['rua', 'posicao', 'nivel']
            }]
        });
    }

    /**
     * Atualiza status da ordem (ex: de INICIAR para EM PROCESSO)
     * Registra a primeira foto do status do caminhão
     */
    async atualizarStatusOrdem(ordemCarga, dados) {
        const ordem = await Expedicao.findOne({ where: { ordemCarga } });
        if (!ordem) throw new Error("Ordem de Carga não encontrada.");

        return await ordem.update({
            status: dados.status,
            fotoInicio: dados.fotoInicio || ordem.fotoInicio
        });
    }

    /**
     * Finaliza o Carregamento
     * Registra lacre, foto final e encerra a ordem no sistema
     */
    async finalizarCarregamento(ordemCarga, dados) {
        const ordem = await Expedicao.findOne({ where: { ordemCarga } });
        if (!ordem) throw new Error("Ordem de Carga não encontrada.");

        // Aqui você também poderia adicionar uma lógica para "baixar" os pallets do estoque
        return await ordem.update({
            fotoFinal: dados.fotoFinal,
            lacre: dados.lacre,
            status: 'CONCLUIDO'
        });
    }
}

export default new ExpedicaoService();
