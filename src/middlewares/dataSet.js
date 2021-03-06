export default function (data, ns, next) {
  if (!ns.vars.check('data')) {
    ns.vars.add('data', {});
  }

  ns.events.startWare('dataSet:' + ns.name, data, ns);

  ns.vars.add('data', Object.assign(ns.vars.get('data'), {
    [ns.step.name]: data
  }));

  ns.events.endWare('dataSet:' + ns.name, data, ns);

  next();
}