import { DataTypes } from "sequelize";
import { sequelize } from "../../../../config/db.js";
import User from "../../../../models/User.js"; // 🔥 IMPORTA O MODEL USER GLOBAL

const RegistroTurno = sequelize.define('RegistroTurno', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dataLote: {
        type: DataTypes.DATEONLY, // Ex: '2025-12-21'
        allowNull: false
    },
    turno: {
        type: DataTypes.ENUM('1', '2', '3'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('ABERTO', 'FECHADO', 'AUDITADO'), // Status do documento consolidado
        defaultValue: 'ABERTO'
    },
    conferenteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Referencia o nome da tabela do User
            key: 'id'
        }
    },
    observacoesGerais: {
        type: DataTypes.TEXT
    },
    horaInicio: {
        type: DataTypes.TIME
    },
    horaFim: {
        type: DataTypes.TIME
    },
    resumoProducao: { // Opcional: Para armazenar o JSON do resumo ao fechar
        type: DataTypes.JSON
    }
}, {
    tableName: 'registro_turnos',
    timestamps: true
});

// 🔥 ASSOCIAÇÕES
RegistroTurno.belongsTo(User, { foreignKey: 'conferenteId', as: 'conferente' });

export default RegistroTurno;