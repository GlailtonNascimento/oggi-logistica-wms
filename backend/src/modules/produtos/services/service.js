// backend/src/modules/produtos/services/service.js
class BaseService {

  async findOrCreate(model, where, defaults) {
    return model.findOrCreate({
      where,
      defaults,
    });
  }

  async bulkUpsert(model, dados, camposAtualizar) {
    return model.bulkCreate(dados, {
      updateOnDuplicate: camposAtualizar,
    });
  }

  async findByPk(model, pk) {
    return model.findByPk(pk);
  }
}

export default new BaseService();
