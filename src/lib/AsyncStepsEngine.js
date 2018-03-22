import AsyncStepsEngine, {Middleware} from 'async-steps.engine';
import Events from './Events';
import Modular from './Modular';
import Vars from './Vars';
import Namespace from './Namespace';

export default class extends AsyncStepsEngine {
  constructor(steps, vars = new Vars(), modular = new Modular(), middleware = new Middleware(), events = new Events()) {
    super(steps, middleware, events);
    this._modular = modular;
    this._vars = vars;
  }

  /**
   * Возвращает экземпляр класса Modular
   *
   * @return modular
   */
  get modular() {
    return this._modular;
  }

  /**
   * Возвращает экземпляр класса Vars
   *
   * @return vars
   */
  get vars() {
    return this._vars;
  }

  /**
   * @param {number} indexStep
   * @return namespace - экземпляр класса Namespace
   */
  createNamespace(indexStep) {
    return new Namespace(indexStep, this._steps, this._parentsNamespace, this._modular, this._middleware, this._vars, this._events);
  }
}