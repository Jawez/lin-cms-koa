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
const analyzerApi = new LinRouter({
  prefix: '/v1/device/analyzer',
  module: '抓包工具管理'
});

analyzerApi.use('/', async (ctx, next) => {
  ctx.params.resource = 'analyzer';
  await initModel(ctx, next);
});

analyzerApi.get('/:id', getResource);

analyzerApi.linGet(
  'getAnalyzer',
  '/',
  loginRequired,
  getResources
);

analyzerApi.get('/search/one', searchResource);

analyzerApi.linPost(
  'postAnalyzer',
  '/',
  analyzerApi.permission('添加抓包工具'),
  groupRequired,
  postResource
);

analyzerApi.linPut(
  'updateAnalyzer',
  '/:id',
  analyzerApi.permission('更新抓包工具'),
  groupRequired,
  updateResource
);

// borrow api
analyzerApi.linPost(
  'borrowAnalyzer',
  '/:id/borrow',
  // analyzerApi.permission('领用抓包工具'),
  // groupRequired,
  loginRequired,
  borrowResource
);

analyzerApi.linPost(
  'returnAnalyzer',
  '/:id/return',
  // analyzerApi.permission('归还抓包工具'),
  // groupRequired,
  loginRequired,
  returnResource
);

analyzerApi.linDelete(
  'deleteAnalyzer',
  '/:id',
  analyzerApi.permission('删除抓包工具'),
  groupRequired,
  deleteResource
);

module.exports = { analyzerApi, [disableLoading]: false };
