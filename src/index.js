import path from 'path';
import Modules from './controllers/Modules';
import Events from './controllers/Events';
import AS from './controllers/AsyncSteps';
import config from './config.js';

export default AS;

export const AsyncSteps = AS;

export const asEvents = new Events();

export const asModules = new Modules(asEvents);

let importsModules = {};
let pathsToModules = [];

if (!config.cwdPackage.asyncsteps.noModulesAs) {
  importsModules = config.homePackage.asyncsteps.importsModules;
  pathsToModules = config.homePackage.asyncsteps.pathsToModules.map((el) => {
    return Object.assign(true, el, {
      path: el.homeDir ? path.join(config.homeDir, el.path) : el.path
    });
  }); // from homePackage
}

if (config.homeDir !== config.cwdDir && config.cwdPackage.asyncsteps) {
  importsModules = Object.assign(importsModules, config.cwdPackage.asyncsteps.importsModules);
  pathsToModules = pathsToModules.concat(config.cwdPackage.asyncsteps.pathsToModules.map((el) => {
    return Object.assign(true, el, {
      path: el.homeDir ? path.join(config.cwdDir, el.path) : el.path
    });
  })); // from cwdPackage
}

for (let i = 0; i < pathsToModules.length; i++) {
  if (pathsToModules[i].homeDir) {
    asModules.addModules(Modules.getModulesFromFolder(pathsToModules[i].path, pathsToModules[i].prefix));
  } else {
    asModules.addModules(require(pathsToModules[i].path).default);
  }
}

for (let i = 0, modulesName = Object.keys(importsModules); i < modulesName.length; i++) {
  asModules.addModule(modulesName[i], require(path.join(config.homeDir, importsModules[modulesName[i]])).default);
}

