import { RequestBuilder } from '../request_builder'

export class DepositRequestBuilder extends RequestBuilder {
  constructor (serverUrl) {
    super(serverUrl)
    this.segment = 'deposit'
  }
}
