import fs from 'fs';
import path from 'path';
import log4js from 'log4js';

const logger = log4js.getLogger('Utils');
logger.level = 'info';

export default {
  getModulesFromFolder(dir) {
    const modules = {};

    try {
      const FILES = fs.readdirSync(dir);

      for (let i in FILES) {
        const PATH = path.join(dir, FILES[i]);

        if (FILES[i].search(/\.js$/) != -1 && !fs.statSync(PATH).isDirectory()) {
          const NAME = FILES[i].replace(/\.js$/, '');

          try {
            modules[NAME] = require(PATH).default;
          } catch (err) {
            logger.info(PATH, err.toString());
          }
        }
      }
    } catch (err) {
      logger.info('Modules of undefined', dir, err.toString());
    }

    return modules;
  }
}