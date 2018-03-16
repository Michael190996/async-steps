export default function (data, as, next) {
  const TIMEOUT = as.step.timeout;

  if (TIMEOUT !== undefined) {
    as.events.emit('startWare', 'timeout', data, as);

    setTimeout(() => {
      as.events.emit('endWare', 'timeout', data, as);
      next();
    }, TIMEOUT);
  } else {
    next();
  }
}