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
    if (resource.dataValues.state_id === v.get('body.state_id')) {
      throw new NotFound({
        code: 10030
      });
    }
    // console.log(resource.dataValues, userId, resourceType, resourceId);
    // console.log(resource.dataValues.state_id, v.get('body.state_id'));

    let transaction;
    try {
      transaction = await sequelize.transaction();
      resource = Object.assign(resource, {state_id: v.get('body.state_id')});
      await resource.save({
        transaction
      });

      const borrow = {
        user_id: userId,
        resource_type: resourceType,
        resource_id: resourceId,
        borrow_reason: v.get('body.borrow_reason'),
        // format: "2023-09-07T06:49:45.000Z"
        borrow_date: v.get('body.borrow_date'),
        expect_return_date: v.get('body.expect_return_date'),
        comment: v.get('body.comment'),
      };
      await Borrow.create(borrow, {
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

  async returnModel (Model, v, userId, resourceType, resourceId) {
    // console.log(v.get('body.state_id'), userId, resourceType, resourceId);
    let resource = await Model.findByPk(resourceId);
    if (!resource) {
      throw new NotFound({
        code: 10022
      });
    }
    if (resource.dataValues.state_id === v.get('body.state_id')) {
      throw new NotFound({
        code: 10030
      });
    }
    // console.log(resource.dataValues);
    let record = await Borrow.findOne({
      where: {
        // user_id: userId,
        resource_type: resourceType,
        resource_id: resourceId,
        return_date: null
      }
    });
    if (!record) {
      throw new NotFound({
        code: 9999
      });
    }
    // console.log(record.dataValues);

    let transaction;
    try {
      transaction = await sequelize.transaction();
      resource = Object.assign(resource, {state_id: v.get('body.state_id')});
      await resource.save({
        transaction
      });

      record = Object.assign(record, {
        comment: v.get('body.comment'),
        return_date: v.get('body.return_date'),
      });
      await record.save({
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
