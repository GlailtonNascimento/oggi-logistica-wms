import RegistroTurnoService from '../services/registroTurnoService.js';
import { StatusCodes } from 'http-status-codes';

class RegistroTurnoController {

    /**
     * Rota: POST /api/recebimento/registro/pallet
     * Suporta Coletor (Barcode Code 128) e Celular (Foto/OCR opcional no recebimento)
     */
    async registrarNovoPallet(req, res) {
        try {
            // Extraímos os dados, garantindo que barcode (coletor) ou fotoUrl possam existir
            const {
                conferenteId,
                turno,
                dataLote,
                palletData, // Aqui deve conter barcode, codigoProduto, quantidade, etc.
                fotoUrl     // Caminho da imagem capturada para rastreio
            } = req.body;

            // Validação simples de segurança
            if (!conferenteId || !dataLote || (!palletData?.barcode && !fotoUrl)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: 'Dados insuficientes. É necessário o código do coletor (barcode) ou a foto do pallet.'
                });
            }

            // O Service agora processará o pallet com as regras de 48h e 24 meses
            const resultado = await RegistroTurnoService.registrarPalletIndividual({
                conferenteId,
                turno,
                dataLote,
                palletData,
                fotoUrl, // Armazena a imagem para o rastreio que você solicitou
                origem: fotoUrl ? 'CELULAR_OCR' : 'COLETOR_BARCODE' // Identifica a origem da entrada
            });

            if (resultado.success) {
                res.status(StatusCodes.CREATED).json(resultado);
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(resultado);
            }
        } catch (error) {
            console.error('Erro ao registrar pallet no recebimento:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno ao registrar pallet.'
            });
        }
    }

    /**
     * Rota: POST /api/recebimento/registro/fechar/:registroTurnoId
     * Finaliza o lote do turno para auditoria.
     */
    async fecharLote(req, res) {
        try {
            const { registroTurnoId } = req.params;
            const { observacoesFinais } = req.body;

            if (!registroTurnoId) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: 'ID do registro de turno é obrigatório.'
                });
            }

            const resultado = await RegistroTurnoService.fecharLoteTurno(registroTurnoId, observacoesFinais);

            if (resultado.success) {
                res.status(StatusCodes.OK).json(resultado);
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(resultado);
            }
        } catch (error) {
            console.error('Erro ao fechar lote/turno:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno ao fechar lote/turno.'
            });
        }
    }
}

export default new RegistroTurnoController();