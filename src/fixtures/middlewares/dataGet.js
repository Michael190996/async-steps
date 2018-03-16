export default function (data, as, next) {
  const DATA = as.vars.get('data');
  const DATANAME = as.step.data;

  if (DATANAME !== undefined) {
    as.events.emit('startWare', 'dataGet', data, as);

    data = DATA[DATANAME];

    as.events.emit('endWare', 'dataGet', DATA[DATANAME], as);
  }

  next(data);
}