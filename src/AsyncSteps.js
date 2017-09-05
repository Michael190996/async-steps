import Modules from './component/Modules';
import Events from './component/Events';
import requireModules from './requireModules';

export const events = new Events();

export const modules = new Modules(events, requireModules);

export class AsyncSteps {
  constructor(steps, sync = false, _stepLvl = 1, _stepNum = 1, _modules = modules, _events = events) {
    if (!steps.length) {
      events.error(new Error('Steps of undefined'), _stepLvl, _stepNum);
    }

    this._steps = steps;
    this._modules = _modules;
    this._events = _events;
    this._stepLvl = _stepLvl;
    this.sync = sync;
  }

  get modules() {
    return this._modules;
  }

  get events() {
    return this._events;
  }

  startStep(moduleName, params, beforeResult, vars, timeout, stepNum) {
    if (!this.sync) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.modules.startModule(moduleName, this._stepLvl, stepNum, params, beforeResult, vars, this.events));
        }, timeout);
      });
    } else {
      return setTimeout(() => {
        this.modules.startModule(moduleName, this._stepLvl, stepNum, params, beforeResult, vars, this.events);
      }, timeout);
    }
  }

  async init(vars = {}, beforeResult) {
    let result = beforeResult;
    vars.$modules = vars.$modules || {};

    events.startSteps(this._steps, beforeResult, vars, this._stepLvl);

    for (let stepNum = 0; stepNum < this._steps.length; stepNum++) {
      let currentStep = this._steps[stepNum];

      vars.$currentModule = {
        id: currentStep.id,
        name: currentStep.module,
        params: currentStep.params
      };

      if (vars.$currentModule.id) {
        vars.$modules[vars.$currentModule.id] = vars.$currentModule;
      }

      currentStep.timeout = currentStep.timeout || 0;
      const response = await this.startStep(currentStep.module, currentStep.params, result, vars, currentStep.timeout, stepNum + 1);

      if (response) {
        result = response.result || result;
        vars = response.vars || vars;
      }

      this.events.listen(result, vars, this._stepLvl, stepNum + 1);
    }

    this.events.endSteps(this._steps, result, vars, this._stepLvl);
    return {result, vars};
  }
}

export default AsyncSteps;