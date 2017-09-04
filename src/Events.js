import events from 'events';

class Events extends events {
  startSteps(...args) {
    super.emit('startSteps', ...args);
  }

  error(...args) {
    super.emit('err', ...args);
  }

  listen(...args) {
    super.emit('listen', ...args);
  }

  endSteps(...args) {
    super.emit('endSteps', ...args);
  }
}

export default new Events();