export default class Modules {
  constructor(events, modules) {
    this._modules = {};
    this._events = events;
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

  async startModule(moduleName, _stepLvl, _stepNum, ...args) {
    if (!this._modules[moduleName]) {
      this._events.error(new Error(`Module "${moduleName}" of undefined`), _stepLvl, _stepNum);
    }

    return await this._modules[moduleName](...args, _stepLvl, _stepNum);
  }
}
