import _ from 'lodash';

/**
 * Модуль проверки
 *
 * @param {string|boolean|number} condition - условие {params}
 * @param {[object]} steps - массив, состоящий из последовательных элементов (модулей) {params}
 * @param {boolean} [sync] - синхронность {params}
 * @param {*} [beforeResult] - результат предыдущего модуля
 * @param {object} vars - глобальный переменные
 * @param ctx - экземпляр Ctx
 * @returns {{result, vars}|*}
 */
export default async function ({condition, steps, sync}, beforeResult, vars, ctx) {
  if (condition === undefined) {
    ctx.events.error(new Error('condition of undefined'), ctx);
  }

  const is = eval(_.template('${' + condition + '} ? true : false')(vars));

  if (is) {
    return await ctx.stepsInDeep(steps, sync).init(vars, beforeResult);
  }
}