import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class TemplateResource extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      name: this.name,
      summary: this.summary,
    };
    return origin;
  }
}

// https://sequelize.org/docs/v6/core-concepts/model-basics/
// Extending Model and calling init(attributes, options)
TemplateResource.init(
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
    summary: {
      type: Sequelize.STRING(1000),
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'template_resource',
      modelName: 'template_resource'
    },
    InfoCrudMixin.options
  )
);

export { TemplateResource };
