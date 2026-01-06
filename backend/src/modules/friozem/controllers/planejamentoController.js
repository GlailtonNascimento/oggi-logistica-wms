import planejamentoService from '../services/planejamentoService.js';

class PlanejamentoController {
    async uploadPlanejamento(req, res) {
        try {
            const { turno, data } = req.body;
            const arquivo = req.file;

            if (!arquivo) {
                return res.status(400).json({ erro: 'Arquivo não enviado' });
            }

            const resultado = await planejamentoService.processarArquivo({
                arquivo,
                turno,
                data
            });

            return res.json({
                sucesso: true,
                planejamento: resultado
            });

        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }
}

export default new PlanejamentoController();
