import AuditoriaBloqueio from '../models/AuditoriaBloqueio.js';
import EnderecoFriozem from '../../friozem/models/friozemModel.js';
import Pallet from '../../armazenagem/models/Pallet.js';
import { Op } from 'sequelize';

class AuditoriaService {

    // =====================================================
    // 📦 1. CONFERÊNCIA DE ENDEREÇO (CONFERENTE)
    // =====================================================
    async conferirEndereco(codigoEndereco) {

        const endereco = await EnderecoFriozem.findOne({
            where: { codigo: codigoEndereco },
            include: [{ model: Pallet }]
        });

        if (!endereco) {
            throw new Error('Endereço não encontrado.');
        }

        const divergencias = [];

        for (const pallet of endereco.Pallets) {
            if (pallet.quantidade !== endereco.quantidadeAtual) {
                divergencias.push({
                    palletId: pallet.id,
                    produto: pallet.codigoProduto,
                    quantidadeSistema: endereco.quantidadeAtual,
                    quantidadeFisica: pallet.quantidade,
                    endereco: codigoEndereco
                });
            }
        }

        return {
            sucesso: true,
            endereco: codigoEndereco,
            divergencias
        };
    }

    // =====================================================
    // 📊 2. LISTAR DIVERGÊNCIAS (BASE AUDITORIA)
    // =====================================================
    async listarDivergencias() {
        // Base para inventário cíclico / geral
        return [];
    }

    // =====================================================
    // 🏭 3. MATURAÇÃO AUTOMÁTICA (APENAS FÁBRICA)
    // =====================================================
    async criarMaturacaoAutomatica({ palletId, horas = 48 }) {

        const dataFim = new Date();
        dataFim.setHours(dataFim.getHours() + horas);

        return await AuditoriaBloqueio.create({
            palletId,
            localOperacao: 'FABRICA',
            moduloOrigem: 'RECEBIMENTO',
            tipoBloqueio: 'MATURACAO_AUTOMATICA',
            status: 'ATIVO',
            dataFimPrevista: dataFim,
            criadoPor: 'SISTEMA',
            motivo: 'Maturação automática de fábrica'
        });
    }

    // =====================================================
    // 🔒 4. BLOQUEIO MANUAL (QUALIDADE / AVARIA / AMOSTRA)
    // =====================================================
    async bloquearManual({
        palletId,
        localOperacao = 'FABRICA',
        moduloOrigem,
        tipoBloqueio,
        usuario,
        motivo,
        observacoes
    }) {

        // 🚨 Fora da fábrica só é permitido como ALERTA
        if (localOperacao !== 'FABRICA') {
            observacoes = `[ALERTA] Pallet chegou bloqueado fora da fábrica. ${observacoes || ''}`;
        }

        return await AuditoriaBloqueio.create({
            palletId,
            localOperacao,
            moduloOrigem,
            tipoBloqueio,
            status: 'ATIVO',
            criadoPor: usuario,
            motivo,
            observacoes
        });
    }

    // =====================================================
    // 🔓 5. LIBERAÇÃO MANUAL (ANALISTA / QUALIDADE)
    // =====================================================
    async liberarBloqueio({
        bloqueioId,
        usuario,
        documentoLiberacao,
        observacoes
    }) {
        const bloqueio = await AuditoriaBloqueio.findByPk(bloqueioId);

        if (!bloqueio) {
            throw new Error('Bloqueio não encontrado.');
        }

        await bloqueio.update({
            status: 'LIBERADO',
            liberadoPor: usuario,
            documentoLiberacao,
            dataLiberacao: new Date(),
            observacoes
        });

        return bloqueio;
    }

    // =====================================================
    // ⏱️ 6. LIBERAÇÃO AUTOMÁTICA DE MATURAÇÃO (CRON)
    // =====================================================
    async liberarMaturacaoAutomatica() {

        const agora = new Date();

        const bloqueios = await AuditoriaBloqueio.findAll({
            where: {
                tipoBloqueio: 'MATURACAO_AUTOMATICA',
                status: 'ATIVO',
                dataFimPrevista: { [Op.lte]: agora }
            }
        });

        for (const bloqueio of bloqueios) {
            await bloqueio.update({
                status: 'LIBERADO',
                liberadoPor: 'SISTEMA',
                dataLiberacao: agora
            });
        }

        return { totalLiberados: bloqueios.length };
    }

    // =====================================================
    // 🚫 7. VALIDAÇÃO DE MOVIMENTAÇÃO (REGRA GLOBAL)
    // =====================================================
    async validarMovimentacao(palletId, localOperacao) {

        const bloqueioAtivo = await AuditoriaBloqueio.findOne({
            where: {
                palletId,
                status: 'ATIVO'
            }
        });

        // ✅ Nenhum bloqueio
        if (!bloqueioAtivo) {
            return { permitido: true };
        }

        // 🏭 FÁBRICA → bloqueio rígido
        if (localOperacao === 'FABRICA') {
            return {
                permitido: false,
                tipoBloqueio: bloqueioAtivo.tipoBloqueio,
                motivo: bloqueioAtivo.motivo
            };
        }

        // 🚚 FILIAL / FRIOZEM / EXPEDIÇÃO
        return {
            permitido: false,
            alerta: true,
            mensagem: 'Pallet chegou bloqueado da fábrica. Liberação do analista obrigatória.',
            tipoBloqueio: bloqueioAtivo.tipoBloqueio,
            motivo: bloqueioAtivo.motivo
        };
    }
}

export default new AuditoriaService();

