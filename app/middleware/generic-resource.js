import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { PositiveIdValidator, SearchValidator } from '../validator/common';
import { classify } from 'inflection'

import { getSafeParamId } from '../lib/util';
import { ResourceNotFound } from '../lib/exception';
import { GenericDao } from '../dao/generic-dao';
import { BorrowDao } from '../dao/borrow';

// dao 数据库访问层实例
const genericDto = new GenericDao();
const borrowDao = new BorrowDao();

async function initModel (ctx, next) {
  const modelName = classify(ctx.params.resource.replace('-', '_'))
  const Model = await import(`../model/${ctx.params.resource}.js`);
  ctx.request.model = Model.default[modelName];
  ctx.request.modelName = modelName;
  await next();
}

async function getResource (ctx) {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  let resource = await genericDto.getModel(ctx.request.model, id);
  if (!resource) {
    throw new NotFound({
      code: 10022
    });
  }

  const borrow = await borrowDao.getRecordById(ctx.params.resource, id)
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
}

async function getResources (ctx) {
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

async function searchResource (ctx) {
  const v = await new SearchValidator().validate(ctx);
  const resource = await genericDto.getModelByKeyword(ctx.request.model, v.get('query.q'));
  if (!resource) {
    throw new ResourceNotFound();
  }
  ctx.json(resource);
}

async function postResource (ctx) {
  const Validator = await import(`../validator/${ctx.params.resource}.js`);
  const v = await new Validator.default[`CreateOrUpdateValidator`]().validate(ctx);
  await genericDto.createModel(ctx.request.model, v);
  ctx.success({
    code: 12
  });
}

async function updateResource (ctx) {
  const Validator = await import(`../validator/${ctx.params.resource}.js`);
  const v = await new Validator.default[`CreateOrUpdateValidator`]().validate(ctx);
  const id = getSafeParamId(ctx);
  await genericDto.updateModel(ctx.request.model, v, id);
  ctx.success({
    code: 13
  });
}

async function borrowResource (ctx) {
  const validator = await import(`../validator/${ctx.params.resource}.js`);
  const v = await new validator.default[`BorrowValidator`]().validate(ctx);
  const id = getSafeParamId(ctx);
  await genericDto.borrowModel(ctx.request.model, v, ctx.currentUser.id, ctx.params.resource, id);
  ctx.success({
    code: 13
  });
}

async function returnResource (ctx) {
  const validator = await import(`../validator/${ctx.params.resource}.js`);
  const v = await new validator.default[`ReturnValidator`]().validate(ctx);
  const id = getSafeParamId(ctx);
  await genericDto.returnModel(ctx.request.model, v, ctx.currentUser.id, ctx.params.resource, id);
  ctx.success({
    code: 13
  });
}

async function deleteResource (ctx) {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  await genericDto.deleteModel(ctx.request.model, id);
  ctx.success({
    code: 14
  });
}

export {
  initModel,
  getResource,
  getResources,
  searchResource,
  postResource,
  updateResource,
  borrowResource,
  returnResource,
  deleteResource
};
