import expedicaoService from '../services/expedicaoService.js';

class ExpedicaoController {
    /**
     * Consulta Global para o Conferente
     * Busca pallets por código e diz se está no estoque (rua/nível) ou no chão
     */
    async consultarLocalizacaoPallet(req, res) {
        try {
            const { codigo } = req.query;
            if (!codigo) {
                return res.status(400).json({ error: "Código do pallet é obrigatório." });
            }

            const resultados = await expedicaoService.consultarEstoqueGeral({ numero: codigo });

            const formatado = resultados.map(p => ({
                pallet: p.numero,
                produto: p.Produto?.nome || 'Não identificado',
                lote: p.Produto?.lote || 'N/A',
                status: p.Endereco ? 'ARMAZENADO' : 'NO CHÃO / DOCA',
                local: p.Endereco
                    ? `Rua ${p.Endereco.rua}, Pos. ${p.Endereco.posicao}, Nív. ${p.Endereco.nivel}`
                    : 'Área de Recebimento (Chão)'
            }));

            res.status(200).json(formatado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Inicia a Ordem de Carregamento
     * Muda o status da OC para 'EM PROCESSO' e registra o início
     */
    async iniciarCarregamento(req, res) {
        try {
            const { ordemCarga, fotoInicio } = req.body; // Recebe a foto do caminhão vazio
            const ordem = await expedicaoService.atualizarStatusOrdem(ordemCarga, {
                status: 'EM PROCESSO',
                fotoInicio: fotoInicio
            });

            res.status(200).json({
                message: "Carregamento Iniciado. Status: EM PROCESSO",
                ordem
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Guia do Empilhador
     * Retorna a lista de onde buscar cada pallet da ordem (Rua/Nível)
     */
    async obterGuiaEmpilhador(req, res) {
        try {
            const { ordemCarga } = req.params;
            const locais = await expedicaoService.buscarLocalizacaoItens(ordemCarga);

            res.status(200).json({
                ordem: ordemCarga,
                totalItens: locais.length,
                itens: locais
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Finaliza o Carregamento
     * Recebe as fotos finais do lacre e fecha a ordem
     */
    async finalizarCarregamento(req, res) {
        try {
            const { ordemCarga, fotoFinal, lacre } = req.body;
            const resultado = await expedicaoService.finalizarCarregamento(ordemCarga, {
                fotoFinal,
                lacre,
                status: 'CONCLUIDO'
            });

            res.status(200).json({ message: "Ordem Concluída com Sucesso!", resultado });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ExpedicaoController();