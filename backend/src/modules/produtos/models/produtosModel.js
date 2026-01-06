// backend/src/modules/produtos/models/ProdutosModel.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Produtos = sequelize.define('Produtos', {
        codigoSKU: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },

        descricao: {
            type: DataTypes.STRING,
            allowNull: false
        },

        categoria: {
            type: DataTypes.STRING
        },

        pesoCaixaKg: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },

        quantidadePorCaixa: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        quantidadePadraoPallet: {
            type: DataTypes.INTEGER,
            defaultValue: 80
        },

        origemCadastro: {
            type: DataTypes.ENUM('MANUAL', 'OCR', 'IMPORTACAO'),
            defaultValue: 'MANUAL'
        },

        ativo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'produtos',
        timestamps: true
    });

    return Produtos;
};

