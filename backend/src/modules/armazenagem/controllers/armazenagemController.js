import armazenagemService from '../services/armazenagemService.js';
import { StatusCodes } from 'http-status-codes'; // Assume-se que você usa este pacote para clareza

class ArmazenagemController {

    // POST /api/armazenagem/movimentacao
    async movimentarPallet(req, res) {
        try {
            const { palletId, enderecoOrigem, enderecoDestino, usuarioId } = req.body;

            const resultado = await armazenagemService.movimentarPallet({
                palletId,
                enderecoOrigem,
                enderecoDestino,
                usuarioId
            });

            if (resultado.success) {
                res.status(StatusCodes.OK).json(resultado);
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(resultado);
            }
        } catch (error) {
            console.error('Erro ao movimentar pallet:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno ao processar movimentação.'
            });
        }
    }

    // GET /api/armazenagem/endereco/:codigo
    async buscarEndereco(req, res) {
        try {
            const { codigo } = req.params;

            const resultado = await armazenagemService.buscarEnderecoPorCodigo(codigo);

            if (resultado.success) {
                res.status(StatusCodes.OK).json(resultado);
            } else {
                res.status(StatusCodes.NOT_FOUND).json(resultado);
            }
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno ao buscar endereço.'
            });
        }
    }

    // Outros métodos como alocarAutomaticamente, listarInventario, etc.
}

export default new ArmazenagemController();