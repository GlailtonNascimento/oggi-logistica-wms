// backend/src/modules/produtos/models/index.js
import sequelize from '../../../config/db.js';
import ProdutosModel from './ProdutosModel.js';

const Produtos = ProdutosModel(sequelize);

export {
    Produtos,
};
