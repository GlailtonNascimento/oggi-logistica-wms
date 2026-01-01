import recebimentoService from '../services/recebimentoService.js'; // Assumindo que este é o seu service antigo
import { StatusCodes } from 'http-status-codes'; // Se você estiver usando o pacote http-status-codes

class RecebimentoController {

    // Rota: POST /api/recebimento
    async criarRecebimento(req, res) {
        try {
            const { tipoEntrada, pallets, usuarioId } = req.body;

            const resultado = await recebimentoService.processarRecebimento({
                tipoEntrada,
                pallets,
                usuarioId
            });

            if (resultado.success) {
                // Retorna 201 Created
                res.status(StatusCodes.CREATED).json(resultado);
            } else {
                // Retorna 400 Bad Request
                res.status(StatusCodes.BAD_REQUEST).json(resultado);
            }
        } catch (error) {
            console.error('Erro ao criar recebimento:', error);
            // Retorna 500 Internal Server Error
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno no processamento de recebimento.'
            });
        }
    }

    // Rota: GET /api/recebimento
    async listarRecebimentos(req, res) {
        try {
            const resultado = await recebimentoService.listarRecebimentos(req.query);

            res.status(StatusCodes.OK).json(resultado);
        } catch (error) {
            console.error('Erro ao listar recebimentos:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: error.message
            });
        }
    }

    // Outros métodos como getRecebimentoById, cancelarRecebimento, etc.
}

export default new RecebimentoController();