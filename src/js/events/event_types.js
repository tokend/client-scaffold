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

export class ShowErrorEvent extends AppEvent {
  constructor (errorMessage) {
    super('ShowError')
    this._errorMessage = errorMessage
  }

  get message () {
    return this._errorMessage
  }
}

export class ShowSuccessEvent extends AppEvent {
  constructor (successMessage) {
    super('ShowSuccess')
    this._successMessage = successMessage
  }

  get message () {
    return this._successMessage
  }
}
