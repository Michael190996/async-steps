import AsyncSteps from './AsyncSteps';

export default class Ctx {
  constructor({sync, timeout, prefix}, modules, events) {
    this._stepDepth = 1;
    this._stepIndex = 1;
    this._stepScheme = undefined;
    this._modules = modules;
    this._events = events;
    this._sync = sync;
    this._prefix = prefix;
    this._timeout = timeout;
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
   * @return {boolean}
   */
  get sync() {
    return this._sync;
  }

  /**
   * @return {number}
   */
  get timeout() {
    return this._timeout;
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
   * @param {string} scheme
   */
  _setStepScheme(scheme) {
    this._stepScheme = scheme;
  }

  /**
   * Возвращает схему вызовов модулей
   *
   * @return {string|number}
   */
  showStepScheme() {
    if (this._stepScheme) {
      return this._stepScheme + ' -> ' + this.stepIndex;
    } else {
      return this.stepIndex;
    }
  }

  /**
   * Метод возвращает новый экземпляр класса AsyncSteps на одну вложенность глубже от начального элемента из массива _steps
   *
   * @param {object[]} steps - массив, состоящий из последовательных элементов (модулей)
   * @return AsyncSteps - вернет новый экземпляр AsyncSteps
   */
  stepsInDeep(steps) {
    const as = new AsyncSteps(steps, this._modules, this._events);
    as._setSettingCurrentStep({
      index: this.stepIndex,
      depth: this.stepDepth + 1,
      scheme: this.showStepScheme()
    });

    return as;
  }
}