import callComponent from './callComponent';

/**
 * @param {[string]} names - имена компонентов, установленных ранее {params}
 * @param {boolean} [sync] - синхронность {params}
 * @param {*} [beforeResult] - результат предыдущего модуля
 * @param {object} vars - глобальный переменные
 * @param ctx - экземпляр Ctx
 * @return {{result, vars}}
 */
export default async function ({names, sync}, beforeResult, vars, ctx) {
  let response = {result: beforeResult, vars};

  if (!names.length) {
    ctx.events.error(new Error('names of undefined'), ctx);
  }

  for (let i = 0; i < names.length; i++) {
    response = await callComponent({name: names[i], sync}, response.result, vars, ctx);
  }

  return response;
}