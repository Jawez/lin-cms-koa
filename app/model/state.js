import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class State extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      name: this.name,
      description: this.description,
    };
    return origin;
  }
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/
// Extending Model and calling init(attributes, options)
State.init(
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
    }
  },
  merge(
    {
      sequelize,
      tableName: 'state',
      modelName: 'state'
    },
    InfoCrudMixin.options
  )
);

export { State };
