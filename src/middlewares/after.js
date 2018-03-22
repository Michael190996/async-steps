export default async function (data, ns, next) {
  if (typeof ns.step.after === 'function') {
    ns.events.startWare('after', data, ns);

    data = await ns.step.after(data, ns);

    ns.events.endWare('after', data, ns);
  }

  next(data);
}