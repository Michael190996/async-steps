export default function (data, ns, next) {
  if (!ns.vars.check('data')) {
    ns.vars.add('data', {});
  }

  ns.events.startWare('dataSet.js:' + ns.name, data, ns);

  ns.vars.add('data', Object.assign(ns.vars.get('data'), {
    [ns.step.name]: data
  }));

  ns.events.endWare('dataSet.js:' + ns.name, data, ns);

  next();
}