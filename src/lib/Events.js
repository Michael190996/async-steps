import {Events} from 'async-steps.engine';

const debug = require('debug')('async-steps:Events');

export default class extends Events {
  /**
   * @param {string} nameWare
   * @param {*} data
   * @param namespace - экземпляр класса Namespace
   */
  startWare(nameWare, data, namespace) {
    debug('startWare', nameWare);

    this.emit('startWare', nameWare, data, namespace);
  }

  /**
   * @param {string} nameWare
   * @param {*} data
   * @param namespace - экземпляр класса Namespace
   */
  endWare(nameWare, data, namespace) {
    debug('endWare', nameWare);

    this.emit('endWare', nameWare, data, namespace);
  }
}