import fs from 'fs';
import path from 'path';

export default {

  /**
   * @param {string} dir
   * @return {[{fn, name}]}
   */
  getModulesFromFolder(dir) {
    const modules = [];

    try {
      const FILES = fs.readdirSync(dir);

      for (let key in FILES) {
        const PATH = path.join(dir, FILES[key]);

        if (path.extname(PATH) === '.js' && !fs.statSync(PATH).isDirectory()) {
          modules.push({
            name: path.parse(PATH).name,
            fn: require(PATH).default
          });
        }
      }
    } catch (err) {
      throw new Error(err);
    }

    return modules;
  },

  /**
   * Асинхронная труба
   * Если результат функции не определен, то результат не сохраняется
   *
   * @param {function[]} fns
   * @return {function} - composition
   */
  compose(fns) {
    return (res, ...args) => {
      return new Promise((resolve, reject) => {
        fns.reverse().reduce((prevFn, nextFn) => {
          const next = async (value) => {
            res = value !== undefined ? value : res;
            return await prevFn(res, ...args);
          };

          return async (value) => {
            try {
              res = value !== undefined ? value : res;
              return await nextFn(res, ...args, next);
            } catch (err) {
              reject(err);
            }
          }
        }, value => resolve(value))(res);
      });
    }
  }
}