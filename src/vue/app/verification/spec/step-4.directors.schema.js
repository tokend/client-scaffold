import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

export default {
  form: {
    firstName: '',
    lastName: '',
    idDocumentType: '',
    idDocumentNumber: '',
    docs: {
      [documentTypes.kycIdDocument]: null
    }
  },
  requiredDocs: [documentTypes.kycIdDocument],
  rows: [
    [
      {
        "subheading": "Submit the the full KYC documents"
      }
    ],
    [
      {
        "model": "firstName",
        "name": "first-name",
        "id":  "kyc-first-name",
        "label": "First name",
        "field": "text",
        "required": true,
        "validate": "required"
      }
    ],
    [
      {
        "model": "lastName",
        "name": "last-name",
        "id":  "kyc-last-name",
        "label": "Last name",
        "field": "text",
        "required": true,
        "validate": "required"
      }
    ],
    [
      {
        "model": "idDocumentType",
        "name": "id-document-type",
        "id":  "kyc-id-document-type",
        "label": "Document type",
        "field": "select",
        "required": true,
        "values": "documentTypes",
        "validate": "required"
      }
    ],
    [
      {
        "model": "idDocumentNumber",
        "name": "id-document-number",
        "id":  "kyc-id-document-number",
        "label": "Document number",
        "field": "text",
        "type": "tel",
        "required": true,
        "validate": "required"
      }
    ],
    [
      {
        "name": "kyc-file-id",
        "id":  "kyc-file-id",
        "label": i18n.kyc_upload_id(),
        "field": "file",
        "side": "front",
        "fileType": "image",
        "required": true,
        "type": documentTypes.kycIdDocument,
        "validate": "required"
      }
    ]
  ]
}
