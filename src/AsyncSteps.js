import Modules from './component/Modules';
import Events from './component/Events';
import requireModules from './requireModules';
import Ctx from './Ctx';
import utils from './utils/utils';

export const events = new Events();

export const modules = new Modules(events, requireModules);

export class AsyncSteps {
  constructor(steps, sync = false, _modules = modules, _events = events) {
    this._ctx = new Ctx(steps, sync, _modules, _events);

    if (!Array.isArray(steps)) {
      events.error(new Error('steps is not array'), this.ctx);
    }

    if (!steps.length) {
      events.error(new Error('steps of undefined'), this.ctx);
    }
  }

  /**
   * @return Ctx - Вернет экземпляр класса Ctx
   */
  get ctx() {
    return this._ctx;
  }

  /**
   * @return modules - Вернет экземпляр класса Modules
   */
  get modules() {
    return this._ctx.modules;
  }

  /**
   * @return Modules - Вернет экземпляр класса events
   */
  get events() {
    return this._ctx.events;
  }

  /**
   * Метод запускает модуль
   * ВАЖНО: модуль может вызывать под модули
   *
   * @param {string} moduleName - имя модуля
   * @param {object} params - параметры
   * @param {*} [beforeResult] - предыдущий результат модуля
   * @param {object} vars - глобальные переменные
   * @param {number} [timeout] - таймер на текущий вызов модуля
   * @returns {{vars, result}|*}
   */
  async startStep(moduleName, params, beforeResult, vars, timeout = 0) {
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

  /**
   * Асинхронный метод запуска последовательных модулей
   *
   * @param {object} [vars] - Глобальные переменные
   * @param {*} [beforeResult] - Предыдущий результат модуля
   * @return {{result: *, vars: object}}
   */
  async init(vars = {}, beforeResult) {
    const steps = this.ctx._steps;
    let result = beforeResult;
    vars.$modules = vars.$modules || {};
    vars.$BASIC = vars.$BASIC || {};

    events.startSteps(beforeResult, vars, this.ctx);

    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      let currentStep = steps[stepIndex];
      this.ctx.stepIndex = stepIndex + 1;

      if (currentStep.params === undefined) {
        events.error(new Error('params of undefined'), this.ctx);
      }

      this.events.startStep(result, vars, this.ctx);

      vars.$currentModule = {
        id: currentStep.id,
        name: currentStep.module,
        params: currentStep.params
      };

      if (vars.$currentModule.id) {
        vars.$modules[vars.$currentModule.id] = vars.$currentModule;
      }

      vars.$BASIC.beforeResult = result;
      const response = await this.startStep(currentStep.module, currentStep.params, result, vars, currentStep.timeout);

      if (response) {
        result = response.result !== undefined ? response.result : result;
        vars = response.vars || vars;
      }

      const _result = utils.template(currentStep.result, vars);
      result = _result !== undefined ? _result : result;

      vars.$BASIC.currentResult = result;
      this.events.endStep(result, vars, this.ctx);
    }

    this.events.endSteps(result, vars, this.ctx);
    return {result, vars};
  }
}

export default AsyncSteps;