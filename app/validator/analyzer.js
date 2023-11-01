import { LinValidator, Rule } from 'lin-mizar';

class CreateOrUpdateValidator extends LinValidator {
  constructor () {
    super();
    this.name = new Rule('isNotEmpty', '必须传入名称');
    this.organization_id = new Rule('isNotEmpty', '必须传入组织信息');
    this.manager_id = new Rule('isNotEmpty', '必须传入管理员信息');
    this.state_id = new Rule('isNotEmpty', '必须传入状态信息');
  }
}

// MTODO
// borrow validator
class BorrowValidator extends LinValidator {
  constructor () {
    super();
    this.state_id = new Rule('isNotEmpty', '必须传入状态信息');
    this.borrow_date = new Rule('isNotEmpty', '必须传入领用时间');
    this.expect_return_date = new Rule('isNotEmpty', '必须传入预计归还时间');
  }
}

class ReturnValidator extends LinValidator {
  constructor () {
    super();
    this.state_id = new Rule('isNotEmpty', '必须传入状态信息');
  }
}

export { CreateOrUpdateValidator, BorrowValidator, ReturnValidator };
