import log4js from 'log4js';
import Ctx from './Ctx';
import utils from '../utils';

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
   * @param {number} index
   * @param {number} depth
   * @param {string|number} scheme
   */
  _setPosCurrentStep(index, depth, scheme) {
    this._currentStepIndex = index;
    this._currentStepDepth = depth;
    this._currentStepScheme = scheme;
  }

  /**
   * @return {{index: (number), depth: (number), scheme: (string|number)}}
   */
  getPosCurrentStep() {
    return {
      index: this._currentStepIndex,
      depth: this._currentStepDepth,
      scheme: this._currentStepScheme
    }
  }

  /**
   * Метод запускает модуль
   * !!! модуль может вызывать под модули
   *
   * @param {string} moduleName - имя модуля
   * @param {object} params - параметры
   * @param {*} [pipe] - поток результата
   * @param {object} vars - глобальные переменные
   * @param ctx - экземпляр класса Ctx
   * @return {{vars, result}|*}
   */
  async _startStep(moduleName, params, pipe, vars, ctx) {
    const SYNC = ctx.sync;
    const TIMEOUT = ctx.timeout;

    if (!TIMEOUT) {
      if (SYNC) {
        this.modules.startModule(moduleName, params, pipe, vars, ctx);
      } else {
        return await this.modules.startModule(moduleName, params, pipe, vars, ctx);
      }
    }

    if (SYNC) {
      setTimeout(() => this.modules.startModule(moduleName, params, pipe, vars, ctx), TIMEOUT);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(async() => {
          return resolve(await this.modules.startModule(moduleName, params, pipe, vars, ctx));
        }, TIMEOUT);
      });
    }
  }

  /**
   * Асинхронный метод запуска последовательных модулей
   *
   * @param {object} [vars] - Глобальные переменные
   * @param {*} [pipe] - поток результата
   * @return {{result: *, vars: object}}
   */
  async init(vars = {}, pipe) {
    let result = pipe;
    vars.$BASIC = vars.$BASIC || AsyncSteps.getNewBasic();

    this.events.initSteps(result, vars);

    for (let stepIndex = 0; stepIndex < this._steps.length; stepIndex++) {
      const INDEX = stepIndex + 1;
      const DEPTH = this._currentStepDepth;
      const SCHEME = this._currentStepScheme;
      const CURRENTSTEP = this._steps[stepIndex];
      const MODULENAME = CURRENTSTEP.prefix ? `${CURRENTSTEP.prefix}/${CURRENTSTEP.module}` : CURRENTSTEP.module;
      let params, ctx, response;

      this._setPosCurrentStep(INDEX, DEPTH, SCHEME);

      ctx = new Ctx({
        sync: CURRENTSTEP.sync,
        timeout: CURRENTSTEP.timeout,
        prefix: CURRENTSTEP.prefix
      }, this.modules, this.events);

      ctx.stepIndex = INDEX;
      ctx.stepDepth = DEPTH;
      ctx._setStepScheme(SCHEME);

      vars.$BASIC.currentModule = CURRENTSTEP;
      vars.$BASIC.beforeResult = result;

      if (vars.$BASIC.setting.lodash) {
        params = utils.templateFromObj(CURRENTSTEP.params, vars);
      } else {
        params = Object.assign({}, CURRENTSTEP.params);
      }

      this._logger.info(`start step "${ctx.showStepScheme()}"`);
      this.events.startStep(result, vars, ctx);

      response = await this._startStep(MODULENAME, params, result, vars, ctx);

      if (response) {
        result = response.result !== undefined ? response.result : result;
        vars = response.vars || vars;
      }

      vars.$BASIC.currentResult = result;

      if (CURRENTSTEP.mediumRes) {
        this.events.mediumRes(CURRENTSTEP.mediumRes, result, vars, ctx);
      }

      if (typeof CURRENTSTEP.after === 'function') {
        this._logger.info(`start after "${ctx.showStepScheme()}"`);
        result = await CURRENTSTEP.after(params, result, vars, ctx) || result;
        this._logger.info(`end after "${ctx.showStepScheme()}"`);
      }

      this.events.endStep(result, vars, ctx);
      this._logger.info(`end step "${ctx.showStepScheme()}"`);
    }

    this.events.end(result, vars);

    return {result, vars};
  }
}
