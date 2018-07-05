// import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

export default {
  form: {
    docs: {
      [documentTypes.kycBusinessModel]: null
    }
  },
  requiredDocs: [documentTypes.kycBusinessModel],
  rows: [
    [
      {
        "subheading": "Please upload a proof of address document"
      }
    ],
    [
      {
        "name": "kyc-business-model",
        "id":  "kyc-business-model",
        "label": "Upload a file with the description of the business model",
        "field": "file",
        "side": "front",
        "required": true,
        "type": documentTypes.kycBusinessModel,
        "validate": "required"
      }
    ]
  ]
}
