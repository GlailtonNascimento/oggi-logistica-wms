class OcrService {

    async lerArquivo(arquivo) {
        console.log('📄 Processando OCR do arquivo:', arquivo.originalname);

        // 🔴 MOCK TEMPORÁRIO
        return [
            { codigoProduto: '905', quantidade: 120 },
            { codigoProduto: '910', quantidade: 80 }
        ];
    }
}

export default new OcrService();
