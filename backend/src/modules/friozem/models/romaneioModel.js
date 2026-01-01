import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const RomaneioFriozem = sequelize.define("RomaneioFriozem", {
    rota: {
        type: DataTypes.STRING,
        allowNull: false
    }, // Ex: "ROTA 01 - RECIFE"
    status: {
        type: DataTypes.ENUM('PENDENTE', 'EM_SEPARACAO', 'CONFERENCIA', 'FINALIZADO'),
        defaultValue: 'PENDENTE'
    }, // PENDENTE(🔴), EM_SEPARACAO(🟠), CONFERENCIA(🟢), FINALIZADO(⚫)
    totalCaixas: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    caixasSeparadas: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    separadorId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "romaneios_friozem",
    timestamps: true
});

export default RomaneioFriozem;