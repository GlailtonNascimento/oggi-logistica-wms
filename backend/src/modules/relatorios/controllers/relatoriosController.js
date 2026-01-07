import RelatoriosService from '../services/relatoriosService.js';

class RelatorioController {

    async dashboard(req, res) {
        try {
            const dados = await RelatoriosService.gerarDashboard();
            return res.json({
                success: true,
                dashboard: dados
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao gerar dashboard',
                error: error.message
            });
        }
    }

}

export default new RelatorioController();
