export default class Vars {
  constructor() {
    this._vars = {};
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  add(key, value) {
    this._vars[key] = value;
  }

  /**
   * @param {string} key
   */
  remove(key) {
    this._vars[key] = undefined;
  }

  /**
   * @param {string} key
   * @return {*}
   */
  get(key) {
    return this._vars[key];
  }

  /**
   * @param {string} key
   * @return {boolean}
   */
  check(key) {
    return this._vars[key] !== undefined;
  }
}