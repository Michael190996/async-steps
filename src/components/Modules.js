import log4js from 'log4js';

export default class Modules {
  constructor(events, modules = {}) {
    this._modules = {};
    this._events = events;
    this._logger = log4js.getLogger(Modules.name);
    this._logger.level = 'info';

    this.setModules(modules);
  }

  /**
   * Добавляет функцию в объект _modules
   *
   * @param {string} moduleName
   * @param {function} func
   */
  setModule(moduleName, func) {
    if (this._modules[moduleName]) {
      return this._events.error(new Error(`module "${moduleName}" is exist`));
    }

    this._logger.info(`set module "${moduleName}"`);
    this._modules[moduleName] = func;
  }

  /**
   * Добавляет функциии модулей в объект _modules
   *
   * @param {object} modules {name:func}
   */
  setModules(modules) {
    for (let i = 0, modulesName = Object.keys(modules); i < modulesName.length; i++) {
      this.setModule(modulesName[i], modules[modulesName[i]]);
    }
  }

  /**
   * Асинхронный метод, запускающий функцию из объекта _modules
   *
   * @param {string} moduleName - имя модуля
   * @param {object} params - параметры, которые использует тот или иной модуль
   * @param {*} [beforeResult] - результат предыдущего модуля
   * @param {object} vars - глобальный переменные
   * @param ctx - экземпляр Ctx
   * @return {{result, vars}} - возвращает результат модуля
   */
  async startModule(moduleName, params, beforeResult, vars, ctx) {
    if (!this._modules[moduleName]) {
      this._events.error(new Error(`Module "${moduleName}" of undefined`), ctx);
    }

    return await this._modules[moduleName](params, beforeResult, vars, ctx);
  }
}
