/**
 * @param {[object]} steps - массив, состоящий из последовательных элементов (модулей) {params}
 * @param {string} name - имя компонента
 * @param {*} [beforeResult] - результат предыдущего модуля
 * @param {object} vars - глобальный переменные
 * @param ctx - экземпляр Ctx
 */
export default function ({steps, name}, beforeResult, vars, ctx) {
  if (name === undefined) {
    ctx.events.error(new Error('name of undefined'), ctx);
  }

  vars.$componenets = vars.$componenets || {};

  if (vars.$componenets[name]) {
    ctx.events.error(new Error(`component "${name}" is exist`), ctx);
  } else {
    vars.$componenets[name] = steps;
  }
}