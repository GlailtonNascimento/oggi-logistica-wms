import {
    EnderecoFriozem,
    OrdemMovimentacaoFriozem
} from '../models/model.js';

import { Op } from 'sequelize';

class OrdemMovimentacaoFriozemService {

    /**
     * 📥 1. RECEBER PLANEJAMENTO (Sistema decide)
     * Exemplo:
     * [{ codigoProduto: '905', quantidadePlanejada: 120 }]
     */
    async receberPlanejamento({ planejamento, turno }) {

        const ordensCriadas = [];

        for (const item of planejamento) {
            const { codigoProduto, quantidadePlanejada } = item;

            // 🔎 Saldo atual no picking (nível 01)
            const enderecoPicking = await EnderecoFriozem.findOne({
                where: {
                    codigoProduto,
                    nivel: 1
                }
            });

            const saldoAtual = enderecoPicking?.quantidadeAtual || 0;

            // ✔️ Já atende o planejamento
            if (saldoAtual >= quantidadePlanejada) continue;

            const necessidade = quantidadePlanejada - saldoAtual;

            // 🔍 Origem (nível mais alto primeiro)
            const enderecoOrigem = await EnderecoFriozem.findOne({
                where: {
                    codigoProduto,
                    nivel: { [Op.gt]: 1 },
                    status: { [Op.ne]: 'COMPLETO' }
                },
                order: [['nivel', 'DESC']]
            });

            if (!enderecoOrigem) continue;

            // 📝 Criar Ordem
            const ordem = await OrdemMovimentacaoFriozem.create({
                codigoProduto,
                quantidadePlanejada: necessidade,
                quantidadeExecutada: 0,
                enderecoOrigem: enderecoOrigem.codigo,
                enderecoDestino: enderecoPicking.codigo,
                turno,
                prioridade: 1,
                status: 'PLANEJADA',
                criadoPor: 'SISTEMA'
            });

            ordensCriadas.push(ordem);
        }

        return {
            sucesso: true,
            totalOrdens: ordensCriadas.length,
            ordens: ordensCriadas
        };
    }

    /**
     * 🧠 2. ANALISTA CONFIRMA / AJUSTA
     */
    async confirmarOrdem(ordemId, usuario) {
        const ordem = await OrdemMovimentacaoFriozem.findByPk(ordemId);
        if (!ordem) throw new Error('Ordem não encontrada.');

        await ordem.update({
            status: 'CONFIRMADA',
            confirmadoPor: usuario,
            dataConfirmacao: new Date()
        });

        return ordem;
    }

    /**
     * 👷 3. EMPILHADOR INICIA
     */
    async iniciarExecucao(ordemId, empilhador) {
        const ordem = await OrdemMovimentacaoFriozem.findByPk(ordemId);
        if (!ordem) throw new Error('Ordem não encontrada.');

        await ordem.update({
            status: 'EM_EXECUCAO',
            executadoPor: empilhador,
            dataInicioExecucao: new Date()
        });

        return ordem;
    }

    /**
     * 📦 4. CONFERENTE FINALIZA
     * Pode executar MAIS do que o planejado
     */
    async concluirOrdem(ordemId, { conferente, quantidadeExecutada }) {
        const ordem = await OrdemMovimentacaoFriozem.findByPk(ordemId);
        if (!ordem) throw new Error('Ordem não encontrada.');

        // Atualiza saldo do endereço destino (picking)
        const enderecoDestino = await EnderecoFriozem.findOne({
            where: { codigo: ordem.enderecoDestino }
        });

        if (enderecoDestino) {
            await enderecoDestino.update({
                quantidadeAtual: enderecoDestino.quantidadeAtual + quantidadeExecutada,
                status: 'OCUPADO'
            });
        }

        await ordem.update({
            status: 'CONCLUIDA',
            quantidadeExecutada,
            conferidoPor: conferente,
            dataConclusao: new Date()
        });

        return {
            ordem,
            excesso: quantidadeExecutada - ordem.quantidadePlanejada
        };
    }

    /**
     * 📋 5. LISTAGEM / ANÁLISE FINAL
     */
    async listarOrdens({ turno, status }) {
        return await OrdemMovimentacaoFriozem.findAll({
            where: {
                ...(turno && { turno }),
                ...(status && { status })
            },
            order: [
                ['prioridade', 'ASC'],
                ['createdAt', 'ASC']
            ]
        });
    }
}

export default new OrdemMovimentacaoFriozemService();

