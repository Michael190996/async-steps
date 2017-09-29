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

  templateFromObj(obj, vars) {
    const newObj = Object.assign({}, obj);

    for (let i = 0, keys = Object.keys(newObj); i < keys.length; i++) {
      let template = newObj[keys[i]];
      newObj[keys[i]] = this.template(template, vars);
    }

    return newObj;
  },

  getModulesFromFolder(dir) {
    const modules = {};

    try {
      const FILES = fs.readdirSync(dir);

      for (let i in FILES) {
        const _path = path.join(dir, FILES[i]);

        if (FILES[i].search(/\.js$/) != -1 && !fs.statSync(_path).isDirectory()) {
          const NAME = FILES[i].replace(/\.js$/, '');

          try {
            modules[NAME] = require(_path).default;
          } catch (err) {
            logger.info(_path, err.toString());
          }
        }
      }
    } catch (err) {
      logger.info('Modules of undefined', dir, err.toString());
    }

    return modules;
  }
}