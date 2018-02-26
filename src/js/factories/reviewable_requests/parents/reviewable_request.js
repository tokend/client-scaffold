import { ManageAssetBuilder } from 'swarm-js-sdk'
import { initHorizonServer } from '../../../helpers/server.helper'

export class ReviewableRequest {
  constructor (record) {
    if (!record) {
      this.constructNew()
    } else {
      this.constructExisting(record)
    }
  }

  // to construct:
  constructNew () {
    this.record = {
      id: '0',
      state: '',
      reject_reason: ''
    }
    this.isNew = true
  }

  constructExisting (record) {
    this.record = { ...record, ...record.details }
    delete this.record.details
    this.typeI = this.record.request_type_i
    this.operationDetails = this.record[this.record.request_type]
    this.isNew = false
  }

  // data:

  get requestID () {
    return this.record.id
  }

  get state () {
    return this.record.request_state
  }

  set state (state) {
    this.record.request_state = state
  }

  get rejectReason () {
    return this.record.reject_reason
  }

  // actions:

  cancel () {
    const server = initHorizonServer()
    const opts = { requestID: this.requestID }
    const op = ManageAssetBuilder.cancelAssetRequest(opts)
    return server.submitOperation(op, true)
  }
}
