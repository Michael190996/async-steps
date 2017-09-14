import moduleIf from './if';

/**
 * Модуль проверки нескольких условий
 *
 * @param {[object]} conditions - условия {params}
 * @param {[object]} conditions[].steps - массив, состоящий из последовательных элементов (модулей) {params}
 * @param {boolean} [sync] - синхронность {params}
 * @param {*} [beforeResult] - результат предыдущего модуля
 * @param {object} vars - глобальный переменные
 * @param ctx - экземпляр Ctx
 * @returns {{result, vars}|*}
 */
export default async function ({conditions, sync}, beforeResult, vars, ctx) {
  let response = {result: beforeResult, vars};

  if (conditions === undefined) {
    ctx.events.error(new Error('conditions of undefined'), ctx);
  }

  for (let i = 0; i < conditions.length; i++) {
    response = await moduleIf({
      sync,
      condition: conditions[i].condition,
      steps: conditions[i].steps
    }, response.result, vars, ctx);
  }

  return response;
}