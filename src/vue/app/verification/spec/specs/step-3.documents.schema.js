import { i18n } from '../../../../../js/i18n'
import { documentTypes } from '../../../../../js/const/documents.const'

export default {
  form: {
    docs: {
      [documentTypes.kycShareholdersCertificate]: null,
      [documentTypes.kycAnnualReport]: null
    }
  },
  requiredDocs: [documentTypes.kycShareholdersCertificate,
                documentTypes.kycAnnualReport],
  rows: [
    [
      {
        "subheading": i18n.kyc_submit_docs()
      }
    ],
    [
      {
        "subheading": i18n.kyc_upload_audited_copy()
      }
    ],
    [
      {
        "name": "company-shareholders-certificate",
        "id":  "company-shareholders-certificate",
        "label": i18n.kyc_upload_certificate_of_shareholders(),
        "field": "file",
        "side": "front",
        "fileType": "image",
        "required": true,
        "type": documentTypes.kycShareholdersCertificate,
        "validate": "required"
      }
    ],
    [
      {
        "name": "company-annual-report",
        "id":  "company-annual-report",
        "label": i18n.kyc_upload_annual_report(),
        "field": "file",
        "side": "front",
        "fileType": "image",
        "required": true,
        "type": documentTypes.kycAnnualReport,
        "validate": "required"
      }
    ]
  ]
}
