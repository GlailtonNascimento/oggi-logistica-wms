import recebimentoService from '../services/recebimentoService.js';
import { StatusCodes } from 'http-status-codes';

class RecebimentoController {

    /**
     * Rota: POST /api/recebimento
     * Utilizado para entradas de produção (Coletor ou OCR) ou transferências
     */
    async criarRecebimento(req, res) {
        try {
            // Desestruturação incluindo observacoes para o histórico de auditoria
            const { tipoEntrada, pallets, usuarioId, observacoes } = req.body;

            // Validação técnica: impede o processamento de listas vazias
            if (!pallets || !Array.isArray(pallets) || pallets.length === 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: 'Nenhum pallet informado para o recebimento.'
                });
            }

            // Envia para o Service que aplicará as travas de maturação e validade
            const resultado = await recebimentoService.processarRecebimento({
                tipoEntrada: tipoEntrada || 'PRODUCAO_INTERNA',
                pallets, // Contém barcode/OCR e dados do produto
                usuarioId,
                observacoes
            });

            if (resultado.success) {
                res.status(StatusCodes.CREATED).json(resultado);
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(resultado);
            }
        } catch (error) {
            console.error('Erro ao criar recebimento:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro interno no processamento de recebimento.'
            });
        }
    }

    /**
     * Rota: GET /api/recebimento
     * Lista o histórico de recebimentos para consulta do Analista
     */
    async listarRecebimentos(req, res) {
        try {
            // Filtros dinâmicos via query string
            const resultado = await recebimentoService.listarRecebimentos(req.query);

            res.status(StatusCodes.OK).json(resultado);
        } catch (error) {
            console.error('Erro ao listar recebimentos:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Erro ao carregar lista de recebimentos.'
            });
        }
    }
}

export default new RecebimentoController();