
// backend/src/modules/produtos/services/ProdutosServices.js
import { Produtos } from '../models/index.js';
import BaseService from './service.js';

class ProdutosServices {

    async cadastrar(dados) {
        const { codigoSKU } = dados;

        return BaseService.findOrCreate(
            Produtos,
            { codigoSKU },
            dados
        );
    }

    async importarLista(produtos) {
        return BaseService.bulkUpsert(
            Produtos,
            produtos,
            ['descricao', 'quantidadePadraoPallet']
        );
    }

    async verificar(sku) {
        return BaseService.findByPk(Produtos, sku);
    }
}

export default new ProdutosServices();
