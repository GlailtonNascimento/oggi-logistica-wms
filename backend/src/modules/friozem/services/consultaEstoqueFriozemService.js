// services/consultaEstoqueFriozemService.js
import EnderecoFriozem from '../models/enderecoFriozemModel.js';

class ConsultaEstoqueFriozemService {

    async consultarPorCodigo(codigoProduto) {
        return await EnderecoFriozem.findAll({
            where: { codigoProduto },
            attributes: [
                'codigoEndereco',
                'quantidadeAtual',
                'capacidade',
                'isAreaRetrabalho'
            ]
        });
    }
}

export default new ConsultaEstoqueFriozemService();
