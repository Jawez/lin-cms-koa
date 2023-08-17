import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';

class GenericDao {
  async getModel (Model, id) {
    const resource = await Model.findOne({
      where: {
        id
      }
    });
    return resource;
  }

  async getModelByKeyword (Model, q) {
    const resource = await Model.findOne({
      where: {
        title: {  // MTODO
          [Sequelize.Op.like]: `%${q}%`
        }
      }
    });
    return resource;
  }

  async getModels (Model) {
    const models = await Model.findAll();
    // const Model = await import(`../resource/resource.js`);
    // const models = await Model.default.Book.findAll();
    return models;
  }

  async createModel (Model, v) {
    // MTODO
    // const resource = await Model.findOne({
    //   where: {
    //     title: v.get('body.title')
    //   }
    // });
    // if (resource) {
    //   throw new Forbidden({
    //     code: 10240
    //   });
    // }
    const resource = await Model.create(v.get('body'));
  }

  async updateModel (Model, v, id) {
    let resource = await Model.findByPk(id);
    if (!resource) {
      throw new NotFound({
        code: 10022
      });
    }
    resource = Object.assign(resource, v.get('body'));
    await resource.save();
  }

  async deleteModel (Model, id) {
    const resource = await Model.findOne({
      where: {
        id
      }
    });
    if (!resource) {
      throw new NotFound({
        code: 10022
      });
    }
    resource.destroy();
  }
}

export { GenericDao };
