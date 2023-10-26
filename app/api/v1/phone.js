import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { loginRequired, groupRequired } from '../../middleware/jwt';
import {
  initModel,
  getResource,
  getResources,
  searchResource,
  postResource,
  updateResource,
  borrowResource,
  returnResource,
  deleteResource
} from '../../middleware/generic-resource';

// 需要添加 model 和 validator 文件
const phoneApi = new LinRouter({
  prefix: '/v1/device/phone',
  module: '测试手机管理'
});

phoneApi.use('/', async (ctx, next) => {
  ctx.params.resource = 'phone';
  await initModel(ctx, next);
});

phoneApi.get('/:id', getResource);

phoneApi.linGet(
  'getPhone',
  '/',
  loginRequired,
  getResources
);

phoneApi.get('/search/one', searchResource);

phoneApi.linPost(
  'postPhone',
  '/',
  phoneApi.permission('添加测试手机'),
  groupRequired,
  postResource
);

phoneApi.linPut(
  'updatePhone',
  '/:id',
  phoneApi.permission('更新测试手机'),
  groupRequired,
  updateResource
);

// borrow api
phoneApi.linPost(
  'borrowPhone',
  '/:id/borrow',
  // phoneApi.permission('领用测试手机'),
  // groupRequired,
  loginRequired,
  borrowResource
);

phoneApi.linPost(
  'returnPhone',
  '/:id/return',
  // phoneApi.permission('归还测试手机'),
  // groupRequired,
  loginRequired,
  returnResource
);

phoneApi.linDelete(
  'deletePhone',
  '/:id',
  phoneApi.permission('删除测试手机'),
  groupRequired,
  deleteResource
);

module.exports = { phoneApi, [disableLoading]: false };
