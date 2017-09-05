import AsyncSteps from '../../AsyncSteps';
import _ from 'lodash';

export default async function (params, beforeResult, vars, events, stepLvl, stepNum) {
  let {condition, steps, sync} = params;
  let result = undefined;

  const handler = async (index, el) => {
    vars.$currentModule.$for = {index, el};

    const as = new AsyncSteps(steps, sync, stepLvl + 1, stepNum);
    return await as.init(vars, beforeResult);
  };

  condition = _.template('${' + condition + '}')(vars);

  if (!isNaN(Number(condition))) {
    for (let i = 0; i < parseInt(condition); i++) {
      result = await handler(i);
    }
  } else {
    condition = new Array(condition);

    for (let i = 0; i < condition.length; i++) {
      result = await handler(i, condition[i]);
    }
  }

  return result;
}