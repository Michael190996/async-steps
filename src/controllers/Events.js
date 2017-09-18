import events from 'events';

export default class Events extends events {
  /**
   * @param {*} [result] - результат модуля
   * @param {object} vars - глобальные переменные
   * @param ctx - экземпляр Ctx
   */
  startSteps(result, vars, ctx) {
    super.emit('startSteps', result, vars, ctx);
  }

  /**
   * В случае если нет слушателя, то функция вернет ошибку в catch, иначе в слушатель
   *
   * @param {*} error - любая ошибка
   * @param [ctx] - экземпляр Ctx
   */
  error(error, ctx) {
    super.emit('error', error, ctx);

    if (!super.listeners('error').length) {
      throw new Error(error);
    }
  }

  /**
   * @param {*} [result] - результат модуля
   * @param {object} vars - глобальные переменные
   * @param ctx - экземпляр Ctx
   */
  endStep(result, vars, ctx) {
    super.emit('endStep', result, vars, ctx);
  }

  /**
   * @param {*} [result] - результат модуля
   * @param {object} vars - глобальные переменные
   * @param ctx - экземпляр Ctx
   */
  startStep(result, vars, ctx) {
    super.emit('startStep', result, vars, ctx);
  }

  /**
   * @param {*} [result] - результат модуля
   * @param {object} vars - глобальные переменные
   * @param ctx - экземпляр Ctx
   */
  endSteps(result, vars, ctx) {
    super.emit('endSteps', result, vars, ctx);
  }
}