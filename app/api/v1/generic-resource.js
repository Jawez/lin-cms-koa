import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { groupRequired } from '../../middleware/jwt';
import { PositiveIdValidator, SearchValidator } from '../../validator/common';
import { classify } from 'inflection'

import { getSafeParamId } from '../../lib/util';
import { ResourceNotFound } from '../../lib/exception';
import { GenericDao } from '../../dao/generic-dao';

// 模型红图实例
// 需要添加 model 和 validator 文件
const resourceApi = new LinRouter({
  prefix: '/v1/:resource',
  module: '资源'
});

// dao 数据库访问层实例
const genericDto = new GenericDao();

resourceApi.use('/', async (ctx, next) => {
  const modelName = classify(ctx.params.resource.replace('-', '_'))
  const Model = await import(`../../model/${ctx.params.resource}.js`);
  ctx.request.model = Model.default[modelName];
  ctx.request.modelName = modelName;
  await next();
});

resourceApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const resource = await genericDto.getModel(ctx.request.model, id);
  if (!resource) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(resource);
});

resourceApi.get('/', async ctx => {
  const models = await genericDto.getModels(ctx.request.model);
  // if (!models || models.length < 1) {
  //   throw new NotFound({
  //     message: '没有找到相关资源'
  //   });
  // }
  ctx.json(models);
});

resourceApi.get('/search/one', async ctx => {
  const v = await new SearchValidator().validate(ctx);
  const resource = await genericDto.getModelByKeyword(ctx.request.model, v.get('query.q'));
  if (!resource) {
    throw new ResourceNotFound();
  }
  ctx.json(resource);
});

resourceApi.linPost(
  'postResource',
  '/',
  resourceApi.permission('添加资源'),
  groupRequired,
  async ctx => {
    const Validator = await import(`../../validator/${ctx.params.resource}.js`);
    const v = await new Validator.default[`CreateOrUpdateValidator`]().validate(ctx);
    await genericDto.createModel(ctx.request.model, v);
    ctx.success({
      code: 12
    });
  }
);

resourceApi.linPut(
  'updateResource',
  '/:id',
  resourceApi.permission('更新资源'),
  groupRequired,
  async ctx => {
    const Validator = await import(`../../validator/${ctx.params.resource}.js`);
    const v = await new Validator.default[`CreateOrUpdateValidator`]().validate(ctx);
    const id = getSafeParamId(ctx);
    await genericDto.updateModel(ctx.request.model, v, id);
    ctx.success({
      code: 13
    });
  }
);

resourceApi.linDelete(
  'deleteResource',
  '/:id',
  resourceApi.permission('删除资源'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await genericDto.deleteModel(ctx.request.model, id);
    ctx.success({
      code: 14
    });
  }
);

module.exports = { resourceApi, [disableLoading]: false };
