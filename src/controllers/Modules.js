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
   * @param {string} prefix - добавляет к именам префикс `${prefix}/${moduleName}`
   * @return {object}
   */
  static getModulesFromFolder(dir, prefix) {
    const MODULES = utils.getModulesFromFolder(dir);

    if (prefix) {
      const newModules = {};
      
      for (let g = 0, modulesName = Object.keys(MODULES); g < modulesName.length; g++) {
        const NAME = `${prefix}/${modulesName[g]}`;

        newModules[NAME] = MODULES[modulesName[g]];
      }

      return newModules;
    } else {
      return MODULES;
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
   * @param {{name: function}} modules
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
   * @param {*} [pipe] - поток результата
   * @param {object} vars - глобальный переменные
   * @param ctx - экземпляр Ctx
   * @return {{result, vars}} - возвращает результат модуля
   */
  async startModule(moduleName, params, pipe, vars, ctx) {
    if (!this._modules[moduleName]) {
      this._events.error(new Error(`Module "${moduleName}" of undefined`), ctx);
    }

    try {
      return await this._modules[moduleName](params, pipe, vars, ctx);
    } catch (err) {
      this._events.error(new Error(err), ctx);
    }
  }
}
