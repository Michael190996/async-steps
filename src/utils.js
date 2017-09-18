import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import log4js from 'log4js';

const logger = log4js.getLogger('Utils');
logger.level = 'info';

export default {
  template(template, vars) {
    if (typeof template !== 'string') {
      return template;
    }

    try {
      return eval(_.template(template)(vars));
    } catch (err) {
      return _.template(template)(vars);
    }
  },

  getModulesFromFolder(dir) {
    const modules = {};

    try {
      const files = fs.readdirSync(dir);

      for (let i in files) {
        const _path = path.join(dir, files[i]);

        if (files[i].search(/\.js$/) != -1 && !fs.statSync(_path).isDirectory()) {
          const name = files[i].replace(/\.js$/, '');

          try {
            modules[name] = require(_path).default;
          } catch (err) {
            logger.info(_path, err.toString());
          }
        }
      }
    } catch (err) {
      logger.info('Modules of undefined', dir);
    }

    return modules;
  }
}