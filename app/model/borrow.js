import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class Borrow extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      user_id: this.user_id,
      resource_type: this.resource_type,
      resource_id: this.resource_id,
      comment: this.comment,
      borrow_data: this.borrow_data,
      expect_return_data: this.expect_return_data,
      return_data: this.return_data,
    };
    return origin;
  }
}

Borrow.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    resource_type: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    resource_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    comment: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    borrow_data: {
      type: Sequelize.DATE,
      allowNull: false
    },
    expect_return_data: {
      type: Sequelize.DATE,
      allowNull: false
    },
    return_data: {
      type: Sequelize.DATE,
      allowNull: true
    },
  },
  merge(
    {
      sequelize,
      tableName: 'borrow',
      modelName: 'borrow'
    },
    InfoCrudMixin.options
  )
);

export { Borrow };
