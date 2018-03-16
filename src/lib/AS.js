import AsyncSteps from './AsyncSteps';

export default class AS {
  constructor(stepIndex, steps, parentsAS, modular, middleware, vars, events) {
    this._step = steps[stepIndex];
    this._name = this._step.name !== undefined ? this._step.name : 'default';
    this._parents = parentsAS;
    this._stepDepth = this._parents.length;
    this._stepIndex = stepIndex;
    this._steps = steps;
    this._modular = modular;
    this._middleware = middleware;
    this._vars = vars;
    this._events = events;
    this._break = false;
  }

  /**
   * Возвращает имя текущего шага
   *
   * @return {string}
   */
  get name() {
    return this._name;
  }

  /**
   * Возвращает позицию глубины вложенности текущего шага
   *
   * @return {number}
   */
  get stepDepth() {
    return this._stepDepth;
  }

  /**
   * Возвращает индекс текущей позиции шага
   *
   * @return {number}
   */
  get stepIndex() {
    return this._stepIndex;
  }

  /**
   * Возвращает текущий шаг
   *
   * @return {object} step
   */
  get step() {
    return this._step;
  }

  /**
   * Возвращает все модули из текущей итерации
   *
   * @return {object[]} steps
   */
  get steps() {
    return this._steps;
  }

  /**
   * Возвращает цепочку родителей
   *
   * @return {Array.<AS>} - массив экземпляров класса AS
   */
  get parents() {
    return this._parents;
  }

  /**
   * Данный флаг означает, что на текущем шаге нужно прекратить итерацию по массиву steps
   *
   * @param {boolean} $break
   */
  setBreak($break) {
    this._break = $break;
  }

  /**
   * Установит флаг конца модулей
   * Данный флаг означает, что на текущем шаге нужно прекратить итерацию по массиву steps, в том числе и у родителей
   *
   * @param {boolean} $break
   */
  setBreakAll($break) {
    this._parents.concat(this).forEach((as) => {
      as.setBreak($break);
    });
  }

  /**
   * @return {boolean}
   */
  getBreak() {
    return this._break;
  }

  /**
   * Возвращает экземпляр класса Modular
   *
   * @return Modular
   */
  get modular() {
    return this._modular;
  }

  /**
   * Возвращает экземпляр класса Events
   *
   * @return Events
   */
  get events() {
    return this._events;
  }

  /**
   * Возвращает экземпляр класса Middleware
   *
   * @return Middleware
   */
  get middleware() {
    return this._middleware;
  }

  /**
   * Возвращает экземпляр класса Vars
   *
   * @return Vars
   */
  get vars() {
    return this._vars;
  }

  /**
   * Возвращает схему вызовов
   *
   * @return {string}
   */
  scheme() {
    return this._parents.concat(this).map((as) => {
      return `{index: ${as.stepIndex}, depth: ${as.stepDepth}, name: ${as.name}}`;
    }).join(' -> ');
  }

  /**
   * Возвращает новый экземпляр класса AsyncSteps на одну вложенность глубже от начального шага
   *
   * @param {object[]} steps - массив, состоящий из последовательных элементов (модулей)
   * @return AsyncSteps - возвращает новый экземпляр AsyncSteps
   */
  child(steps) {
    const PARENTSAS = this.parents.concat(this);
    const asyncSteps = new AsyncSteps(steps, this.modular, this.middleware, this.vars, this.events);
    asyncSteps.setParentsAS(PARENTSAS);

    return asyncSteps;
  }
}