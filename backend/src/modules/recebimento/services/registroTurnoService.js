import { Op } from 'sequelize';
import PalletRegistro from '../models/PalletRegistro.js';
import RegistroTurno from '../models/RegistroTurno.js';
import FotoRegistro from '../models/FotoRegistro.js';

class RegistroTurnoService {

    // Auxiliar para calcular o resumo da produção (para o fechamento do lote)
    gerarResumo(pallets) {
        const resumo = {};
        for (const pallet of pallets) {
            const codigo = pallet.codigoProduto;
            if (!resumo[codigo]) {
                resumo[codigo] = {
                    quantidadePadrao: pallet.quantidadePadrao,
                    palletsProduzidos: 0,
                    palletsFracao: 0,
                    palletsAmostra: 0,
                    caixaTotalProduzida: 0,
                    fotosRegistradas: (pallet.fotos && pallet.fotos.length > 0)
                };
            }

            if (pallet.statusProducao === 'COMPLETO') resumo[codigo].palletsProduzidos++;
            if (pallet.statusProducao === 'FRACAO') resumo[codigo].palletsFracao++;
            if (pallet.statusProducao === 'AMOSTRA') resumo[codigo].palletsAmostra++;

            // Certifique-se de que a soma é numérica
            resumo[codigo].caixaTotalProduzida += parseFloat(pallet.quantidadeReal || 0);
        }
        return resumo;
    }

    /**
     * 1. REGISTRO INDIVIDUAL DE PALLET DURANTE O TURNO
     */
    async registrarPalletIndividual(dados) {
        try {
            // 1. Encontrar ou Criar o RegistroTurno (Lote/Turno) ABERTO
            const [registroTurno, created] = await RegistroTurno.findOrCreate({
                where: {
                    conferenteId: dados.conferenteId,
                    turno: dados.turno,
                    dataLote: dados.dataLote,
                    status: 'ABERTO'
                },
                defaults: {
                    horaInicio: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                }
            });

            // 2. Criar o PalletRegistro
            const palletCriado = await PalletRegistro.create({
                ...dados.palletData,
                registroTurnoId: registroTurno.id,
                statusProducao: dados.palletData.status,
                horaInicioRegistro: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            });

            // 3. Registrar Fotos
            if (dados.fotos && dados.fotos.length > 0) {
                const fotos = dados.fotos.map(foto => ({
                    urlCaminho: foto.url,
                    tipo: foto.tipo,
                    palletId: palletCriado.id
                }));
                await FotoRegistro.bulkCreate(fotos);
            }

            return { success: true, message: 'Pallet registrado individualmente e vinculado ao Lote/Turno.', pallet: palletCriado };

        } catch (error) {
            console.error(error);
            return { success: false, error: error.message || 'Erro ao registrar pallet individualmente.' };
        }
    }

    /**
     * 2. FECHAMENTO DO LOTE/TURNO E GERAÇÃO DO DOCUMENTO CONSOLIDADO
     */
    async fecharLoteTurno(registroTurnoId, observacoesFinais) {
        try {
            const registro = await RegistroTurno.findByPk(registroTurnoId, {
                include: [{
                    model: PalletRegistro,
                    as: 'pallets',
                    include: [{ model: FotoRegistro, as: 'fotos' }]
                }]
            });

            if (!registro || registro.status !== 'ABERTO') {
                return { success: false, error: 'Registro de turno inválido ou já fechado.' };
            }

            // Gera o resumo
            const resumoPorProduto = this.gerarResumo(registro.pallets);

            // Atualiza e fecha o RegistroTurno
            await registro.update({
                status: 'FECHADO',
                observacoesGerais: observacoesFinais,
                horaFim: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                resumoProducao: resumoPorProduto,
            });

            return { success: true, message: 'Lote/Turno fechado e Documento Consolidado gerado!', documento: registro };

        } catch (error) {
            console.error(error);
            return { success: false, error: error.message || 'Erro ao fechar lote/turno.' };
        }
    }
}

export default new RegistroTurnoService();