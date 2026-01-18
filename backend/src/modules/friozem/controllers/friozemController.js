import FriozemService from '../services/friozemService.js';

export default {
    /**
     * Endpoint chamado pelo coletor ao bipar um produto na entrada comum.
     * Agora suporta o parâmetro 'motivoAvaria' para acionar a regra de mistura.
     */
    async conferirEntrada(req, res) {
        try {
            const { codigoProduto, ruaLida, motivoAvaria } = req.body;

            if (!codigoProduto || !ruaLida) {
                return res.status(400).json({ error: "Dados insuficientes (Produto e Rua são obrigatórios)." });
            }

            const resultado = await FriozemService.processarEntrada({
                codigoProduto,
                ruaLida,
                motivoAvaria
            });

            return res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro no Controller Friozem (Entrada):", error);
            return res.status(500).json({ error: "Erro ao processar sugestão de endereço." });
        }
    },

    /**
     * Endpoint para o Analista ou Assistente configurar no painel
     * se um endereço (Drive-in) aceita mistura de SKUs (Área de Retrabalho).
     */
    async gerenciarAreaRetrabalho(req, res) {
        try {
            const { enderecoId, permiteMistura } = req.body; // permiteMistura: true/false

            if (enderecoId === undefined || permiteMistura === undefined) {
                return res.status(400).json({ error: "enderecoId e permiteMistura são obrigatórios." });
            }

            const resultado = await FriozemService.configurarRegraEndereco(enderecoId, permiteMistura);

            return res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro no Controller Friozem (Configuração):", error);
            return res.status(500).json({ error: "Erro ao atualizar regra do endereço." });
        }
    }
};