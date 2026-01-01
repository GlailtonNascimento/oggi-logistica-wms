import { DataTypes } from "sequelize";
import { sequelize } from "../../../../config/db.js";
import PalletRegistro from "./PalletRegistro.js";

const FotoRegistro = sequelize.define('FotoRegistro', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    urlCaminho: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    }, // Ex: 'PLACA', 'ETIQUETA', 'FRACAO'
    palletId: { // O Pallet que a foto documenta
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pallets_registro_producao', // Referencia o PalletRegistro
            key: 'id'
        }
    }
}, {
    tableName: 'foto_registros',
    timestamps: true
});

// 🔥 ASSOCIAÇÕES
FotoRegistro.belongsTo(PalletRegistro, { foreignKey: 'palletId', as: 'pallet' });
PalletRegistro.hasMany(FotoRegistro, { foreignKey: 'palletId', as: 'fotos' });

export default FotoRegistro;