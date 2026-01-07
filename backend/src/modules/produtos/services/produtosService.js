import { Produtos } from '../models/index.js';
import BaseService from './service.js';

class ProdutosServices {

    // =====================================================
    // 🧾 CADASTRO MANUAL
    // =====================================================
    async cadastrar(dados) {
        const { codigoSKU } = dados;

        if (!codigoSKU) {
            throw new Error('Código SKU é obrigatório.');
        }

        return BaseService.findOrCreate(
            Produtos,
            { codigoSKU },
            dados
        );
    }

    // =====================================================
    // 📥 IMPORTAÇÃO EM MASSA (EXCEL / CSV / OCR)
    // =====================================================
    async importarLista(produtos) {
        return BaseService.bulkUpsert(
            Produtos,
            produtos,
            [
                'descricao',
                'quantidadeCaixasPorPallet',
                'categoria',
                'ativo'
            ]
        );
    }

    // =====================================================
    // 🔎 VERIFICAÇÃO SIMPLES (USADO NO RECEBIMENTO)
    // =====================================================
    async verificar(sku) {
        if (!sku) throw new Error('SKU não informado.');
        return BaseService.findByPk(Produtos, sku);
    }

    // =====================================================
    // 🤖 CADASTRO AUTOMÁTICO VIA OCR
    // =====================================================
    async cadastrarViaOCR(dadosOCR) {
        const {
            codigoSKU,
            descricao,
            quantidadeCaixasPorPallet = null,
            categoria = 'OCR'
        } = dadosOCR;

        if (!codigoSKU || !descricao) {
            throw new Error('OCR inválido: códigoSKU e descrição são obrigatórios.');
        }

        const [produto] = await Produtos.findOrCreate({
            where: { codigoSKU },
            defaults: {
                codigoSKU,
                descricao,
                quantidadeCaixasPorPallet, // pode ser null
                categoria,
                ativo: true
            }
        });

        // ✅ Nunca atualiza automaticamente
        return produto;
    }


    // =====================================================
    // 📊 PADRÃO DE PALETIZAÇÃO (FRIOZEM / PLANEJAMENTO)
    // =====================================================
    async obterPadraoPallet(codigoSKU) {
        const produto = await Produtos.findByPk(codigoSKU);
        if (!produto) throw new Error('Produto não encontrado');

        return {
            codigoSKU,
            quantidadeCaixasPorPallet: produto.quantidadeCaixasPorPallet
        };
    }
}

export default new ProdutosServices();


