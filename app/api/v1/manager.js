import { LinRouter, Failed, NotFound } from 'lin-mizar';
import {
  AdminUsersValidator,
} from '../../validator/admin';
import { PositiveIdValidator, PaginateValidator, NameValidator } from '../../validator/common';

import { groupRequired } from '../../middleware/jwt';
import { AdminDao } from '../../dao/admin';

const manager = new LinRouter({
  prefix: '/cms/manager',
  module: '系统管理员',
});

const adminDao = new AdminDao();

manager.linGet(
  'getManagers',
  '/',
  // manager.permission('查询管理员'),
  // groupRequired,
  async ctx => {
    const v = await new NameValidator().validate(ctx);
    // MTODO: page, count
    const managers = await adminDao.getManagers(v.get('query.name'), 0, 200);
    ctx.json(managers);
  }
);

export { manager };
