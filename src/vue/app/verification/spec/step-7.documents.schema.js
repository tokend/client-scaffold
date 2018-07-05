import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

export default {
  form: {
    docs: {
      [documentTypes.kycMemorandium]: null,
      [documentTypes.kycSignatoriesAuthorization]: null,
      [documentTypes.kycOrganizationChart]: null
    }
  },
  requiredDocs: [documentTypes.kycProofOfAddress,
    documentTypes.kycSignatoriesAuthorization,
    documentTypes.kycOrganizationChart],
  rows: [
    [
      {
        "subheading": "Please upload a proof of address document"
      }
    ],
    [
      {
        "name": "kyc-memorandium",
        "id":  "kyc-memorandium",
        "label": i18n.kyc_upload_memorandium(),
        "field": "file",
        "side": "front",
        "fileType": "image",
        "required": true,
        "type": documentTypes.kycMemorandium,
        "validate": "required"
      }
    ],
    [
      {
        "name": "kyc-singatories-authorization",
        "id":  "kyc-singatories-authorization",
        "label": i18n.kyc_upload_signatories(),
        "field": "file",
        "side": "front",
        "fileType": "image",
        "required": true,
        "type": documentTypes.kycSignatoriesAuthorization,
        "validate": "required"
      }
    ],    [
      {
        "name": "kyc-organization-chart",
        "id":  "kyc-organization-chart",
        "label": i18n.kyc_upload_chart(),
        "field": "file",
        "side": "front",
        "required": true,
        "type": documentTypes.kycOrganizationChart,
        "validate": "required"
      }
    ]
  ]
}
