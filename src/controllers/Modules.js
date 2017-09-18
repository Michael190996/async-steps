import log4js from 'log4js';
import utils from '../utils';

export default class Modules {
  constructor(events, modules = {}) {
    this._modules = {};
    this._events = events;
    this._logger = log4js.getLogger(Modules.name);
    this._logger.level = 'info';

    this.addModules(modules);
  }

  /**
   * Возвращает модули из указанной папки
   *
   * @param {string} dir - путь до папки
   * @param {string} prefix=false - добавляет к именам префикс `${prefix}/${moduleName}`
   * @return {object}
   */
  static getModulesFromFolder(dir, prefix = false) {
    const modules = utils.getModulesFromFolder(dir);

    if (prefix) {
      const newModules = {};
      for (let g = 0, modulesName = Object.keys(modules); g < modulesName.length; g++) {
        newModules[`${prefix}/${modulesName[g]}`] = modules[modulesName[g]];
      }

      return newModules;
    } else {
      return modules;
    }
  }

  /**
   * Добавляет функцию в объект _modules[moduleName]
   *
   * @param {string} moduleName
   * @param {function} func
   */
  addModule(moduleName, func) {
    if (this._modules[moduleName]) {
      return this._events.error(new Error(`module "${moduleName}" is exist`));
    }

    this._logger.info(`set module "${moduleName}"`);
    this._modules[moduleName] = func;
  }

  /**
   * Добавляет функциии модулей в объект _modules
   *
   * @param {{name:function}} modules
   */
  addModules(modules) {
    for (let i = 0, modulesName = Object.keys(modules); i < modulesName.length; i++) {
      this.addModule(modulesName[i], modules[modulesName[i]]);
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
