import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';

const OrdemMovimentacaoFriozem = sequelize.define(
    'OrdemMovimentacaoFriozem',
    {
        codigoProduto: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // 🔢 PLANEJAMENTO
        quantidadePlanejada: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Quantidade definida pelo planejamento (meta)'
        },

        // 📦 EXECUÇÃO REAL
        quantidadeExecutada: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Quantidade realmente movimentada no físico'
        },

        // 🧠 CONTROLE DE EXCESSO / FRAÇÃO
        quantidadeExcedente: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Excesso gerado caso a execução seja maior que o planejado'
        },

        enderecoOrigem: {
            type: DataTypes.STRING,
            allowNull: false
        },

        enderecoDestino: {
            type: DataTypes.STRING,
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(
                'GERADA',
                'CONFIRMADA',
                'EM_EXECUCAO',
                'CONCLUIDA',
                'CANCELADA'
            ),
            defaultValue: 'GERADA'
        },

        turno: {
            type: DataTypes.ENUM('DIA', 'NOITE'),
            allowNull: false
        },

        prioridade: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },

        // 👥 RASTREABILIDADE HUMANA
        criadoPor: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'SISTEMA | ANALISTA | ASSISTENTE'
        },

        confirmadoPor: {
            type: DataTypes.STRING,
            allowNull: true
        },

        executadoPor: {
            type: DataTypes.STRING,
            allowNull: true
        },

        conferidoPor: {
            type: DataTypes.STRING,
            allowNull: true
        },

        dataConfirmacao: DataTypes.DATE,
        dataInicioExecucao: DataTypes.DATE,
        dataConclusao: DataTypes.DATE
    },
    {
        tableName: 'ordem_movimentacao_friozem',
        timestamps: true
    }
);

export default OrdemMovimentacaoFriozem;



