import RegistroTurnoService from '../services/registroTurnoService.js';
import { StatusCodes } from 'http-status-codes';

class RegistroTurnoController {

    // Rota: POST /api/recebimento/registro/pallet
    async registrarNovoPallet(req, res) {
        try {
            // O corpo da requisição deve conter conferenteId, turno, dataLote, palletData, fotos, etc.
            const resultado = await RegistroTurnoService.registrarPalletIndividual(req.body);

            if (resultado.success) {
                res.status(StatusCodes.CREATED).json(resultado);
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(resultado);
            }
        } catch (error) {
            console.error('Erro ao registrar pallet:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Erro interno ao registrar pallet.' });
        }
    }

    // Rota: POST /api/recebimento/registro/fechar/:registroTurnoId
    async fecharLote(req, res) {
        try {
            const { registroTurnoId } = req.params;
            const { observacoesFinais } = req.body;

            const resultado = await RegistroTurnoService.fecharLoteTurno(registroTurnoId, observacoesFinais);

            if (resultado.success) {
                res.status(StatusCodes.OK).json(resultado);
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(resultado);
            }
        } catch (error) {
            console.error('Erro ao fechar lote/turno:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Erro interno ao fechar lote/turno.' });
        }
    }
}

export default new RegistroTurnoController();