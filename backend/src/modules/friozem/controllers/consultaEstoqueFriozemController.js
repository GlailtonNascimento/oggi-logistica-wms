// controllers/consultaEstoqueFriozemController.js
import consultaService from '../services/consultaEstoqueFriozemService.js';

class ConsultaEstoqueFriozemController {

    async consultarSaldo(req, res) {
        try {
            const { codigoProduto } = req.query;
            if (!codigoProduto) {
                return res.status(400).json({ error: 'Código do produto é obrigatório' });
            }

            const resultado = await consultaService.consultarPorCodigo(codigoProduto);

            res.status(200).json({
                codigoProduto,
                totalPosicoes: resultado.length,
                posicoes: resultado
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ConsultaEstoqueFriozemController();
