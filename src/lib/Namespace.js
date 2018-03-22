import {Namespace} from 'async-steps.engine';
import AsyncStepsEngine from './AsyncStepsEngine';

export default class extends Namespace {
  constructor(stepIndex, steps, parentsNamespace, modular, middleware, vars, events) {
    super(stepIndex, steps, parentsNamespace, middleware, events);
    this._modular = modular;
    this._vars = vars;
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
   * Возвращает экземпляр класса Vars
   *
   * @return Vars
   */
  get vars() {
    return this._vars;
  }

  /**
   * Возвращает новый экземпляр класса AsyncStepsEngine на одну вложенность глубже от начального шага
   *
   * @param {object[]} steps - массив, состоящий из последовательных элементов (модулей)
   * @return AsyncStepsEngine - экземпляр класса AsyncStepsEngine
   */
  child(steps) {
    const PARENTSNAMESPACE = this.parents.concat(this);
    const asyncStepsEngine = new AsyncStepsEngine(steps, this.vars, this.modular, this.middleware, this.events);
    asyncStepsEngine.setParentsNamespace(PARENTSNAMESPACE);

    return asyncStepsEngine;
  }
}