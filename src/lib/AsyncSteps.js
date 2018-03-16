import Middleware from './Middleware';
import Modular from './Modular';
import Events from './Events';
import Vars from './Vars';
import AS from './AS';

const debug = require('debug')('async-steps:AsyncSteps');

export default class AsyncSteps {
  constructor(steps, modular = new Modular(), middleware = new Middleware(), vars = new Vars(), events = new Events()) {
    if (!Array.isArray(steps)) {
      throw new TypeError('steps is not Array');
    }

    this._steps = steps;
    this._modular = modular;
    this._events = events;
    this._middleware = middleware;
    this._vars = vars;
    this._parentsAS = [];
  }

  /**
   * Возвращает экземпляр класса Vars
   *
   * @return Vars
   */
  get vars() {
    return this._vars;
  }

  /**
   * Возвращает экземпляр класса Modular
   *
   * @return Modular
   */
  get modular() {
    return this._modular;
  }

  /**
   * Возвращает экземпляр класса Events
   *
   * @return Events
   */
  get events() {
    return this._events;
  }

  /**
   * Возвращает экземпляр класса Middleware
   *
   * @return Use
   */
  get middleware() {
    return this._middleware;
  }

  /**
   * @param {Array.<AS>} parentsAS
   */
  setParentsAS(parentsAS) {
    if (!Array.isArray(parentsAS)) {
      throw new TypeError('parents is not Array');
    }

    this._parentsAS = parentsAS;
  }

  /**
   * @param {*} data
   * @param as - экземпляр класса AS
   * @return {Promise}
   */
  async startStep(data, as) {
    debug(`start step "${as.scheme()}"`);
    this.events.startStep(data, as);

    data = await this.middleware.go(data, as);

    debug(`end step "${as.scheme()}"`);
    this.events.endStep(data, as);

    return data;
  }

  /**
   * Метод запускает последовательно шаги
   *
   * @param {*} [data] - данные
   * @return {Promise}
   */
  async run(data) {
    const promises = [];
    let result = data;

    debug('initSteps');
    this.events.initSteps(result, this._parentsAS);

    for (let i = 0; i < this._steps.length; i++) {
      const as = new AS(i, this._steps, this._parentsAS, this.modular, this.middleware, this.vars, this.events);
      let response;

      if (as.step.initData === true) {
        result = data;
      }

      try {
        const startStep = this.startStep(result, as);

        if (!as.step.sync) {
          response = await startStep;
          result = response || result;
        }

        promises.push(startStep);
      } catch (err) {
        this.events.error(err, as);

        if (typeof as.step.throw === 'function') {
          result = (await as.step.throw(err, as)) || result;
        }
      }

      if (as.getBreak()) {
        break;
      }
    }

    const RESULTS = await Promise.all(promises);
    this.events.endSteps(RESULTS, this._parentsAS);

    debug('endSteps');
    return result;
  }
}