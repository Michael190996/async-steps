import {Middleware} from 'async-steps.engine';
import path from 'path';
import AsyncStepsEngine from './lib/AsyncStepsEngine';
import Modular from './lib/Modular';
import Vars from './lib/Vars';
import Events from './lib/Events';
import config from './config';
import dataGet from './middlewares/dataSet';
import timeout from './middlewares/timeout';
import module from './middlewares/module';
import after from './middlewares/after';
import dataSet from './middlewares/dataGet';

const debug = require('debug')('async-steps:index');

function createModular(pathsToModules = []) {
  const modular = new Modular();

  const PATHSTOMODULES = pathsToModules.map((folderModules) => {
    return Object.assign({}, folderModules, {
      path: (folderModules.homeDir ? path.join(config.cwdDir, folderModules.path) : folderModules.path)
    });
  });

  for (let i = 0; i < PATHSTOMODULES.length; i++) {
    const MODULES = require(PATHSTOMODULES[i].path).default;
    const PREFIX = PATHSTOMODULES[i].prefix;

    MODULES.forEach((module) => {
      modular.add(module.name, module.fn, PREFIX);
    });
  }

  return modular;
}

function createMiddleware() {
  const middleware = new Middleware();

  middleware.use(dataGet);
  middleware.use(timeout);
  middleware.use(module);
  middleware.use(after);
  middleware.use(dataSet);

  return middleware;
}

export default function (steps, configAsyncSteps = (config.cwdPackage.asyncsteps || {})) {
  const vars = new Vars();
  const events = new Events();
  const modular = createModular(configAsyncSteps.pathsToModules);
  const middleware = createMiddleware();

  return new AsyncStepsEngine(steps, vars, modular, middleware, events);
}