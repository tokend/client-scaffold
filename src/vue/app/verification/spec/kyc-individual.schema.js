import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

export const kycIndividualSchema = {
  "rows": [
    {
      "heading": "Personal details"
    },
    [
      {
        "model": "first_name",
        "name": "first-name",
        "id":  "kyc-first-name",
        "label": i18n.lbl_first_name(),
        "field": "text",
        "required": true,
        "validate": "required|max:30"
      },
      {
        "model": "last_name",
        "name": "last-name",
        "id":  "kyc-last-name",
        "label": i18n.lbl_last_name(),
        "field": "text",
        "required": true,
        "validate": "required|max:50"
      }
    ],
    [
      {
        "model": "date_of_birth",
        "name": "date-of-birth",
        "label": i18n.lbl_date_of_birth(),
        "id":  "kyc-date-of-birth",
        "field": "date",
        "required": true,
        "validate": "required",
        "disableAfter": new Date().toString(),
        "disableBefore": ""
      }
    ],
    {
      "heading": i18n.kyc_address_details()
    },
    [
      {
        "model": "line_1",
        "name": "line-1",
        "id":  "kyc-line-1",
        "required": true,
        "label": i18n.lbl_line_1(),
        "field": "text",
        "validate": "required|max:45"
      },
      {
        "model": "line_2",
        "name": "line-2",
        "id":  "kyc-line-2",
        "required": false,
        "label": i18n.lbl_line_2(),
        "field": "text",
        "validate": "max:45"
      }
    ],
    [
      {
        "model": "city",
        "name": "city",
        "id":  "kyc-city",
        "label": i18n.lbl_city(),
        "field": "text",
        "required": true,
        "validate": "required|max:30"
      },
      {
        "model": "country",
        "name": "country",
        "id":  "kyc-country",
        "label": i18n.lbl_country(),
        "field": "select",
        "required": true,
        "values": "countries",
        "validate": "required"
      }
    ],
    [
      {
        "model": "state",
        "name": "state",
        "id":  "kyc-state",
        "label": i18n.lbl_state(),
        "field": "text",
        "required": true,
        "validate": "required|max:30"
      },
      {
        "model": "postal_code",
        "name": "postal-code",
        "id":  "kyc-postal-code",
        "label": i18n.lbl_postal_code(),
        "field": "text",
        "required": true,
        "validate": "required|max:20"
      }
    ],
    [
      {
        "model": "id_expiration_date",
        "name": "id-exp-date",
        "id":  "kyc-id-exp-date",
        "label": i18n.lbl_id_document_exp_date(),
        "field": "date",
        "required": true,
        "disableAfter": "",
        "disableBefore": new Date().toString(),
        "validate": "required"
      }
    ]
  ],
  "docs": [
    {
      "id": "kyc-file-id",
      "type": documentTypes.kycIdDocument,
      "side": "front",
      "private": true,
      "label": i18n.lbl_kyc_id()
    },
    {
      "id": "kyc-file-poa",
      "type": documentTypes.kycProofOfAddress,
      "side": "front",
      "private": true,
      "label": i18n.lbl_kyc_proof()
    }
  ]
}
