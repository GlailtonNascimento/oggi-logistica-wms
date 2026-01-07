import { Produtos } from '../models/index.js';
import { StatusCodes } from 'http-status-codes';

class ProdutoController {

    // ➕ Cadastrar produto manual
    cadastrar = async (req, res) => {
        try {
            const { codigoSKU, descricao, quantidadeCaixasPorPallet, categoria } = req.body;

            if (!codigoSKU || !descricao || !quantidadeCaixasPorPallet) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Campos obrigatórios: codigoSKU, descricao, quantidadeCaixasPorPallet'
                });
            }

            const existe = await Produtos.findByPk(codigoSKU);

            if (existe) {
                return res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    message: 'Este SKU já está cadastrado. Use a rota de atualização.'
                });
            }

            const produto = await Produtos.create({
                codigoSKU,
                descricao,
                quantidadeCaixasPorPallet,
                categoria
            });

            return res.status(StatusCodes.CREATED).json({
                success: true,
                produto
            });

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: error.message
            });
        }
    };

    // ✏️ Atualizar produto (manual pelo analista)
    atualizar = async (req, res) => {
        try {
            const { sku } = req.params;
            const dados = req.body;

            const produto = await Produtos.findByPk(sku);

            if (!produto) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Produto não encontrado.'
                });
            }

            // ⚠️ Nunca permitir alterar SKU
            delete dados.codigoSKU;

            await produto.update(dados);

            return res.status(StatusCodes.OK).json({
                success: true,
                produto
            });

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: error.message
            });
        }
    };

    // 🔍 Verificar produto
    verificar = async (req, res) => {
        try {
            const { sku } = req.params;

            const produto = await Produtos.findByPk(sku);

            if (!produto) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: 'Produto não cadastrado.'
                });
            }

            return res.status(StatusCodes.OK).json({ success: true, produto });

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: error.message
            });
        }
    };
}

export default new ProdutoController();

