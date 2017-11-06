import Events from 'events';

export default class extends Events {
  /**
   * @param {*} [result] - результат модуля
   * @param {object} vars - глобальные переменные
   */
  initSteps(result, vars) {
    super.emit('initSteps', result, vars);
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
   */
  end(result, vars) {
    super.emit('end', result, vars);
  }

  /**
   * промежуточный результат
   *
   * @param {string} name - результата модуля
   * @param {*} result - результат модуля
   * @param {object} vars - глобальные переменные
   * @param ctx - экземпляр Ctx
   */
  mediumRes(name, result, vars, ctx) {
    super.emit('mediumRes', name, result, vars, ctx);
  }
}