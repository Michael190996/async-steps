export default function (data, ns, next) {
  const DATANAME = ns.step.data;

  if (DATANAME !== undefined && ns.vars.check('data')) {
    const DATA = ns.vars.get('data');
    ns.events.startWare('dataGet', data, ns);

    data = DATA[DATANAME];

    ns.events.endWare('dataGet', DATA[DATANAME], ns);
  }

  next(data);
}