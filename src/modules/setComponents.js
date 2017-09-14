import setComponent from './setComponent';

/**
 * @param {[object]} components - компоненты {params}
 * @param {*} [beforeResult] - результат предыдущего модуля
 * @param {object} vars - глобальный переменные
 * @param ctx - экземпляр Ctx
 */
export default async function ({components}, beforeResult, vars, ctx) {
  if (!components.length) {
    ctx.events.error(new Error('components of undefined'), ctx);
  }

  for (let i = 0; i < components.length; i++) {
    setComponent(components[i], beforeResult, vars, ctx);
  }
}