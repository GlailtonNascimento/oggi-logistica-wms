import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const EnderecoFriozem = sequelize.define("EnderecoFriozem", {
    codigo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }, // Ex: A-06-05
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
    }, // Porta-pallet = 1, Drive-in = 3
    status: {
        type: DataTypes.ENUM('LIVRE', 'OCUPADO', 'COMPLETO'),
        defaultValue: 'LIVRE'
    },
    // Define se este endereço é o "Hospital" onde pode misturar SKUs diferentes
    isAreaRetrabalho: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    // --- NOVAS ADIÇÕES PARA CONTROLE DE SEPARAÇÃO E SALDO ---

    codigoProduto: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Vincula qual produto está ocupando este endereço atualmente"
    },
    quantidadeAtual: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "Quantidade física de caixas no endereço (Saldo Real)"
    },
    reservaMinima: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "Meta definida pelo Analista para a Separação da Noite (Planejamento)"
    }
}, {
    tableName: "enderecos_friozem",
    timestamps: true
});

export default EnderecoFriozem;