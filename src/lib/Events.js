import {Events} from 'async-steps.engine';

export default class extends Events {
  /**
   * @param {string} nameWare
   * @param {*} data
   * @param namespace - экземпляр класса Namespace
   */
  startWare(nameWare, data, namespace) {
    this.emit('startWare', nameWare, data, namespace);
  }

  /**
   * @param {string} nameWare
   * @param {*} data
   * @param namespace - экземпляр класса Namespace
   */
  endWare(nameWare, data, namespace) {
    this.emit('endWare', nameWare, data, namespace);
  }
}