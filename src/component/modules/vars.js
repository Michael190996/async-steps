import _ from 'lodash';

/**
 * Модуль инициализации переменных
 *
 * @param {array|[{var:value}]} init - переменные и их значения {params}
 * @param {*} [beforeResult] - результат предыдущего модуля
 * @param {object} vars - глобальный переменные
 * @param ctx - экземпляр Ctx
 * @returns {{result, vars}|*}
 */
export default function({init}, beforeResult, vars, ctx) {
  if (!init) {
    ctx.events.error(new Error('init of undefined'), ctx);
  }

  if (Array.isArray(init)) {
    for (let g = 0; g < init.length; g++) {
      for (let i = 0, keys = Object.keys(init[g]); i < keys.length; i++) {
        vars[keys[i]] = eval(_.template('${' + init[g][keys[i]] + '}')(vars));
      }
    }
  } else {
    for (let i = 0, keys = Object.keys(init); i < keys.length; i++) {
      vars[keys[i]] = eval(_.template('${' + init[keys[i]] + '}')(vars));
    }
  }
}