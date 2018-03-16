import path from 'path';
import Modular from "../lib/Modular";
import config from "../config";

export default function () {
  const modular = new Modular();

  if (config.cwdPackage.asyncsteps.pathsToModules) {
    const PATHSTOMODULES = config.cwdPackage.asyncsteps.pathsToModules.map((folderModules) => {
      return Object.assign({}, folderModules, {
        path: (folderModules.homeDir ? path.join(config.cwdDir, folderModules.path) : folderModules.path)
      });
    });

    for (let i = 0; i < PATHSTOMODULES.length; i++) {
      const MODULES = require(PATHSTOMODULES[i].path).default;
      const PREFIX = PATHSTOMODULES[i].prefix;

      MODULES.forEach(module => modular.add(module.name, module.fn, PREFIX));
    }
  }

  return modular;
}