import { LinValidator, Rule } from 'lin-mizar';

class CreateOrUpdateValidator extends LinValidator {
  constructor () {
    super();
    this.name = new Rule('isNotEmpty', '必须传入名称');
  }
}

export { CreateOrUpdateValidator };
