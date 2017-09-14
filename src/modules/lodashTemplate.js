import utils from '../utils/utils';

/**
 * @param {string} template - шаблон {params}
 * @param {*} [beforeResult] - результат предыдущего модуля
 * @param {object} vars - глобальный переменные
 * @param ctx - экземпляр Ctx
 * @return {{result}}
 */
export default function ({template}, beforeResult, vars, ctx) {
  if (template === undefined) {
    ctx.events.error(new Error('template of undefined'), ctx);
  }

  return {result: utils.template(template, vars)};
}