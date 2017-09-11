export default class Modules {
  constructor(events, modules) {
    this._modules = {};
    this._events = events;
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
      this._events.error(new Error(`Module "${moduleName}" is exist`));
    }

    this._modules[moduleName] = func;
  }

  /**
   * Добавляет функциии модулей в объект _modules
   *
   * @param {{name:func}} modules
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
