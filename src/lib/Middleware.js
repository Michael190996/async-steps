import utils from '../utils';

export default class Middleware {
  constructor() {
    this._middlewares = [];
  }

  /**
   * Возвращает middleware
   *
   * @return {object} middleware
   */
  get middlewares() {
    return this._middlewares;
  }

  /**
   * @param {function} fn
   * @return Middleware
   */
  use(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('"fn" is not a function');
    }

    this._middlewares.push(fn);

    return this;
  }

  /**
   * Запускает middleware
   *
   * @param {*} [data]
   * @param {...} [args]
   * @return {Promise}
   */
  go(data, ...args) {
    const composition = utils.compose(this._middlewares);
    return composition(data, ...args);
  }
}