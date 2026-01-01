import { DataTypes } from 'sequelize';
import { sequelize } from '../../../../config/db.js';
// Importe o Pallet Model global se ele for usado para associações 
// (Ex: Um Recebimento tem muitos Pallets)

const Recebimento = sequelize.define('Recebimento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipoEntrada: {
        type: DataTypes.ENUM('PRODUCAO', 'TRANSFERENCIA', 'COMPRA'), // Tipos de entrada
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDENTE', 'CONCLUIDO', 'CANCELADO'),
        defaultValue: 'PENDENTE'
    },
    usuarioId: { // Quem registrou este documento de Recebimento
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dataHora: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    observacoes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'recebimentos', // Tabela principal para os documentos de entrada
    timestamps: true
});

// As associações com Pallet e Usuário devem ser definidas aqui se necessário.

export default Recebimento;