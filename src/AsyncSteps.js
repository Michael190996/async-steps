import Modules from './component/Modules';
import Events from './component/Events';
import requireModules from './requireModules';
import Ctx from './Ctx';

export const events = new Events();

export const modules = new Modules(events, requireModules);

export class AsyncSteps {
  constructor(steps, sync = false, _modules = modules, _events = events) {
    this._ctx = new Ctx(steps, sync, _modules, _events);

    if (!steps.length) {
      events.error(new Error('Steps of undefined'), this.ctx);
    }
  }

  get ctx() {
    return this._ctx;
  }

  get modules() {
    return this._ctx.modules;
  }

  get events() {
    return this._ctx.events;
  }

  async startStep(moduleName, params, beforeResult, vars, timeout) {
    if (!timeout) {
      if (this.ctx._sync) {
        return this.modules.startModule(moduleName, params, beforeResult, vars, this.ctx);
      } else {
        return await this.modules.startModule(moduleName, params, beforeResult, vars, this.ctx);
      }
    }

    if (this.ctx._sync) {
      setTimeout(() => {
        this.modules.startModule(moduleName, params, beforeResult, vars, this.ctx);
      }, timeout);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(async() => {
          return resolve(await this.modules.startModule(moduleName, params, beforeResult, vars, this.ctx));
        }, timeout);
      });
    }
  }

  async init(vars = {}, beforeResult) {
    const steps = this.ctx._steps;
    let result = beforeResult;
    vars.$modules = vars.$modules || {};

    events.startSteps(beforeResult, vars, this.ctx);

    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      let currentStep = steps[stepIndex];
      this.ctx.stepIndex = stepIndex+1;

      this.events.startStep(result, vars, this.ctx);

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

      result = vars[currentStep.result] || result;

      this.events.endStep(result, vars, this.ctx);
    }

    this.events.endSteps(result, vars, this.ctx);
    return {result, vars};
  }
}

export default AsyncSteps;