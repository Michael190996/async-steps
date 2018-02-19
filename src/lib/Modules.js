import log4js from 'log4js';
import utils from '../utils';

export default class Modules {
  constructor(modules = {}) {
    this._modules = {};
    this._logger = log4js.getLogger(Modules.name);
    this._logger.level = 'info';

    this.addModules(modules);
  }

  /**
   * Возвращает модули из указанной папки
   *
   * @param {string} dir - путь до папки
   * @return {object}
   */
  static getModulesFromFolder(dir) {
    return utils.getModulesFromFolder(dir);
  }

  /**
   * Добавляет функцию в объект _modules[moduleName]
   *
   * @param {string} moduleName
   * @param {function} func
   * @param {string} [prefix] - добавляет к именам префикс `${prefix}/${moduleName}`
   */
  addModule(moduleName, func, prefix) {
    const MODULENAME = (prefix ? prefix + '/' : '') + moduleName;

    if (this._modules[MODULENAME]) {
      throw new Error(`module "${MODULENAME}" is exist`);
    }

    this._logger.info(`set module "${MODULENAME}"`);
    this._modules[MODULENAME] = func;
  }

  /**
   * Добавляет функциии модулей в объект _modules
   *
   * @param {{name: function}} modules
   * @param {string} [prefix] - добавляет к именам префикс `${prefix}/${moduleName}`
   */
  addModules(modules, prefix) {
    if (typeof modules !== 'object' || Array.isArray(modules)) {
      throw new Error(`"modules" is not object`);
    }

    for (let i = 0, modulesName = Object.keys(modules); i < modulesName.length; i++) {
      this.addModule(modulesName[i], modules[modulesName[i]], prefix);
    }
  }

  /**
   * Асинхронный метод, запускающий функцию из объекта _modules
   *
   * @param {string} moduleName - имя модуля
   * @param {object} params - параметры, которые использует тот или иной модуль
   * @param {*} [data] - данные
   * @param {object} vars - глобальный переменные
   * @param ctx - экземпляр Ctx
   * @return {{result, vars}} - возвращает результат модуля
   */
  startModule(moduleName, params, data, vars, ctx) {
    return new Promise(async (resolve, reject) => {
      if (!this._modules[moduleName]) {
        reject(`Module "${moduleName}" of undefined`);
      }

      try {
        const response = await this._modules[moduleName](params, data, vars, ctx);
        resolve(response);
      } catch(err) {
        reject(err);
      }
    });
  }
}
