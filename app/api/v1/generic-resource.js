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
const resourceApi = new LinRouter({
  prefix: '/v1/resource/:resource',
  module: '系统资源管理'
});

resourceApi.use('/', initModel);

resourceApi.get('/:id', getResource);

resourceApi.linGet(
  'getResource',
  '/',
  loginRequired,
  getResources
);

resourceApi.get('/search/one', searchResource);

resourceApi.linPost(
  'postResource',
  '/',
  resourceApi.permission('添加资源'),
  groupRequired,
  postResource
);

resourceApi.linPut(
  'updateResource',
  '/:id',
  resourceApi.permission('更新资源'),
  groupRequired,
  updateResource
);

// borrow api
resourceApi.linPost(
  'borrowResource',
  '/:id/borrow',
  // resourceApi.permission('领用资源'),
  // groupRequired,
  loginRequired,
  borrowResource
);

resourceApi.linPost(
  'returnResource',
  '/:id/return',
  // resourceApi.permission('归还资源'),
  // groupRequired,
  loginRequired,
  returnResource
);

resourceApi.linDelete(
  'deleteResource',
  '/:id',
  resourceApi.permission('删除资源'),
  groupRequired,
  deleteResource
);

module.exports = { resourceApi, [disableLoading]: false };
