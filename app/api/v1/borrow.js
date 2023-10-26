import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { adminRequired, loginRequired, groupRequired } from '../../middleware/jwt';
import { PositiveIdValidator, SearchValidator } from '../../validator/common';
import { classify } from 'inflection'

import { getSafeParamId } from '../../lib/util';
import { ResourceNotFound } from '../../lib/exception';
import { BorrowDao } from '../../dao/borrow';

const borrowApi = new LinRouter({
  prefix: '/v1/borrow',
  module: '领用信息查询'
});

const borrowDao = new BorrowDao();

borrowApi.linGet(
  'getAllRecords',
  '/all',
  // borrowApi.permission('查询所有领用记录'),
  // groupRequired,
  // adminRequired,
  loginRequired,
  async ctx => {
    const models = await borrowDao.getRecords();
    // if (!models || models.length < 1) {
    //   throw new NotFound({
    //     message: '没有找到相关资源'
    //   });
    // }
    ctx.json(models);
  }
);

borrowApi.linGet(
  'getRecords',
  '/',
  loginRequired,
  async ctx => {
    const models = await borrowDao.getUserRecords(ctx.currentUser.id);
    // console.log(ctx.currentUser.toJSON())
    ctx.json(models);
  }
);

module.exports = { borrowApi, [disableLoading]: false };
