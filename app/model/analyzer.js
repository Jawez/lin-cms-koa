import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class Analyzer extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      name: this.name,
      description: this.description,
      manager_id: this.manager_id,
      state_id: this.state_id,
    };
    return origin;
  }
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/
// Extending Model and calling init(attributes, options)
Analyzer.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    manager_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    state_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  merge(
    {
      sequelize,
      tableName: 'analyzer',
      modelName: 'analyzer'
    },
    InfoCrudMixin.options
  )
);

export { Analyzer };
