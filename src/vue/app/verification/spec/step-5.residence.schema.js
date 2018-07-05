import { i18n } from '../../../../js/i18n'

export default {
  form: {
    residenceCountry: '',
    residenceCity: '',
    residenceAddress: '',
    residencePostalCode: ''
  },
  rows: [
    [
      {
        "subheading": "Please submit the following legal address information"
      }
    ],
    [
      {
        "model": "residenceCountry",
        "name": "residence-country",
        "id":  "kyc-residence-country",
        "label": i18n.lbl_country(),
        "field": "select",
        "required": true,
        "values": "countries",
        "validate": "required"
      }
    ],
    [
      {
        "model": "residenceCity",
        "name": "residence-city",
        "id":  "kyc-residence-city",
        "label": i18n.lbl_city(),
        "field": "text",
        "label": "City",
        "required": true,
        "validate": "required"
      }
    ],
    [
      {
        "model": "residenceAddress",
        "name": "residence-address",
        "id":  "kyc-residence-address",
        "required": true,
        "label": "Street name",
        "field": "text",
        "validate": "required|max:45"
      }
    ],
    [
      {
        "model": "residencePostalCode",
        "name": "residence-postal-code",
        "id":  "kyc-residence-postal-code",
        "label": i18n.lbl_postal_code(),
        "field": "text",
        "required": true,
        "validate": "required|max:20"
      }
    ]
  ]
}
