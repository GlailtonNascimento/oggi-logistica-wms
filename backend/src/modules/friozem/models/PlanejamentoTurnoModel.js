import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';

const PlanejamentoTurno = sequelize.define(
    'PlanejamentoTurno',
    {
        codigoProduto: DataTypes.STRING,
        quantidade: DataTypes.INTEGER,
        turno: DataTypes.ENUM('DIA', 'NOITE'),
        data: DataTypes.DATEONLY,
        origem: DataTypes.STRING
    },
    {
        tableName: 'planejamento_turno',
        timestamps: true
    }
);

export default PlanejamentoTurno;
