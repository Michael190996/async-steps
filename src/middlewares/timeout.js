export default function (data, ns, next) {
  const TIMEOUT = ns.step.timeout;

  if (TIMEOUT !== undefined) {
    ns.events.emit('startWare', 'timeout', data, ns);

    setTimeout(() => {
      ns.events.emit('endWare', 'timeout', data, ns);
      next();
    }, TIMEOUT);
  } else {
    next();
  }
}