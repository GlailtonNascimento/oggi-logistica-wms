import SeparacaoService from './services/separacaoService.js';

/**
 * Controller responsável pela logística de saída (Frente Dia e Frente Noite)
 * Gerencia o fluxo de cores: Vermelho -> Laranja -> Verde -> Cinza
 */
class SeparacaoController {

    /**
     * [FRENTE DIA] - Auditoria de Abastecimento
     * O pessoal do dia consulta para saber se o Nível 01 tem o planejado para a noite.
     */
    async checkAbastecimento(req, res) {
        try {
            // Retorna a lista de produtos que precisam ser descidos para o picking
            const relatorio = await SeparacaoService.auditoriaAbastecimentoDia();
            return res.status(200).json(relatorio);
        } catch (error) {
            console.error("Erro na auditoria do dia:", error);
            return res.status(500).json({ error: "Erro ao processar auditoria de abastecimento." });
        }
    }

    /**
     * [FRENTE NOITE] - Listar Romaneios (O Farol)
     * Mostra os romaneios e suas cores para o Líder e Separadores
     */
    async listarPainelSeparacao(req, res) {
        try {
            const painel = await SeparacaoService.obterPainelStatus();
            return res.status(200).json(painel);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar painel de separação." });
        }
    }

    /**
     * [FRENTE NOITE] - Registrar Início de Separação
     * Quando o separador clica no romaneio indicado pelo Líder (🔴 -> 🟠)
     */
    async iniciarRota(req, res) {
        try {
            const { romaneioId, usuarioId } = req.body;
            const resultado = await SeparacaoService.iniciarSeparacao(romaneioId, usuarioId);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao iniciar rota de separação." });
        }
    }

    /**
     * [FRENTE NOITE] - Bipe de Item
     * Registra a caixa separada e verifica se o picking acabou (Notifica Empilhador se necessário)
     */
    async registrarBipe(req, res) {
        try {
            const { romaneioId, codigoProduto, quantidade } = req.body;

            if (!romaneioId || !codigoProduto) {
                return res.status(400).json({ error: "Dados incompletos para separação." });
            }

            const resultado = await SeparacaoService.processarBipe({
                romaneioId,
                codigoProduto,
                quantidade
            });

            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao registrar bipe de separação." });
        }
    }

    /**
     * [FRENTE NOITE] - Finalizar Carga (🟢 -> ⚫)
     * Chamado pelo conferente após carregar o caminhão.
     */
    async finalizarCarregamento(req, res) {
        try {
            const { romaneioId } = req.body;
            const resultado = await SeparacaoService.encerrarRomaneio(romaneioId);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao finalizar carga do romaneio." });
        }
    }
}

export default new SeparacaoController();