// Trecho do RecebimentoService.js

    async processarRecebimento(dados) {
        // Os dados (codigoPallet, lote, codigoProduto) já vêm impressos na placa e lidos pelo OCR
        const { codigoPallet, lote, codigoProduto, quantidade, usuarioRecebimentoId } = dados; 

        try {
            // ... (Verificação de duplicidade e cálculo da Quarentena)

            // CRIAÇÃO DO PALLET: O código do pallet é o que foi lido, não o que foi gerado.
            const novoPallet = await Pallet.create({
                codigo: codigoPallet, // <--- Este é o dado da placa
                lote: lote,           // <--- Este é o dado da placa
                codigoProduto: codigoProduto,
                quantidade: quantidade,
                
                // ... (Status e Quarentena)
            });

            // ...

        } catch (error) { ... }
    }