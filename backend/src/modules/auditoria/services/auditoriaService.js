import Pallet from '../../../../models/Pallet.js';
import { AuditoriaQualidade } from '../models/model.js';
import { Op } from 'sequelize';

class AuditoriaService {
    async gerenciarBloqueio(dados) {
        const { codigoProduto, lote, palletIds, tipoAcao, motivo, usuarioId, observacoes } = dados;

        try {
            // Se palletIds existir, bloqueia/libera apenas eles. Se não, o lote todo.
            const filtro = palletIds && palletIds.length > 0
                ? { id: { [Op.in]: palletIds } }
                : { codigoProduto, lote };

            const novoStatus = tipoAcao === 'BLOQUEIO' ? 'BLOQUEADO_QUALIDADE' : 'LIVRE_EXPEDICAO';

            const [linhasAfetadas] = await Pallet.update(
                { status: novoStatus },
                { where: filtro }
            );

            // Registro detalhado na auditoria para o analista
            await AuditoriaQualidade.create({
                codigoProduto,
                lote,
                tipoAcao,
                motivo,
                usuarioId,
                observacoes: palletIds ? `Pallets específicos: ${palletIds.join(', ')}. ${observacoes}` : `Lote Integral. ${observacoes}`
            });

            return {
                success: true,
                message: `${tipoAcao} realizado em ${linhasAfetadas} pallet(s) com sucesso.`
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new AuditoriaService();
