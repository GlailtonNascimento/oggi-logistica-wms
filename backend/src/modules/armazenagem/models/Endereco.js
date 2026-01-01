// Endereco.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../../../../config/db.js';
import Pallet from '../../../../models/Pallet.js';

const Endereco = sequelize.define('Endereco', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    tipo: {
        // Tipos ajustados: DRIVE-IN, PORTA-PALLET, RECEBIMENTO e EXPEDICAO
        type: DataTypes.ENUM('PORTA-PALLET', 'DRIVE-IN', 'RECEBIMENTO', 'EXPEDICAO'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('LIVRE', 'OCUPADO', 'COMPLETO', 'BLOQUEADO', 'RESERVA'),
        defaultValue: 'LIVRE'
    },
    capacidadePallets: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    area: {
        type: DataTypes.ENUM('CONGELADO'),
        defaultValue: 'CONGELADO',
        allowNull: false
    }
}, {
    tableName: 'enderecos',
    timestamps: true
});

Endereco.hasMany(Pallet, { foreignKey: 'enderecoId', as: 'pallets' });

export default Endereco;