import { DataTypes } from 'sequelize';
import { sequelize } from '../../../../config/db.js';
import User from "../../../../models/User.js";

const Recebimento = sequelize.define('Recebimento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipoEntrada: {
        // Expandido para alinhar com as novas origens (Produção Interna/Externa)
        type: DataTypes.ENUM('PRODUCAO', 'TRANSFERENCIA', 'COMPRA', 'RETORNO'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDENTE', 'CONCLUIDO', 'CANCELADO'),
        defaultValue: 'PENDENTE'
    },
    // --- CAMPO PARA RASTREABILIDADE ---
    origemRegistro: {
        type: DataTypes.STRING,
        defaultValue: 'MANUAL', // Ex: 'COLETOR', 'APP_OCR', 'SISTEMA'
        allowNull: true
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    dataHora: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    observacoes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'recebimentos',
    timestamps: true
});

// 🔥 ASSOCIAÇÕES
Recebimento.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

export default Recebimento;