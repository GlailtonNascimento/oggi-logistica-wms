import { alocacaoService } from '../services/service.js';
import { StatusCodes } from 'http-status-codes';

class AlocacaoController {

    /**
     * POST /api/armazenagem/alocar
     * Vincula um pallet a um endereço pela primeira vez (Bip do coletor).
     */
    alocarPalletNoEndereco = async (req, res) => {
        try {
            const { palletId, enderecoCodigo, usuarioId } = req.body;

            // Chamando o serviço com o novo nome padronizado
            const resultado = await alocacaoService.alocarPallet({
                palletId,
                enderecoCodigo,
                usuarioId
            });

            return res.status(resultado.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST).json(resultado);
        } catch (error) {
            console.error('Erro ao alocar pallet:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno ao processar alocação.'
            });
        }
    }

    /**
     * POST /api/armazenagem/movimentar
     * Troca o pallet de um endereço para outro.
     */
    movimentarPallet = async (req, res) => {
        try {
            const { palletId, enderecoOrigem, enderecoDestino, usuarioId } = req.body;

            const resultado = await alocacaoService.movimentarPallet({
                palletId,
                enderecoOrigem,
                enderecoDestino,
                usuarioId
            });

            return res.status(resultado.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST).json(resultado);
        } catch (error) {
            console.error('Erro ao movimentar pallet:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno ao processar movimentação.'
            });
        }
    }

    /**
     * GET /api/armazenagem/endereco/:codigo
     * Consulta o que existe dentro de um endereço específico.
     */
    buscarEndereco = async (req, res) => {
        try {
            const { codigo } = req.params;

            const resultado = await alocacaoService.buscarEnderecoPorCodigo(codigo);

            return res.status(resultado.success ? StatusCodes.OK : StatusCodes.NOT_FOUND).json(resultado);
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno ao buscar endereço.'
            });
        }
    }
}

// Exporta como uma nova instância do Controller de Alocação
export default new AlocacaoController();