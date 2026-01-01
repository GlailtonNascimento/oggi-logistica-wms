import { DataTypes } from "sequelize";
import { sequelize } from "../../../../config/db.js";
import RegistroTurno from "./RegistroTurno.js";

const PalletRegistro = sequelize.define('PalletRegistro', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // --- CAMPOS PARA O COLETOR E LOGÍSTICA ---
    barcode: {
        type: DataTypes.STRING,
        allowNull: true // Permite nulo se for via OCR manual primeiro
    },
    status: {
        type: DataTypes.ENUM('EM_QUARENTENA', 'DISPONIVEL', 'BLOQUEADO', 'EXPEDIDO'),
        defaultValue: 'EM_QUARENTENA'
    },
    // --- CAMPOS DE CONTROLE DE TEMPO (SORVETE) ---
    dataFabricacao: {
        type: DataTypes.DATE,
        allowNull: true // Será preenchido pelo Service baseado na dataLote
    },
    dataVencimento: {
        type: DataTypes.DATE,
        allowNull: true // Calculado pelo Service (24 meses)
    },
    dataQuarentenaFim: {
        type: DataTypes.DATE,
        allowNull: true // Calculado pelo Service (48 horas)
    },
    // --- SEUS CAMPOS ORIGINAIS MANTIDOS ---
    codigoProduto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantidadeReal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantidadePadrao: {
        type: DataTypes.DECIMAL(10, 2)
    },
    linhaRodando: {
        type: DataTypes.STRING
    },
    observacaoPallet: {
        type: DataTypes.TEXT
    },
    statusProducao: { // COMPLETO / FRACAO / AMOSTRA
        type: DataTypes.ENUM('COMPLETO', 'FRACAO', 'AMOSTRA'),
        allowNull: false
    },
    registroTurnoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'registro_turnos',
            key: 'id'
        }
    },
    horaInicioRegistro: {
        type: DataTypes.TIME
    },
    horaFimRegistro: {
        type: DataTypes.TIME
    }
}, {
    tableName: 'pallets_registro_producao',
    timestamps: true
});

// 🔥 ASSOCIAÇÕES (MANTIDAS)
PalletRegistro.belongsTo(RegistroTurno, { foreignKey: 'registroTurnoId', as: 'turno' });
RegistroTurno.hasMany(PalletRegistro, { foreignKey: 'registroTurnoId', as: 'pallets' });

export default PalletRegistro;