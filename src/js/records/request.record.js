export class RequestRecord {
  constructor (record = {}) {
    this._record = record

    this.id = record.id || '0'
    this.requestor = record.requestor
    this.reviewer = record.reviewer
    this.reference = record.reference
    this.rejectReason = record.reject_reason
    this.hash = record.hash
    this.createdAt = record.created_at
    this.updatedAt = record.updated_at
    this.state = record.request_state
    this.stateI = record.request_state_i
  }
}
