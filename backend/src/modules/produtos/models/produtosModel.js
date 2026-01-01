// backend/src/modules/produtos/models/ProdutosModel.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Produtos = sequelize.define('Produtos', {
        codigoSKU: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantidadePadraoPallet: {
            type: DataTypes.INTEGER,
            defaultValue: 80,
        },
        categoria: {
            type: DataTypes.STRING,
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'produtos',
        timestamps: true,
    });

    return Produtos;
};
