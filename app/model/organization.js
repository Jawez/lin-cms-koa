import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class Organization extends Model {
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
Organization.init(
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
      tableName: 'organization',
      modelName: 'organization'
    },
    InfoCrudMixin.options
  )
);

export { Organization };
