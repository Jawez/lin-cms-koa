import { LinValidator, Rule, config } from 'lin-mizar';

class PositiveIdValidator extends LinValidator {
  constructor () {
    super();
    this.id = new Rule('isInt', 'id必须为正整数', { min: 1 });
  }
}

class PaginateValidator extends LinValidator {
  constructor () {
    super();
    this.count = [
      new Rule('isOptional', '', config.getItem('countDefault')),
      new Rule('isInt', 'count必须为正整数', { min: 1 })
    ];
    this.page = [
      new Rule('isOptional', '', config.getItem('pageDefault')),
      new Rule('isInt', 'page必须为整数，且大于等于0', { min: 0 })
    ];
  }
}

class SearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule('isNotEmpty', '必须传入搜索关键字');
  }
}

class NameValidator extends LinValidator {
  constructor () {
    super();
    this.name = new Rule('isNotEmpty', '必须传入名称关键字', { min: 1 });
  }
}

export { PaginateValidator, PositiveIdValidator, SearchValidator, NameValidator };
