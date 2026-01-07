import BaseService from './service.js';

// MODELS DOS OUTROS MÓDULOS
import Pallet from '../../../models/Pallet.js';
import Endereco from '../../armazenagem/models/Endereco.js';
import Expedicao from '../../expedicao/expedicaoModel.js';

class RelatoriosService {

    async gerarDashboard() {

        // =========================
        // 📦 PALLETS
        // =========================
        const totalPallets = await BaseService.count(Pallet);

        const palletsQuarentena = await BaseService.count(Pallet, {
            status: 'EM_QUARENTENA'
        });

        const palletsDisponiveis = await BaseService.count(Pallet, {
            status: 'DISPONÍVEL'
        });

        const palletsBloqueados = await BaseService.count(Pallet, {
            status: 'BLOQUEADO_QUALIDADE'
        });

        const palletsNoChao = await BaseService.count(Pallet, {
            enderecoId: null
        });

        const palletsArmazenados = await BaseService.count(Pallet, {
            enderecoId: { $ne: null }
        });

        // =========================
        // 🏬 ENDEREÇOS
        // =========================
        const totalEnderecos = await BaseService.count(Endereco);
        const enderecosLivres = await BaseService.count(Endereco, { status: 'LIVRE' });
        const enderecosOcupados = await BaseService.count(Endereco, { status: 'OCUPADO' });

        // =========================
        // 🚚 EXPEDIÇÃO
        // =========================
        const cargasIniciar = await BaseService.count(Expedicao, { status: 'INICIAR' });
        const cargasProcesso = await BaseService.count(Expedicao, { status: 'EM PROCESSO' });
        const cargasFinalizadas = await BaseService.count(Expedicao, { status: 'CONCLUIDO' });

        // =========================
        // 📊 CONSOLIDADO
        // =========================
        return {
            pallets: {
                total: totalPallets,
                quarentena: palletsQuarentena,
                disponiveis: palletsDisponiveis,
                bloqueados: palletsBloqueados,
                noChao: palletsNoChao,
                armazenados: palletsArmazenados
            },
            armazenagem: {
                totalEnderecos,
                livres: enderecosLivres,
                ocupados: enderecosOcupados
            },
            expedicao: {
                iniciar: cargasIniciar,
                emProcesso: cargasProcesso,
                concluido: cargasFinalizadas
            }
        };
    }
}

export default new RelatoriosService();

