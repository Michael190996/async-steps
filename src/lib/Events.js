import Events from 'events';

export default class extends Events {
  /**
   * @param {*} [data] - данные
   * @param {Array.<AS>} parentsAS
   */
  initSteps(data, parentsAS) {
    super.emit('initSteps', data, parentsAS);
  }

  /**
   * @param {*} error - ошибка
   * @param as - экземпляр класса AS
   */
  error(error, as) {
    super.emit('error', error, as);
  }

  /**
   * @param {*} [data] - данные
   * @param as - экземпляр класса AS
   */
  endStep(data, as) {
    super.emit('endStep', data, as);
  }

  /**
   * @param {*} [data] - данные
   * @param as - экземпляр класса AS
   */
  startStep(data, as) {
    super.emit('startStep', data, as);
  }

  /**
   * @param {*} [data] - данные
   * @param {Array.<AS>} parentsAS
   */
  endSteps(data, parentsAS) {
    super.emit('endSteps', data, parentsAS);
  }
}