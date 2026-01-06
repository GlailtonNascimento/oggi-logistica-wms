import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const EnderecoFriozem = sequelize.define("EnderecoFriozem", {
    codigo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    rua: {
        type: DataTypes.STRING,
        allowNull: false
    },
    posicao: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nivel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('PORTA-PALLET', 'DRIVE-IN'),
        defaultValue: 'PORTA-PALLET'
    },
    capacidade: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    status: {
        type: DataTypes.ENUM('LIVRE', 'OCUPADO', 'COMPLETO'),
        defaultValue: 'LIVRE'
    },
    isAreaRetrabalho: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "enderecos_friozem",
    timestamps: true
});

export default EnderecoFriozem;
