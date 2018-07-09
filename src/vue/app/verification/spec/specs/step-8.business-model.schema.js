import { i18n } from '../../../../../js/i18n'
import { documentTypes } from '../../../../../js/const/documents.const'

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
        "subheading": i18n.lbl_upload_doc()
      }
    ],
    [
      {
        "name": "kyc-business-model",
        "id":  "kyc-business-model",
        "label": i18n.kyc_upload_business_model(),
        "field": "file",
        "side": "front",
        "required": true,
        "type": documentTypes.kycBusinessModel,
        "validate": "required"
      }
    ]
  ]
}
