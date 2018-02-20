import path from 'path';
import Modules from './lib/Modules';
import Events from './lib/Events';
import AS from './lib/AsyncSteps';
import config from './config.js';

export default AS;

export const AsyncSteps = AS;

export const asEvents = new Events();

export const asModules = new Modules();

const IMPORTSMODULES = config.cwdPackage.asyncsteps.importsModules;
let pathsToModules = config.cwdPackage.asyncsteps.pathsToModules;

if (pathsToModules) {
  pathsToModules = pathsToModules.map((el) => {
    return Object.assign(true, el, {
      path: el.homeDir ? path.join(config.cwdDir, el.path) : el.path
    });
  });

  for (let i = 0; i < pathsToModules.length; i++) {
    const MODULES = require(pathsToModules[i].path).default;

    try {
      asModules.addModules(MODULES, pathsToModules[i].prefix);
    } catch (err) {
      console.error(new Error(err));
    }
  }
}

if (IMPORTSMODULES) {
  for (let i = 0, modulesName = Object.keys(IMPORTSMODULES); i < modulesName.length; i++) {
    const MODULE = require(path.join(config.homeDir, IMPORTSMODULES[modulesName[i]])).default;

    try {
      asModules.addModule(modulesName[i], MODULE);
    } catch (err) {
      console.error(new Error(err));
    }
  }
}

