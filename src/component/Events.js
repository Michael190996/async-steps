import events from 'events';

export default class Events extends events {
  startSteps(...args) {
    super.emit('startSteps', ...args);
  }

  error(...args) {
    super.emit('error', ...args);

    // fatal
    if (!super.listeners('error').length) {
      throw new Error(...args);
    }
  }

  listen(...args) {
    super.emit('listen', ...args);
  }

  endSteps(...args) {
    super.emit('endSteps', ...args);
  }
}