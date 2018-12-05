import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'

export class ReferenceRecord {
  constructor (record) {
    this._record = record
    this.reference = record.reference
    this.meta = record.meta
    this.counterparty = _get(record, 'meta.counterparty')
    this.creator = _get(record, 'meta.creator')
    this.dateOfBirth = _get(record, 'meta.dateOfBirth')
    this.documentType = _get(record, 'meta.documentType')
    this.mimeType = _get(record, 'meta.mimeType')
    this.fileName = _get(record, 'meta.fileName')
    this.firstName = String(_get(record, 'meta.firstName'))
    this.lastName = String(_get(record, 'meta.lastName'))
    this.mobilePhone = _get(record, 'meta.mobilePhone')
    this.serialNumber = String(_get(record, 'meta.serialNumber'))
    this.taxId = String(_get(record, 'meta.taxId'))
    this.fileKey = _get(record, 'meta.key')
    this.createdAt = record.createdAt
    this.isModified = record.isModified

    if (!_isEmpty(_get(record, 'meta.custom'))) {
      this.custom = _get(record, 'meta.custom')
    }
  }

  get isBroken () {
    return !this.fileKey ||
           !this.reference ||
            this.reference.length !== 64
  }
}