import { DataTypes } from 'sequelize';
// Ajuste o caminho para a sua conexão com o banco de dados
import { sequelize } from '../../../config/db.js';

const Pallet = sequelize.define('Pallet', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // RASTREABILIDADE DO PRODUTO (Criado pelo Módulo Recebimento)
    codigo: { // RENOMEADO para 'codigo' (Mais comum que codigoBarras)
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    codigoProduto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lote: { // Crucial para as regras do Drive-In/Armazenagem e rastreio
        type: DataTypes.STRING,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    // VÍNCULOS COM OUTROS MÓDULOS (Chaves Estrangeiras)
    usuarioRecebimentoId: { // NOVO CAMPO: Quem registrou a placa (usado no RecebimentoService)
        type: DataTypes.INTEGER,
        allowNull: true
    },
    usuarioAlocacaoId: { // Quem fez a última movimentação ou alocação (mantido)
        type: DataTypes.INTEGER,
        allowNull: true
    },
    enderecoId: { // Onde o pallet está (Módulo ARMAZENAGEM)
        type: DataTypes.INTEGER,
        allowNull: true // Nulo enquanto estiver no chão de recebimento/expedição
    },
    // STATUS E QUARENTENA
    status: {
        type: DataTypes.ENUM(
            'EM_QUARENTENA',         // NOVO START: No chão, timer de 48h já correndo. (Bloqueia Expedição)
            'DISPONÍVEL',            // CORRIGIDO: Status após a quarentena (usado no ArmazenagemService)
            'BLOQUEADO_QUALIDADE',
            'EM_EXPEDICAO',          // Status quando é movido para a área de expedição/carregamento
            'EXPEDIDO'
        ),
        // O status inicial de todo pallet novo é EM_QUARENTENA (Correto)
        defaultValue: 'EM_QUARENTENA'
    },
    dataQuarentenaFim: { // O momento em que as 48 horas terminam (usado no ExpedicaoService)
        type: DataTypes.DATE,
        allowNull: true
    },
    // O campo 'registroTurnoId' não é mais necessário se usarmos 'usuarioRecebimentoId'
}, {
    tableName: 'pallets',
    timestamps: true
});

export default Pallet;