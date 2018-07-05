// import { RequestRecord } from './request.record'
// import config from '../../config'
// import _get from 'lodash/get'
import { wrapDocuments, unwrapDocuments } from '../../js/helpers/DocumentContainer'
// import { Keypair } from 'swarm-js-sdk'
export class KycCorporateRequestRecord {
  constructor (record = {}) {
    this._record = record
    this.website = record.website || ''
    this.companyName = record.company_name || ''
    this.industry = record.industry || ''
    this.phoneNumber = record.phone_number || ''
    this.country = record.country || ''
    this.city = record.city || ''
    this.address = record.address || ''
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
    // this.kycOriginationCertificate = this._record.kyc_origination_certificate || ''
    // this.kycShareholdersCertificate = this._record.kyc_shareholders_certificate || ''
    // this.kycAnnualReport = this._record.kyc_annual_report || ''
    // this.kycIdDocument = this._record.kyc_id_document || ''
    // this.kycProofOfAddress = this._record.kyc_proof_of_address || ''
    // this.kycMemorandium = this._record.kyc_memorandium || ''
    // this.kycSignatoriesAuthorization = this._record.kyc_signatories_authorization || ''
    // this.kycOrganizationChart = this._record.kyc_organization_chart || ''
    // this.kycBusinessModel = this._record.kyc_business_model || ''
  }
  getDetailsForSave () {
    return {
      website: this.website,
      company_name: this.companyName,
      industry: this.industry,
      phone_number: this.phoneNumber,
      country: this.country,
      city: this.city,
      address: this.address,
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
      // kyc_origination_certificate: this.kycOriginationCertificate,
      // kyc_shareholders_certificate: this.kycShareholdersCertificate,
      // kyc_annual_report: this.kycAnnualReport,
      // kyc_id_document: this.kycIdDocument,
      // kyc_proof_of_address: this.kycProofOfAddress,
      // kyc_memorandium: this.kycMemorandium,
      // kyc_signatories_authorization: this.kycSignatoriesAuthorization,
      // kyc_organization_chart: this.kycOrganizationChart,
      // kyc_business_model: this.kycBusinessModel
    }
  }
}
