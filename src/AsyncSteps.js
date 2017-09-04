import modules from './modules/Modules';
import events from './Events';

export default class AsyncSteps {
  constructor(steps, async = true, _events = events) {
    this.modules = modules;
    this.events = _events;
    this._steps = steps;
    this._async = async;
  }

  startStep(moduleName, params, beforeResult, vars, timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (this._async) {
          return resolve(await this.modules.startModule(moduleName, params, beforeResult, vars, this.events));
        } else {
          resolve(this.modules.startModule(moduleName, params, beforeResult, vars, this.events));
        }
      }, timeout);
    });
  }

  async init(vars = {}, beforeResult) {
    let result = beforeResult;
    vars.$modules = vars.$modules || {};

    if (this._steps.length) {
      events.startSteps(this._steps, beforeResult, vars);

      for (let i = 0; i < this._steps.length; i++) {
        let currentStep = this._steps[i];

        vars.$currentModule = {
          id: currentStep.id,
          name: currentStep.module,
          params: currentStep.params
        };

        if (vars.$currentModule.id) {
          vars.$modules[vars.$currentModule.id] = vars.$currentModule;
        }

        currentStep.timeout = currentStep.timeout || 0;
        const response = await this.startStep(currentStep.module, currentStep.params, result, vars, currentStep.timeout);

        if (response) {
          result = response.result || result;
          vars = response.vars || vars;
        }

        this.events.listen(result, vars);
      }

      this.events.endSteps(this._steps, result, vars);
      return await {result, vars};
    } else {
      this.events.error('Steps of undefined');
      throw new Error('Steps of undefined');
    }
  }
}