import _ from 'lodash';

/**
 * Модуль цикла
 *
 * @param {number|array} condition - условие {params}
 * @param {[...object]} steps - массив, состоящий из последовательных элементов (модулей) {params}
 * @param {boolean} [sync] - синхронность {params}
 * @param {*} [beforeResult] - результат предыдущего модуля
 * @param {object} vars - глобальный переменные
 * @param ctx - экземпляр Ctx
 * @returns {{result, vars}|*}
 */
export default async function ({condition, steps, sync}, beforeResult, vars, ctx) {
  let result = undefined;

  if (condition === undefined) {
    ctx.events.error(new Error('condition, steps of undefined'), ctx);
  }

  const handler = async (index, el) => {
    vars.$currentModule.$for = {index, el};
    return await ctx.stepsInDeep(steps, sync).init(vars, beforeResult);
  };

  condition = _.template('${' + condition + '}')(vars);

  if (!isNaN(Number(condition))) {
    for (let i = 0; i < parseInt(condition); i++) {
      result = await handler(i);
    }
  } else {
    condition = new Array(condition);

    for (let i = 0; i < condition.length; i++) {
      result = await handler(i, condition[i]);
    }
  }

  return result;
}