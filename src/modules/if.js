import AsyncSteps from '../AsyncSteps';
import _ from 'lodash';

export default async function (params, beforeResult, vars, events) {
  let {conditions} = params;

  vars.$currentModule.$if = {
    active: false
  };

  let steps = false;
  for (let i = 0; i < conditions.length; i++) {
    steps = eval(_.template('${' + conditions[i].condition + '} ? true : false')(vars));

    if (steps) {
      vars.$currentModule.$if.active = i;
      steps = conditions[i].steps;
    }
  }

  if (steps) {
    const as = new AsyncSteps(steps);
    return await as.init(vars, beforeResult);
  }
}