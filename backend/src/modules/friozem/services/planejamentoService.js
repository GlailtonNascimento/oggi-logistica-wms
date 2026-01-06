import ocrService from './ocrService.js';

class PlanejamentoService {

    async processarArquivo({ arquivo, turno, data }) {

        // 1️⃣ OCR / Leitura
        const itensExtraidos = await ocrService.lerArquivo(arquivo);

        /**
         * Exemplo do retorno do OCR:
         * [
         *   { codigoProduto: '905', quantidade: 120 },
         *   { codigoProduto: '910', quantidade: 80 }
         * ]
         */

        // 2️⃣ Normalização
        const planejamento = itensExtraidos.map(item => ({
            codigoProduto: item.codigoProduto,
            quantidade: item.quantidade,
            turno,
            data,
            origem: 'PLANEJAMENTO_ANALISTA'
        }));

        return planejamento;
    }
}

export default new PlanejamentoService();
