import Middleware from '../lib/Middleware';
import dataGet from './middlewares/dataGet';
import timeout from './middlewares/timeout';
import module from './middlewares/module';
import after from './middlewares/after';
import dataSet from './middlewares/dataSet';

const debug = require('debug')('async-steps:fixtures');

export default function () {
  const middleware = new Middleware();

  middleware.use(dataGet);
  debug('middleware set "data"');

  middleware.use(timeout);
  debug('middleware set "timeout"');

  middleware.use(module);
  debug('middleware set "module"');

  middleware.use(after);
  debug('middleware set "after"');

  middleware.use(dataSet);
  debug('middleware set "dataSet"');

  return middleware;
}