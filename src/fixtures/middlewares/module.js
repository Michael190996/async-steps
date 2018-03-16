export default async function (data, as, next) {
  const MODULENAME = as.step.module;
  const MODULEPREFIX = as.step.prefix !== undefined ? as.step.prefix : 'default';
  const PARAMS = Object.assign({}, as.step.params);

  as.events.emit('startWare', `module:${MODULEPREFIX}/${MODULENAME}`, PARAMS, data, as);
  data = await as.modular.start(MODULENAME, MODULEPREFIX, data, as);
  as.events.emit('endWare', `module:${MODULEPREFIX}/${MODULENAME}`, PARAMS, data, as);

  next(data);
}