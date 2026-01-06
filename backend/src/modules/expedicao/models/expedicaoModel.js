import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';

const Expedicao = sequelize.define('Expedicao', {
    ordemCarga: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: {
        type: DataTypes.ENUM('INICIAR', 'EM PROCESSO', 'CONCLUIDO'),
        defaultValue: 'INICIAR'
    },
    fotoInicio: { type: DataTypes.STRING }, // URL da foto do caminhão vazio
    fotoFinal: { type: DataTypes.STRING },  // URL da foto do lacre
    lacre: { type: DataTypes.STRING },
    analista: { type: DataTypes.STRING }
});

export default Expedicao;