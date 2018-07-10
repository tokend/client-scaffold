import { wrapDocuments, unwrapDocuments } from '../helpers/DocumentContainer'
import _get from 'lodash/get'
export class VerificationRequestRecord {
  constructor (record = {}) {
    this._record = record
    this.first_name = record.first_name || ''
    this.last_name = record.last_name || ''
    this.line_1 = _get(record, 'address.line_1', '')
    this.line_2 = _get(record, 'address.line_2', '')
    this.city = _get(record, 'address.city', '')
    this.country = _get(record, 'address.country', '')
    this.state = _get(record, 'address.state', '')
    this.postal_code = _get(record, 'address.postal_code', '')
    this.id_expiration_date = record.id_expiration_date || null
    this.date_of_birth = record.date_of_birth || null

    this.name = record.name || ''
    this.company = record.company || ''
    this.headquarters = record.headquarters || ''
    this.industry = record.industry || ''
    this.found_date = record.found_date || null
    this.team_size = record.team_size || ''
    this.homepage = record.homepage || ''
    this.documents = wrapDocuments(record.documents)
  }
  getGeneralDetailsForSave () {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      line_1: this.address.line_1,
      line_2: this.address.line_2,
      city: this.address.city,
      country: this.address.country,
      state: this.address.state,
      postal_code: this.address.postal_code,
      id_expiration_date: this.id_expiration_date,
      date_of_birth: this.date_of_birth,
      documents: unwrapDocuments(this.documents)
    }
  }
  getCorporateDetailsForSave () {
    return {
      name: this.name,
      company: this.company,
      headquarters: this.headquarters,
      industry: this.industry,
      found_date: this.found_date,
      team_size: this.team_size,
      homepage: this.homepage,
      documents: unwrapDocuments(this.documents)
    }
  }
}
