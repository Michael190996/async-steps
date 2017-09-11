import _ from 'lodash';

export default {
  template(template, vars) {
    if (typeof template !== 'string') {
      return template;
    }

    try {
      return eval(_.template(template)(vars));
    } catch (e) {
      return _.template(template)(vars);
    }
  }
}