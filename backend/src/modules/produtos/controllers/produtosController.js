import Produto from '../models/Produtos.js';
import { StatusCodes } from 'http-status-codes';

class ProdutoController {
    // Transformamos em Arrow Function ( => ) para não perder o contexto
    cadastrar = async (req, res) => {
        try {
            const { codigoSKU, descricao, quantidadePadraoPallet } = req.body;
            const [produto, created] = await Produto.findOrCreate({
                where: { codigoSKU },
                defaults: { descricao, quantidadePadraoPallet }
            });

            if (!created) {
                return res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    message: 'Este código SKU já existe no sistema.'
                });
            }
            return res.status(StatusCodes.CREATED).json({ success: true, produto });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }

    importarLista = async (req, res) => {
        try {
            const { produtos } = req.body;
            if (!Array.isArray(produtos) || produtos.length === 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false, message: 'Formato de lista inválido.'
                });
            }
            const resultados = await Produto.bulkCreate(produtos, {
                updateOnDuplicate: ['descricao', 'quantidadePadraoPallet']
            });
            return res.status(StatusCodes.OK).json({ success: true, message: 'Produtos importados!' });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }

    verificar = async (req, res) => {
        try {
            const { sku } = req.params;
            const produto = await Produto.findByPk(sku);
            if (!produto) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false, message: 'Produto não cadastrado.'
                });
            }
            return res.status(StatusCodes.OK).json({ success: true, produto });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }
}

export default new ProdutoController();