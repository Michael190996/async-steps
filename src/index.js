import path from 'path';
import log4js from 'log4js';
import Modules from './components/Modules';
import Events from './components/Events';
import AS from './components/AsyncSteps';
import utils from './utils/utils';
import config from './config.js';

export default AS;

export const AsyncSteps = AS;

export const asEvents = new Events();

export const asModules = new Modules(asEvents);

const logger = log4js.getLogger('Index');
logger.level = 'info';

let pathsToModules = config.homePackage.asyncsteps.pathsToModules;
let importsModules = config.homePackage.asyncsteps.importsModules;

if (config.homeDir !== config.cwdDir && config.cwdPackage.asyncsteps) {
  pathsToModules = pathsToModules.concat(config.cwdPackage.asyncsteps.pathsToModules);
  importsModules = Object.assign(importsModules, config.cwdPackage.asyncsteps.importsModules);
}

for (let i = 0; i < pathsToModules.length; i++) {
  let modules = {};

  if (pathsToModules[i].homeDir) {
    modules = utils.getModulesFromFolder(path.join(config.homeDir, pathsToModules[i].path));
  } else {
    modules = require(pathsToModules[i].path).default;
  }

  if (pathsToModules[i].prefix) {
    const newModules = {};
    for (let g = 0, modulesName = Object.keys(modules); g < modulesName.length; g++) {
      newModules[`${pathsToModules[i].prefix}/${modulesName[g]}`] = modules[modulesName[g]];
    }

    modules = newModules;
  }

  asModules.setModules(modules);
}

for (let i = 0, modulesName = Object.keys(importsModules); i < modulesName.length; i++) {
  asModules.setModule(modulesName[i], require(path.join(config.homeDir, importsModules[modulesName[i]])).default);
}

