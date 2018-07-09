import { i18n } from '../../../../../js/i18n'
import { documentTypes } from '../../../../../js/const/documents.const'

export default {
  form: {
    docs: {
      [documentTypes.kycProofOfAddress]: null
    }
  },
  requiredDocs: [documentTypes.kycProofOfAddress],
  rows: [
    [
      {
        "subheading": i18n.kyc_upload_address_proof()
      }
    ],
    [
      {
        "name": "kyc-address-proof",
        "id":  "kyc-address-proof",
        "label": i18n.kyc_upload_address(),
        "field": "file",
        "side": "front",
        "fileType": "image",
        "required": true,
        "type": documentTypes.kycProofOfAddress,
        "validate": "required"
      }
    ]
  ]
}
