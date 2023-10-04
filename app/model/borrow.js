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
      borrow_reason: this.borrow_reason,
      borrow_date: this.borrow_date,
      expect_return_date: this.expect_return_date,
      return_date: this.return_date,
      comment: this.comment,
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
    borrow_reason: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    borrow_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    expect_return_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    return_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    comment: {
      type: Sequelize.STRING(200),
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
