import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

export const AuditoriaQualidade = sequelize.define("AuditoriaQualidade", {
    codigoProduto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lote: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipoAcao: {
        type: DataTypes.ENUM('BLOQUEIO', 'LIBERACAO'),
        allowNull: false
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "auditoria_qualidade",
    timestamps: true
});

export default AuditoriaQualidade;