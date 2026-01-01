import { DataTypes } from "sequelize";
import { sequelize } from "../../../../config/db.js";
import RegistroTurno from "./RegistroTurno.js";
// IMPORTAR MODEL PRODUTO AQUI SE NECESSÁRIO

const PalletRegistro = sequelize.define('PalletRegistro', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
    registroTurnoId: { // Chave estrangeira para o RegistroTurno
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
    tableName: 'pallets_registro_producao', // Tabela dedicada
    timestamps: true
});

// 🔥 ASSOCIAÇÕES
PalletRegistro.belongsTo(RegistroTurno, { foreignKey: 'registroTurnoId', as: 'turno' });
RegistroTurno.hasMany(PalletRegistro, { foreignKey: 'registroTurnoId', as: 'pallets' });

export default PalletRegistro;