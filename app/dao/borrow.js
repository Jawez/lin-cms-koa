import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';
import sequelize from '../lib/db';
import { Borrow } from '../model/borrow';

class BorrowDao {
  async getUserRecords (user_id) {
    const data = await Borrow.findAll({
      where: {
        user_id
      }
    });
    return data;
  }

  async getRecordById (resource_type, resource_id) {
    const data = await Borrow.findOne({
      where: {
        resource_type,
        resource_id,
        return_date: null
      }
    });
    return data;
  }

  async getReturnableRecords (user_id, resource_type) {
    const data = await Borrow.findAll({
      where: {
        user_id,
        resource_type,
        return_date: null
      }
    });
    return data;
  }

  async getRecords () {
    const models = await Borrow.findAll();
    return models;
  }
}

export { BorrowDao };
