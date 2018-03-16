export default function (data, as, next) {
  if (!as.vars.check('data')) {
    as.vars.add('data', {});
  }

  as.events.emit('startWare', 'dataSet:' + as.name, data, as);

  as.vars.add('data', Object.assign(as.vars.get('data'), {
    [as.step.name]: data
  }));

  as.events.emit('endWare', 'dataSet:' + as.name, data, as);

  next();
}