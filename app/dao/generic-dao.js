import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';
import sequelize from '../lib/db';
import { Borrow } from '../model/borrow';

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

  async borrowModel (Model, v, userId, resourceType, resourceId) {
    let resource = await Model.findByPk(resourceId);
    if (!resource) {
      throw new NotFound({
        code: 10022
      });
    }
    // console.log(resource.dataValues, v.get('body.state_id'), userId, resourceType, resourceId);

    let transaction;
    try {
      transaction = await sequelize.transaction();
      const borrow = {
        user_id: userId,
        resource_type: resourceType,
        resource_id: resourceId,
        // comment: v.get('body.comment'),
        // MTODO
        borrow_data: "2023-09-07T06:49:45.000Z",
        expect_return_data: "2023-09-07T06:49:45.000Z",
        // borrow_data: v.get('body.borrow_data'),
        // expect_return_data: v.get('body.expect_return_data'),
        // // return_data: v.get('body.return_data'),
      };

      await Borrow.create(borrow, {
        transaction
      });

      resource = Object.assign(resource, {state_id: v.get('body.state_id')});
      await resource.save({
        transaction
      });

      await transaction.commit();
    } catch (error) {
      console.log("transaction err!!!", error);
      if (transaction) await transaction.rollback();
      throw new NotFound({
        code: 9999
      });
    }
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
