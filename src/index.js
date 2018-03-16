export const AsyncSteps = require('./lib/AsyncSteps').default;
export const Middleware = require('./lib/Middleware').default;
export const Modular = require('./lib/Modular').default;
export const Events = require('./lib/Events').default;
export const Vars = require('./lib/Vars').default;
export const AS = require('./lib/AS').default;

export const fixtures = {
  events: require('./fixtures/events').default,
  middleware: require('./fixtures/middleware').default,
  modular: require('./fixtures/modular').default
};

export default class extends AsyncSteps {
  constructor(steps, modular = fixtures.modular(), middleware = fixtures.middleware(), vars = new Vars(), events = fixtures.events()) {
    super(steps, modular, middleware, vars, events);
  }
}