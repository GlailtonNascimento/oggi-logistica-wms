class BaseService {

    async count(model, where = {}) {
        return model.count({ where });
    }

    async findAll(model, options = {}) {
        return model.findAll(options);
    }

}

export default new BaseService();
