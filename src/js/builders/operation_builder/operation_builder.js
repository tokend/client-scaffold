import response from '../response_builder/index'
import { parseError } from '../../parsers/error.parser'
import { createTfaDialog } from '../../modals/tfa_dalog.modal'
import { initHorizonServer } from '../../../../src/js/helpers/server.helper'

export class OperationBuilder {
  constructor () {
    this.operations = []
    this.config = {}
    this.repeatDetails = {}
  }

  operation () {
    return this
  }

  add (operation) {
    if (!operation) return this
    this.operations.push(operation)
    return this
  }

  submit (source, keypair) {
    const server = initHorizonServer()
    const operations = this.operations
    return server.submitOperationGroup(operations, source, keypair)
      .then(rawResponse => response.getTransactionResponse(rawResponse))
      .catch(err => this._handleError(err))
  }

  repeat () {
    const server = initHorizonServer()
    const config = this.repeatDetails.config
    const tx = this.repeatDetails.tx
    return server.repeatTransaction(config, tx)
      .then(rawResponse => response.getTransactionResponse(rawResponse))
      .catch(err => this._handleError(err))
  }

  _handleError (error) {
    const parsedError = parseError(error)
    if (parsedError.message === 'TFA required') {
      this.repeatDetails = error.repeatDetails
      return createTfaDialog(this.repeat.bind(this), parsedError.meta)
    } else {
      return Promise.reject(parsedError)
    }
  }
}

export const operationBuilder = new OperationBuilder()
