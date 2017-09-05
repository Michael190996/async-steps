import AsyncSteps from '../../AsyncSteps';
import _ from 'lodash';

export default async function (params, beforeResult, vars, events, stepLvl, stepNum) {
  let {conditions, sync} = params;
  let result = undefined;
  
  for (let i = 0; i < conditions.length; i++) {
    const is = eval(_.template('${' + conditions[i].condition + '} ? true : false')(vars));

    if (is) {
      vars.$currentModule.$if = {
        active: i
      };

      const as = new AsyncSteps(conditions[i].steps, sync, stepLvl + 1, stepNum);
      result = await as.init(vars, beforeResult);
    }
  }

  return result;
}