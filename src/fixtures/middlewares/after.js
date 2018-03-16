export default async function (data, as, next) {
  if (typeof as.step.after === 'function') {
    as.events.emit('startWare', 'after', data, as);

    data = await as.step.after(data, as);

    as.events.emit('endWare', 'after', data, as);
  }

  next(data);
}