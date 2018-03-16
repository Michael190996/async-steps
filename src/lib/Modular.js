const debug = require('debug')('async-steps:Modular');

export default class Modular {
  constructor() {
    this._modules = {
      'default': {}
    };
  }

  /**
   * Возвращает модули
   *
   * @return {object}
   */
  get modules() {
    return this._modules;
  }

  /**
   * Добавляет модуль
   *
   * @param {string} name - имя модуля
   * @param {function} fn
   * @param {string} [prefix=default] - префикс имени
   */
  add(name, fn, prefix = 'default') {
    if (this.check(name, prefix)) {
      throw new Error(`module "${prefix}/${name}" is exist`);
    }

    if (typeof fn !== 'function') {
      throw new TypeError('"fn" is not a function');
    }

    this._modules[prefix] = this._modules[prefix] || {};
    this._modules[prefix][name] = fn;
    debug(`set module "${prefix}/${name}"`);
  }

  /**
   * Проверяет наличие модуля
   *
   * @param {string} name - имя модуля
   * @param {string} [prefix=default] - префикс имени
   * @return {boolean}
   */
  check(name, prefix = 'default') {
    return (this._modules[prefix] && this._modules[prefix][name]);
  }

  /**
   * Метод запускает модуль
   *
   * @param {string} name - имя модуля
   * @param {string} [prefix=default] - префикс имени
   * @param {...} [argsModule] - аргументы соответствующего модуля
   * @return {Promise}
   */
  async start(name, prefix = 'default', ...argsModule) {
    if (!this.check(name, prefix)) {
      throw new Error(`module "${prefix}/${name}" of undefined`);
    }

    try {
      return await this._modules[prefix][name](...argsModule);
    } catch (err) {
      throw err;
    }
  }
}
