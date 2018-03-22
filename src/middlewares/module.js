export default async function (data, ns, next) {
  const MODULENAME = ns.step.module;
  const MODULEPREFIX = ns.step.prefix !== undefined ? ns.step.prefix : 'default';
  const PARAMS = Object.assign({}, ns.step.params);

  ns.events.startWare(`module:${MODULEPREFIX}/${MODULENAME}`, data, ns);
  data = await ns.modular.start(MODULENAME, MODULEPREFIX, PARAMS, data, ns);
  ns.events.endWare(`module:${MODULEPREFIX}/${MODULENAME}`, data, ns);

  next(data);
}