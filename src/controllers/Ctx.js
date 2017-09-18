import AsyncSteps from './AsyncSteps';

export default class Ctx {
  constructor(steps, sync, modules, events) {
    this._stepDepth = 1;
    this._stepIndex = 1;
    this._modules = modules;
    this._events = events;
    this._sync = sync;
    this._steps = steps;
    this._prefix = '';
  }

  /**
   * Вернет префикс модуля
   *
   * @return {string} prefix
   */
  get prefix() {
    return this._prefix;
  }

  /**
   * Запишит префикс модуля prefix/moduleName
   *
   * @param {string} prefix
   */
  set prefix(prefix) {
    this._prefix = prefix;
  }

  /**
   * Вернет экземпляр класса Modules
   *
   * @return modules
   */
  get modules() {
    return this._modules;
  }

  /**
   * Вернет экземпляр класса Events
   *
   * @return events
   */
  get events() {
    return this._events;
  }

  /**
   * Записывает позицию глубины вложенности элемента (модуля) в массиве _steps
   *
   * @param {number} depth
   */
  set stepDepth(depth) {
    this._stepDepth = depth;
  }

  /**
   * Возвращает позицию глубины вложенности элемента (модуля) в массиве _steps
   *
   * @return {number} _stepDepth
   */
  get stepDepth() {
    return this._stepDepth;
  }

  /**
   * Записывает индекс текущей позиции элемента (модуля) в массиве _steps
   *
   * @param {number} index
   */
  set stepIndex(index) {
    this._stepIndex = index;
  }

  /**
   * Возвращает индекс текущей позиции элемента (модуля) в массиве _steps
   *
   * @return {number} _stepIndex
   */
  get stepIndex() {
    return this._stepIndex;
  }

  /**
   * Метод возвращает новый экземпляр класса AsyncSteps на одну вложенность глубже от начального элемента из массива _steps
   *
   * @param {object[]} steps - массив, состоящий из последовательных элементов (модулей)
   * @param {boolean} [sync] - синхронность
   * @param {string} [prefix]
   * @return AsyncSteps - вернет новый экземпляр AsyncSteps
   */
  stepsInDeep(steps, sync = false, prefix) {
    const as = new AsyncSteps(steps, sync, this._modules, this._events);
    as.ctx.stepIndex = this.stepIndex;
    as.ctx.stepDepth = this.stepDepth+1;
    as.ctx.prefix = prefix || as.ctx.prefix;

    return as;
  }
}