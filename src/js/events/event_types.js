export class AppEvent {
  constructor (type, payload = '') {
    this.type = type
    this._payload = payload
  }

  get message () {
    return ''
  }

  get payload () {
    return this._payload
  }
}
