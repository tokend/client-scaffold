import { i18n } from '../../../../../js/i18n'
import { documentTypes } from '../../../../../js/const/documents.const'

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
        "subheading": i18n.kyc_submit_full_kyc_docs()
      }
    ],
    [
      {
        "model": "firstName",
        "name": "first-name",
        "id":  "kyc-first-name",
        "label": i18n.lbl_first_name(),
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
        "label": i18n.lbl_last_name(),
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
        "label": i18n.lbl_document_type(),
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
        "label": i18n.lbl_kyc_id(),
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
