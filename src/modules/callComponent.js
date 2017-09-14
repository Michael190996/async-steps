import AsyncSteps from '../components/AsyncSteps';

/**
 * @param {string} name - имя компонента, установленного ранее {params}
 * @param {boolean} [sync] - синхронность {params}
 * @param {*} [beforeResult] - результат предыдущего модуля
 * @param {object} vars - глобальный переменные
 * @param ctx - экземпляр Ctx
 * @return {{result, vars}}
 */
export default async function ({name, sync}, beforeResult, vars, ctx) {
  if (name === undefined) {
    ctx.events.error(new Error('name of undefined'), ctx);
  }

  if (name === undefined || !vars.$componenets[name]) {
    ctx.events.error(new Error(`component "${name}" of undefined`), ctx);
  }

  const as = new AsyncSteps(vars.$componenets[name], sync);
  return await as.init(vars, beforeResult);
}