import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { loginRequired, groupRequired } from '../../middleware/jwt';
import { PositiveIdValidator, SearchValidator } from '../../validator/common';
import { classify } from 'inflection'

import { getSafeParamId } from '../../lib/util';
import { ResourceNotFound } from '../../lib/exception';
import { GenericDao } from '../../dao/generic-dao';
import { BorrowDao } from '../../dao/borrow';


// 模型红图实例
// 需要添加 model 和 validator 文件
const resourceApi = new LinRouter({
  prefix: '/v1/:resource',
  module: '资源'
});

// dao 数据库访问层实例
const genericDto = new GenericDao();
const borrowDao = new BorrowDao();

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
  let resource = await genericDto.getModel(ctx.request.model, id);
  if (!resource) {
    throw new NotFound({
      code: 10022
    });
  }

  const borrow = await borrowDao.getRecordById(id)
  // console.log(borrow.toJSON());
  if (borrow) {
    resource = Object.assign(resource.toJSON(), {
      user_id: borrow.user_id,
      borrow_reason: borrow.borrow_reason,
      borrow_date: borrow.borrow_date,
      expect_return_date: borrow.expect_return_date,
      return_date: borrow.return_date,
      comment: borrow.comment
    });
  }
  ctx.json(resource);
});

resourceApi.linGet(
  'getResource',
  '/',
  loginRequired,
  async ctx => {
    const models = await genericDto.getModels(ctx.request.model);
    // if (!models || models.length < 1) {
    //   throw new NotFound({
    //     message: '没有找到相关资源'
    //   });
    // }
    const records = await borrowDao.getReturnableRecords(ctx.currentUser.id, ctx.params.resource);
    const result = [];
    models.forEach(item => {
      const model = item.toJSON();
      // MTODO: ctx.isAdmin
      // if (ctx.isAdmin || records.find(record => (record.resource_id === model.id))) {
      if (records.find(record => (record.resource_id === model.id))) {
        model.returnable = true;
      }
      // console.log(model);
      result.push(model);
    })
    // console.log(result);
    ctx.json(result);
  }
);

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

// borrow api
resourceApi.linPost(
  'borrowResource',
  '/:id/borrow',
  // resourceApi.permission('领用资源'),
  // groupRequired,
  loginRequired,
  async ctx => {
    const validator = await import(`../../validator/${ctx.params.resource}.js`);
    const v = await new validator.default[`BorrowValidator`]().validate(ctx);
    const id = getSafeParamId(ctx);
    await genericDto.borrowModel(ctx.request.model, v, ctx.currentUser.id, ctx.params.resource, id);
    ctx.success({
      code: 13
    });
  }
);

resourceApi.linPost(
  'returnResource',
  '/:id/return',
  // resourceApi.permission('归还资源'),
  // groupRequired,
  loginRequired,
  async ctx => {
    const validator = await import(`../../validator/${ctx.params.resource}.js`);
    const v = await new validator.default[`ReturnValidator`]().validate(ctx);
    const id = getSafeParamId(ctx);
    await genericDto.returnModel(ctx.request.model, v, ctx.currentUser.id, ctx.params.resource, id);
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
