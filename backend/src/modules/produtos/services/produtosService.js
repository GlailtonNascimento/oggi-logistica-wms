// backend/src/modules/produtos/services/ProdutosServices.js
import { Produtos } from '../models/index.js';
import BaseService from './service.js';

class ProdutosServices {

    // =====================================================
    // 🧾 CADASTRO MANUAL (JÁ EXISTIA – MANTIDO)
    // =====================================================
    async cadastrar(dados) {
        const { codigoSKU } = dados;

        return BaseService.findOrCreate(
            Produtos,
            { codigoSKU },
            dados
        );
    }

    // =====================================================
    // 📥 IMPORTAÇÃO EM MASSA (EXCEL / CSV) – MANTIDO
    // =====================================================
    async importarLista(produtos) {
        return BaseService.bulkUpsert(
            Produtos,
            produtos,
            [
                'descricao',
                'quantidadePadraoPallet',
                'categoria',
                'ativo'
            ]
        );
    }

    // =====================================================
    // 🔎 VERIFICAÇÃO SIMPLES (USADO NO RECEBIMENTO)
    // =====================================================
    async verificar(sku) {
        return BaseService.findByPk(Produtos, sku);
    }

    // =====================================================
    // 🤖 CADASTRO AUTOMÁTICO VIA OCR (NOVO)
    // =====================================================
    async cadastrarViaOCR(dadosOCR) {
        const {
            codigoSKU,
            descricao,
            quantidadePadraoPallet = 80,
            pesoCaixaKg = null,
            categoria = 'IMPORTADO_OCR'
        } = dadosOCR;

        const [produto, criado] = await Produtos.findOrCreate({
            where: { codigoSKU },
            defaults: {
                codigoSKU,
                descricao,
                quantidadePadraoPallet,
                pesoCaixaKg,
                categoria,
                ativo: true
            }
        });

        // 🔁 Se já existia, mas veio info nova → atualiza
        if (!criado) {
            await produto.update({
                descricao: produto.descricao || descricao,
                quantidadePadraoPallet: produto.quantidadePadraoPallet || quantidadePadraoPallet,
                pesoCaixaKg: produto.pesoCaixaKg || pesoCaixaKg
            });
        }

        return produto;
    }

    // =====================================================
    // 📊 USADO PELO FRIOZEM / PLANEJAMENTO
    // =====================================================
    async obterPadraoPallet(codigoSKU) {
        const produto = await Produtos.findByPk(codigoSKU);
        if (!produto) throw new Error('Produto não encontrado');

        return {
            codigoSKU,
            quantidadePadraoPallet: produto.quantidadePadraoPallet,
            pesoCaixaKg: produto.pesoCaixaKg
        };
    }
}

export default new ProdutosServices();

