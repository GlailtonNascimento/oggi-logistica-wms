import { Op } from 'sequelize';
import PalletRegistro from '../models/PalletRegistro.js';
import RegistroTurno from '../models/RegistroTurno.js';
import FotoRegistro from '../models/FotoRegistro.js';

class RegistroTurnoService {

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
                    caixaTotalProduzida: 0
                };
            }
            if (pallet.statusProducao === 'COMPLETO') resumo[codigo].palletsProduzidos++;
            if (pallet.statusProducao === 'FRACAO') resumo[codigo].palletsFracao++;
            if (pallet.statusProducao === 'AMOSTRA') resumo[codigo].palletsAmostra++;
            resumo[codigo].caixaTotalProduzida += parseFloat(pallet.quantidadeReal || 0);
        }
        return resumo;
    }

    async registrarPalletIndividual(dados) {
        try {
            const [registroTurno] = await RegistroTurno.findOrCreate({
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

            // LÓGICA AUTOMÁTICA DE DATAS (SORVETE)
            const dataFab = new Date(dados.dataLote);
            const dataVenc = new Date(dataFab);
            dataVenc.setMonth(dataVenc.getMonth() + 24); // +24 meses

            const dataLib = new Date(dataFab);
            dataLib.setHours(dataLib.getHours() + 48); // +48 horas

            const palletCriado = await PalletRegistro.create({
                ...dados.palletData,
                registroTurnoId: registroTurno.id,
                statusProducao: dados.palletData.statusProducao || 'COMPLETO',
                status: 'EM_QUARENTENA', // Automático
                dataFabricacao: dataFab,
                dataVencimento: dataVenc,
                dataQuarentenaFim: dataLib,
                horaInicioRegistro: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            });

            // Registro de Fotos
            const fotosParaInserir = [];
            if (dados.fotoUrl) {
                fotosParaInserir.push({ urlCaminho: dados.fotoUrl, tipo: 'RECEBIMENTO', palletId: palletCriado.id });
            }
            if (dados.fotos && dados.fotos.length > 0) {
                dados.fotos.forEach(f => {
                    fotosParaInserir.push({ urlCaminho: f.url, tipo: f.tipo || 'DETALHE', palletId: palletCriado.id });
                });
            }
            if (fotosParaInserir.length > 0) await FotoRegistro.bulkCreate(fotosParaInserir);

            return { success: true, message: 'Pallet registrado (Quarentena 48h ativa).', pallet: palletCriado };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    async fecharLoteTurno(registroTurnoId, observacoesFinais) {
        try {
            const registro = await RegistroTurno.findByPk(registroTurnoId, {
                include: [{ model: PalletRegistro, as: 'pallets' }]
            });
            if (!registro || registro.status !== 'ABERTO') return { success: false, error: 'Turno inválido ou fechado.' };

            const resumoPorProduto = this.gerarResumo(registro.pallets);
            await registro.update({
                status: 'FECHADO',
                observacoesGerais: observacoesFinais,
                horaFim: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                resumoProducao: resumoPorProduto,
            });
            return { success: true, message: 'Lote fechado.', documento: registro };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
export default new RegistroTurnoService();