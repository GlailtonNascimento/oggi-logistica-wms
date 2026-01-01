import { EnderecoFriozem } from '../model.js';
import Pallet from '../../../models/Pallet.js';
import { Op } from 'sequelize';

class FriozemService {
    /**
     * Lógica principal de decisão para o Coletor/Celular
     * Gerencia: Picking, Armazenagem Comum e Avaria no Estoque
     */
    async processarEntrada(dados) {
        const { codigoProduto, ruaLida, motivoAvaria } = dados;

        // 1. REGRA DE AVARIA NO ESTOQUE (MISTURA PERMITIDA)
        if (motivoAvaria) {
            const sugestaoAvaria = await EnderecoFriozem.findOne({
                where: {
                    rua: ruaLida,
                    tipo: 'DRIVE-IN',
                    status: { [Op.ne]: 'COMPLETO' },
                    isAreaRetrabalho: true
                }
            });

            if (sugestaoAvaria) {
                return {
                    acao: 'AVARIA_ESTOQUE',
                    statusPallet: 'avaria_no_estoque',
                    endereco: sugestaoAvaria.codigo,
                    mensagem: '🚨 MISTURA PERMITIDA: Destinar ao Drive-in de Retrabalho.',
                    cor: 'laranja'
                };
            }
        }

        // 2. REGRA DE OURO: CROSS-DOCKING / PICKING (Posição 01)
        const listaNecessidade = ['905', '910'];
        if (listaNecessidade.includes(codigoProduto)) {
            return {
                acao: 'PICKING',
                endereco: `${ruaLida}-01-01`,
                mensagem: '🚀 PRIORIDADE: Enviar direto para SEPARAÇÃO (Posição 01).',
                cor: 'azul'
            };
        }

        // 3. BUSCA NO DRIVE-IN (Mesmo produto e OCUPADO)
        let sugestao = await EnderecoFriozem.findOne({
            where: {
                rua: ruaLida,
                tipo: 'DRIVE-IN',
                status: 'OCUPADO',
                isAreaRetrabalho: false
            },
            include: [{
                model: Pallet,
                where: { codigoProduto }
            }]
        });

        // 4. BUSCA NO DRIVE-IN (LIVRE)
        if (!sugestao) {
            sugestao = await EnderecoFriozem.findOne({
                where: {
                    rua: ruaLida,
                    tipo: 'DRIVE-IN',
                    status: 'LIVRE',
                    isAreaRetrabalho: false
                }
            });
        }

        // 5. BUSCA EM PORTA-PALLET (LIVRE)
        if (!sugestao) {
            sugestao = await EnderecoFriozem.findOne({
                where: { rua: ruaLida, tipo: 'PORTA-PALLET', status: 'LIVRE' }
            });
        }

        return {
            acao: 'ARMAZENAR',
            endereco: sugestao ? sugestao.codigo : 'INDISPONÍVEL',
            mensagem: sugestao ? `Sugerido: ${sugestao.codigo}` : '❌ Nenhuma vaga livre nesta rua.',
            cor: sugestao ? 'verde' : 'vermelho'
        };
    }

    /**
     * Função Administrativa: O Analista define se o endereço aceita mistura
     */
    async configurarRegraEndereco(enderecoId, permiteMistura) {
        const endereco = await EnderecoFriozem.findByPk(enderecoId);
        if (!endereco) throw new Error("Endereço não encontrado.");

        await endereco.update({ isAreaRetrabalho: permiteMistura });

        return {
            sucesso: true,
            mensagem: `Endereço ${endereco.codigo} atualizado: Aceita mistura = ${permiteMistura}`
        };
    }
}

export default new FriozemService();