import { LinRouter, Failed, NotFound } from 'lin-mizar';
import {
  AdminUsersValidator,
} from '../../validator/admin';
import { PositiveIdValidator, PaginateValidator } from '../../validator/common';

import { groupRequired } from '../../middleware/jwt';
import { AdminDao } from '../../dao/admin';

const manager = new LinRouter({
  prefix: '/cms/manager',
  module: '系统管理员',
});

const adminDao = new AdminDao();

manager.linGet(
  'getAllPermissions',
  '/permission',
  manager.permission('查询所有可分配的权限'),
  groupRequired,
  async ctx => {
    const permissions = await adminDao.getAllPermissions();
    ctx.json(permissions);
  }
);

manager.linGet(
  'getAdminUsers',
  '/users',
  manager.permission('查询所有用户'),
  groupRequired,
  async ctx => {
    const v = await new AdminUsersValidator().validate(ctx);
    const { users, total } = await adminDao.getUsers(
      v.get('query.group_id'),
      v.get('query.page'),
      v.get('query.count')
    );
    ctx.json({
      items: users,
      total,
      count: v.get('query.count'),
      page: v.get('query.page')
    });
  }
);

manager.linGet(
  'getAdminGroups',
  '/group',
  manager.permission('查询所有权限组及其权限'),
  groupRequired,
  async ctx => {
    const v = await new PaginateValidator().validate(ctx);
    const { groups, total } = await adminDao.getGroups(
      ctx,
      v.get('query.page'),
      v.get('query.count')
    );
    if (groups.length < 1) {
      throw new NotFound({
        code: 10024
      });
    }
    ctx.json({
      items: groups,
      total: total,
      page: v.get('query.page'),
      count: v.get('query.count')
    });
  }
);

manager.linGet(
  'getAllGroup',
  '/group/all',
  manager.permission('查询所有权限组'),
  groupRequired,
  async ctx => {
    const groups = await adminDao.getAllGroups();
    if (!groups || groups.length < 1) {
      throw new NotFound({
        code: 10024
      });
    }
    ctx.json(groups);
  }
);

manager.linGet(
  'getGroup',
  '/group/:id',
  manager.permission('查询一个权限组及其权限'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const group = await adminDao.getGroup(ctx, v.get('path.id'));
    ctx.json(group);
  }
);

export { manager };
