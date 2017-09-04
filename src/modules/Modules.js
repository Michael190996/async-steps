import modules from './config';

class Modules {
  constructor(modules) {
    this._modules = {};
    this.setModules(modules);
  }

  setModule(name, func) {
    this._modules[name] = func;
  }

  setModules(modules) {
    for (let i = 0, modulesName = Object.keys(modules); i < modulesName.length; i++) {
      this.setModule(modulesName[i], modules[modulesName[i]]);
    }
  }

  async startModule(moduleName, params, beforeResult, vars, events) {
    if (!this._modules[moduleName]) {
      throw new Error(`Module "${moduleName}" of undefined`);
    }

    return await this._modules[moduleName](params, beforeResult, vars, events);
  }
}

export default new Modules(modules);
