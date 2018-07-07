import { wrapDocuments, unwrapDocuments } from '../../js/helpers/DocumentContainer'
export class KycCorporateRequestRecord {
  constructor (record = {}) {
    this._record = record
    this.website = record.website || ''
    this.companyName = record.company_name || ''
    this.industry = record.industry || ''
    this.phoneNumber = record.phone_number || ''
    this.country = record.country || ''
    this.city = record.city || ''
    this.street = record.street || ''
    this.postalCode = record.postal_code || ''
    this.firstName = record.first_name || ''
    this.lastName = record.last_name || ''
    this.idDocumentType = record.id_document_type || ''
    this.idDocumentNumber = record.id_document_number || ''
    this.residenceCountry = record.residence_country || ''
    this.residenceCity = record.residence_city || ''
    this.residenceAddress = record.residence_address || ''
    this.residencePostalCode = record.residence_postal_code || ''
    this.documents = wrapDocuments(record.documents)
  }
  getDetailsForSave () {
    return {
      website: this.website,
      company_name: this.companyName,
      industry: this.industry,
      phone_number: this.phoneNumber,
      country: this.country,
      city: this.city,
      street: this.street,
      postal_code: this.postalCode,
      first_name: this.firstName,
      last_name: this.lastName,
      id_document_type: this.idDocumentType,
      id_document_number: this.idDocumentNumber,
      residence_country: this.residenceCountry,
      residence_city: this.residenceCity,
      residence_address: this.residenceAddress,
      residence_postal_code: this.residencePostalCode,
      documents: unwrapDocuments(this.documents)
    }
  }
}
