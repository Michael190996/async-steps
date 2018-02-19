import AsyncSteps from './AsyncSteps';

export default class Ctx {
  constructor(moduleName, step, modules, events) {
    this._moduleName = moduleName;
    this._step = step;
    this._stepDepth = 1;
    this._stepIndex = 1;
    this._stepScheme = null;
    this._modules = modules;
    this._events = events;
  }

  /**
   * Вернет имя текущего модуля
   *
   * @returns {step}
   */
  get moduleName() {
    return this._moduleName;
  }

  /**
   * Вернет текущий модуль
   *
   * @returns {step}
   */
  get step() {
    return this._step;
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
   * Записывает позицию глубины вложенности элемента (модуля)
   *
   * @param {number} depth
   */
  set stepDepth(depth) {
    this._stepDepth = depth;
  }

  /**
   * Возвращает позицию глубины вложенности элемента (модуля)
   *
   * @return {number} _stepDepth
   */
  get stepDepth() {
    return this._stepDepth;
  }

  /**
   * Записывает индекс текущей позиции элемента (модуля)
   *
   * @param {number} index
   */
  set stepIndex(index) {
    this._stepIndex = index;
  }

  /**
   * Возвращает индекс текущей позиции элемента (модуля)
   *
   * @return {number} _stepIndex
   */
  get stepIndex() {
    return this._stepIndex;
  }

  /**
   * @param {string} scheme
   */
  _setStepScheme(scheme) {
    this._stepScheme = scheme;
  }

  /**
   * Возвращает схему вызовов модулей
   *
   * @return {string}
   */
  showStepScheme() {
    return (this._stepScheme ? this._stepScheme + ' -> ' : '') + this.stepIndex;
  }

  /**
   * Метод возвращает новый экземпляр класса AsyncSteps на одну вложенность глубже от начального модуля
   *
   * @param {object[]} steps - массив, состоящий из последовательных элементов (модулей)
   * @return AsyncSteps - вернет новый экземпляр AsyncSteps
   */
  stepsInDeep(steps) {
    const as = new AsyncSteps(steps, this._modules, this._events);
    as._setPosCurrentStep(this.stepIndex, this.stepDepth + 1, this.showStepScheme());

    return as;
  }
}