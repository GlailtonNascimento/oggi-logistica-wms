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

        // Quantas caixas cabem em 1 pallet
        quantidadeCaixasPorPallet: {
            type: DataTypes.INTEGER,
            allowNull: false, // obrigatório
        },

        categoria: {
            type: DataTypes.STRING,
            allowNull: true,
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



