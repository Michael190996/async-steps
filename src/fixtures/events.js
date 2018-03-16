import Events from '../lib/Events';

const debug = require('debug')('async-steps:fixtures');

export default function () {
  const events = new Events();

  events.on('startWare', (nameWare, data, as) => {
    debug(`startWare "${nameWare}"`);
  });

  events.on('endWare', (nameWare, data, as) => {
    debug(`endWare "${nameWare}"`);
  });

  events.on('error', (error, as) => {
    debug(error);
    debug('scheme: ' + as.scheme());
  });

  return events;
}