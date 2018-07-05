import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

export default {
  form: {
    website: '',
    companyName: '',
    industry: '',
    phoneNumber: '',
    docs: {
      [documentTypes.kycOriginationCertificate]: null
    }
  },
  requiredDocs: [documentTypes.kycOriginationCertificate],
  rows: [
    [
      {
        "heading": i18n.kyc_submit_company_documents()
      }
    ],
    [
      {
        "subheading": "All documents except the description of the business model, the company organization chart and the company website must be certified (Notarized) by an official of integrity appointed by the local government to serve the public as an impartial witness in performing a variety of official fraud-deterrent acts related to the signing of important documents."
      }
    ],
    [
      {
        "model": "website",
        "name": "company-website",
        "id":  "kyc-company-website",
        "label": "Company website",
        "field": "text",
        "required": true,
        "validate": "required"
      }
    ],
    [
      {
        "model": "companyName",
        "name": "company-name",
        "id":  "kyc-company-name",
        "label": i18n.com_name(),
        "field": "text",
        "required": true,
        "validate": "required"
      }
    ],
    [
      {
        "model": "industry",
        "name": "company-industry",
        "id":  "kyc-company-industry",
        "label": "Industry of the company",
        "field": "select",
        "required": true,
        "values": "industries",
        "validate": "required"
      }
    ],
    [
      {
        "model": "phoneNumber",
        "name": "company-phone-number",
        "id":  "company-phone-number",
        "label": "Company phone number",
        "field": "text",
        "type": "tel",
        "required": true,
        "validate": "required"
      }
    ],
    [
      {
        "name": "company-incorporation-certificate",
        "id":  "company-incorporation-certificate",
        "label": i18n.kyc_upload_origination_certificate(),
        "field": "file",
        "side": "front",
        "fileType": "image",
        "required": true,
        "type": documentTypes.kycOriginationCertificate,
        "validate": "required"
      }
    ]
  ]
}
