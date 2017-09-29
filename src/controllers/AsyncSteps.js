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
   * @param {number} index
   * @param {number} depth
   * @param {string|number} scheme
   */
  _setSettingCurrentStep({index, depth, scheme}) {
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
   * @returns {{currentModule: null, beforeResult: null, currentResult: null, setting: {lodash: boolean}}}
   */
  getNewBasic() {
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
   * Метод запускает модуль
   * !!! модуль может вызывать под модули
   *
   * @param {string} moduleName - имя модуля
   * @param {object} params - параметры
   * @param {*} [beforeResult] - предыдущий результат модуля
   * @param {object} vars - глобальные переменные
   * @param ctx - экземпляр класса Ctx
   * @return {{vars, result}|*}
   */
  async _startStep(moduleName, params, beforeResult, vars, ctx) {
    const SYNC = ctx.sync;
    const TIMEOUT = ctx.timeout;

    if (!TIMEOUT) {
      if (SYNC) {
        return this.modules.startModule(moduleName, params, beforeResult, vars, ctx);
      } else {
        return await this.modules.startModule(moduleName, params, beforeResult, vars, ctx);
      }
    }

    if (SYNC) {
      setTimeout(() => this.modules.startModule(moduleName, params, beforeResult, vars, ctx), TIMEOUT);
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(async() => {
          return resolve(await this.modules.startModule(moduleName, params, beforeResult, vars, ctx));
        }, TIMEOUT);
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
    vars.$BASIC = vars.$BASIC || this.getNewBasic();

    let result = beforeResult;

    this.events.initSteps(beforeResult, vars);

    for (let stepIndex = 0; stepIndex < this._steps.length; stepIndex++) {
      const INDEX = stepIndex + 1;
      const DEPTH = this._currentStepDepth;
      const SCHEME = this._currentStepScheme;
      const CURRENTSTEP = this._steps[stepIndex];
      const MODULENAME = CURRENTSTEP.prefix ? `${CURRENTSTEP.prefix}/${CURRENTSTEP.module}` : CURRENTSTEP.module;

      let params = null;
      if (vars.$BASIC.setting.lodash) {
        params = utils.templateFromObj(CURRENTSTEP.params, vars);
      } else {
        params = Object.assign({}, CURRENTSTEP.params);
      }

      this._setSettingCurrentStep({
        index: INDEX,
        depth: DEPTH,
        scheme: SCHEME
      });

      const ctx = new Ctx({
        sync: CURRENTSTEP.sync,
        timeout: CURRENTSTEP.timeout,
        prefix: CURRENTSTEP.prefix
      }, this.modules, this.events);

      ctx.stepIndex = INDEX;
      ctx.stepDepth = DEPTH;
      ctx._setStepScheme(SCHEME);

      vars.$BASIC.currentModule = CURRENTSTEP;
      vars.$BASIC.beforeResult = result;

      if (typeof CURRENTSTEP.before === 'function') {
        const _result = await CURRENTSTEP.before(params, result, vars, ctx);
        result = _result !== undefined ? _result : result;
      }

      this._logger.info(`start step ${ctx.stepIndex}:${ctx.stepDepth}, scheme "${ctx.showStepScheme()}"`);
      this.events.startStep(result, vars, ctx);

      const response = await this._startStep(MODULENAME, params, result, vars, ctx);

      if (response) {
        result = response.result !== undefined ? response.result : result;
        vars = response.vars || vars;
      }

      const _result = utils.template(CURRENTSTEP.result, vars);
      result = _result !== undefined ? _result : result;

      vars.$BASIC.currentResult = result;

      if (typeof CURRENTSTEP.after === 'function') {
        const _result = await CURRENTSTEP.after(params, result, vars, ctx);
        result = _result !== undefined ? _result : result;
      }

      this.events.endStep(result, vars, ctx);
      this._logger.info(`end step ${ctx.stepIndex}:${ctx.stepDepth}, scheme "${ctx.showStepScheme()}"`);
    }

    this.events.end(result, vars);

    return {result, vars};
  }
}
