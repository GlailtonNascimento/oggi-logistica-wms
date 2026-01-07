import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';

const RelatorioSnapshot = sequelize.define('RelatorioSnapshot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.STRING, // DASHBOARD_DIARIO, MENSAL, ETC
        allowNull: false
    },
    dados: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    tableName: 'relatorio_snapshots',
    timestamps: true
});

export default RelatorioSnapshot;
