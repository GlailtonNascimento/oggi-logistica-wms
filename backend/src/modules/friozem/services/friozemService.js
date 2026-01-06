import { EnderecoFriozem, OrdemMovimentacaoFriozem } from '../model.js';
import Pallet from '../../../models/Pallet.js';
import { Op } from 'sequelize';

class FriozemService {

    /**
     * ================================
     * 1️⃣ ENTRADA / ENDEREÇAMENTO
     * ================================
     */
    async processarEntrada(dados) {
        const { codigoProduto, ruaLida, motivoAvaria } = dados;

        // 1. AVARIA (mistura permitida)
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
                    endereco: sugestaoAvaria.codigo,
                    mensagem: '🚨 Destinar ao Drive-in de Retrabalho',
                    cor: 'laranja'
                };
            }
        }

        // 2. CROSS DOCK / PICKING
        const listaPrioritaria = ['905', '910'];
        if (listaPrioritaria.includes(codigoProduto)) {
            return {
                acao: 'PICKING',
                endereco: `${ruaLida}-01-01`,
                mensagem: '🚀 Enviar direto para Separação',
                cor: 'azul'
            };
        }

        // 3. DRIVE-IN OCUPADO (mesmo SKU)
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

        // 4. DRIVE-IN LIVRE
        if (!sugestao) {
            sugestao = await EnderecoFriozem.findOne({
                where: {
                    rua: ruaLida,
                    tipo: 'DRIVE-IN',
                    status: 'LIVRE'
                }
            });
        }

        // 5. PORTA-PALLET
        if (!sugestao) {
            sugestao = await EnderecoFriozem.findOne({
                where: {
                    rua: ruaLida,
                    tipo: 'PORTA-PALLET',
                    status: 'LIVRE'
                }
            });
        }

        return {
            acao: 'ARMAZENAR',
            endereco: sugestao ? sugestao.codigo : 'INDISPONIVEL',
            mensagem: sugestao ? `Sugerido: ${sugestao.codigo}` : '❌ Sem vaga na rua',
            cor: sugestao ? 'verde' : 'vermelho'
        };
    }

    /**
     * ================================
     * 2️⃣ GERAR ORDEM AUTOMÁTICA
     * ================================
     * Usado após OCR / Planejamento
     */
    async gerarOrdensMovimentacaoAutomaticas(listaPlanejamento, turno) {
        const ordensCriadas = [];

        for (const item of listaPlanejamento) {
            const { codigoProduto, quantidadeNecessaria, origem, destino } = item;

            const ordem = await OrdemMovimentacaoFriozem.create({
                codigoProduto,
                enderecoOrigem: origem,
                enderecoDestino: destino,
                quantidade: quantidadeNecessaria,
                turno,
                prioridade: 1,
                status: 'SUGERIDA',
                criadoPor: 'SISTEMA'
            });

            ordensCriadas.push(ordem);
        }

        return {
            sucesso: true,
            total: ordensCriadas.length,
            ordens: ordensCriadas
        };
    }

/**
 * ===*

