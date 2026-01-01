import { DataTypes } from "sequelize";
import { sequelize } from "../../../../config/db.js";
import User from "../../../../models/User.js";

const RegistroTurno = sequelize.define('RegistroTurno', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dataLote: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    turno: {
        type: DataTypes.ENUM('1', '2', '3'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('ABERTO', 'FECHADO', 'AUDITADO'),
        defaultValue: 'ABERTO'
    },
    conferenteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    // --- CAMPOS DE SUPORTE PARA RASTREAMENTO E COLETORES ---
    unidadeLogistica: { // Opcional: para identificar a planta ou setor
        type: DataTypes.STRING,
        allowNull: true
    },
    totalPalletsRegistrados: { // Contador para facilitar auditoria rápida
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    // --- CAMPOS ORIGINAIS MANTIDOS ---
    observacoesGerais: {
        type: DataTypes.TEXT
    },
    horaInicio: {
        type: DataTypes.TIME
    },
    horaFim: {
        type: DataTypes.TIME
    },
    resumoProducao: { 
        type: DataTypes.JSON
    }
}, {
    tableName: 'registro_turnos',
    timestamps: true
});

// 🔥 ASSOCIAÇÕES (MANTIDAS)
RegistroTurno.belongsTo(User, { foreignKey: 'conferenteId', as: 'conferente' });

export default RegistroTurno;