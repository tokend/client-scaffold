import _get from 'lodash/get'

export class ReferenceRecord {
  constructor (record) {
    this._record = record
    this.reference = record.reference
    this.meta = record.meta
    this.counterparty = _get(record, 'meta.counterparty')
    this.creator = _get(record, 'meta.creator')
    this.dateOfBirth = _get(record, 'meta.dateOfBirth')
    this.documentType = _get(record, 'meta.documentType')
    this.documentMimeType = _get(record, 'meta.document_type')
    this.fileName = _get(record, 'meta.file_name')
    this.firstName = _get(record, 'meta.firstName')
    this.lastName = _get(record, 'meta.lastName')
    this.mobilePhone = _get(record, 'meta.mobilePhone')
    this.serialNumber = _get(record, 'meta.serialNumber')
    this.taxId = _get(record, 'meta.taxId')
  }
}
