import _ from 'lodash';

export default async function(params, beforeResult, vars, events) {
  const _vars = params.vars;

  for (let g = 0; g < _vars.length; g++) {
    for (let i = 0, keys = Object.keys(_vars[g]); i < keys.length; i++) {
      vars[keys[i]] = eval(_.template('${' + _vars[g][keys[i]] + '}')(vars));
    }
  }
}