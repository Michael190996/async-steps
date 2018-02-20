import log4js from 'log4js';
import Ctx from './Ctx';

export default class AsyncSteps {
  constructor(steps, modules = require('../index').asModules, events = require('../index').asEvents) {
    this._modules = modules;
    this._events = events;
    this._steps = steps;
    this._logger = log4js.getLogger(AsyncSteps.name);
    this._logger.level = 'info';
    this._currentStepIndex = 1;
    this._currentStepDepth = 1;
    this._currentStepScheme = null;

    if (!Array.isArray(steps)) {
      this._events.error(new Error('steps is not array'));
    }

    if (!steps.length) {
      this._events.error(new Error('steps of undefined'));
    }
  }

  /**
   * @returns {{currentModule: null, beforeResult: null, currentResult: null, setting: {lodash: boolean}}}
   */
  static getNewBasic() {
    return {
      currentModule: null,
      beforeResult: null,
      currentResult: null,
      setting: {
        lodash: false
      }
    }
  }

  /**
   * @param {number} index
   * @param {number} depth
   * @param {string} scheme
   */
  _setPosCurrentStep(index, depth, scheme) {
    this._currentStepIndex = index;
    this._currentStepDepth = depth;
    this._currentStepScheme = scheme;
  }

  /**
   * @param {number} index - текущий индекс модуля
   * @param {object} currentStep - текущий модуль
   * @return {{result}|*}
   */
  _getCtx(index, currentStep) {
    const DEPTH = this._currentStepDepth;
    const SCHEME = this._currentStepScheme;
    const MODULENAME = currentStep.prefix ? `${currentStep.prefix}/${currentStep.module}` : currentStep.module;

    // currentStep = Object.assign({}, currentStep);
    const ctx = new Ctx(MODULENAME, currentStep, this.modules, this.events);

    ctx.stepIndex = index;
    ctx.stepDepth = DEPTH;
    ctx._setStepScheme(SCHEME);

    return ctx;
  }

  /**
   * @return modules - Вернет экземпляр класса Modules
   */
  get modules() {
    return this._modules;
  }

  /**
   * @return events - Вернет экземпляр класса Events
   */
  get events() {
    return this._events;
  }

  /**
   * @return {{index: (number), depth: (number), scheme: (string)}}
   */
  getPosCurrentStep() {
    return {
      index: this._currentStepIndex,
      depth: this._currentStepDepth,
      scheme: this._currentStepScheme
    }
  }

  /**
   * Асинхронный метод запускает модуль
   *
   * @param {string} moduleName - имя модуля
   * @param {object} [params] - параметры
   * @param {*} [data] - данные
   * @param {object} vars - глобальные переменные
   * @param ctx - экземпляр класса Ctx
   * @return {{vars, result}|*}
   */
  startStep(moduleName, params, data, vars, ctx) {
    return new Promise((resolve, reject) => {
      const TIMEOUT = ctx.step.timeout;

      const handler = () => {
        this._logger.info(`start step "${ctx.showStepScheme()}"`);
        this.events.startStep(data, vars, ctx);

        this.modules.startModule(moduleName, params, data, vars, ctx)
          .then(async (response) => {
            this._logger.info(`end step "${ctx.showStepScheme()}"`);
            this.events.endStep(response, vars, ctx);

            if (typeof ctx.step.after === 'function') {
              this._logger.info(`start after "${ctx.showStepScheme()}"`);

              response.result = (await ctx.step.after(params, response, vars, ctx)) || response.result;

              this._logger.info(`end after "${ctx.showStepScheme()}"`);
            }

            resolve(response);
          }).catch(err => reject(err));
      };

      if (TIMEOUT !== undefined) {
        return setTimeout(handler, TIMEOUT);
      } else {
        handler();
      }
    });
  }

  /**
   * Асинхронный метод запуска последовательных шагов
   *
   * @param {object} [vars] - глобальные переменные
   * @param {*} [data] - данные
   * @return {{result: *, vars: object}}
   */
  async init(vars = {}, data) {
    const promises = [];
    let result = data;
    vars.$BASIC = vars.$BASIC || AsyncSteps.getNewBasic();

    this.events.initSteps(result, vars);

    for (let stepIndex = 0; stepIndex < this._steps.length; stepIndex++) {
      const INDEX = stepIndex + 1;
      const CURRENTSTEP = this._steps[stepIndex];
      const CTX = this._getCtx(INDEX, CURRENTSTEP);
      const PARAMS = Object.assign({}, CTX.step.params);
      let response;

      vars.$BASIC.currentModule = CURRENTSTEP;
      vars.$BASIC.beforeResult = result;

      const startStep = this.startStep(CTX.moduleName, PARAMS, result, vars, CTX)
        .then(response => vars.$BASIC.currentResult = response)
        .catch(error => this._events.error(new Error(error), CTX));

      promises.push(startStep);

      if (!CTX.step.sync) {
        response = await startStep;
      }

      if (response) {
        result = response.result !== undefined ? response.result : result;
        vars = response.vars || vars;
      }
    }

    this.events.end(await Promise.all(promises), vars);

    return {result, vars};
  }
}
