import _ from 'lodash';

/**
 * Модуль цикла
 *
 * @param {number|array} condition - условие {params}
 * @param {[object]} steps - массив, состоящий из последовательных элементов (модулей) {params}
 * @param {boolean} [sync] - синхронность {params}
 * @param {*} [beforeResult] - результат предыдущего модуля
 * @param {object} vars - глобальный переменные
 * @param ctx - экземпляр Ctx
 * @return {{result, vars}}
 */
export default async function ({condition, steps, sync}, beforeResult, vars, ctx) {
  let response = {result: beforeResult, vars};

  if (condition === undefined) {
    ctx.events.error(new Error('condition of undefined'), ctx);
  }

  const handler = async (index, el) => {
    vars.$BASIC.$forPath = vars.$BASIC.$forPath || {};
    vars.$BASIC.$for = vars.$BASIC.$forPath;
    vars.$BASIC.$for.$for = {index, el};
    vars.$BASIC.$for = vars.$BASIC.$for.$for;

    const _response = await ctx.stepsInDeep(steps, sync).init(vars, beforeResult);
    vars.$BASIC.$forPath = undefined;

    return _response;
  };

  condition = _.template('${' + condition + '}')(vars);

  if (!isNaN(Number(condition))) {
    for (let i = 0; i < parseInt(condition); i++) {
      response = await handler(i + 1);
    }
  } else {
    condition = new Array(condition);

    for (let i = 0; i < condition.length; i++) {
      response = await handler(i + 1, condition[i]);
    }
  }

  return response;
}