import { i18n } from '../../../../js/i18n'

export default {
  form: {
    country: '',
    city: '',
    street: '',
    postalCode: ''
  },
  rows: [
    [
      {
        "subheading": "Please submit the following legal address information"
      }
    ],
    [
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
        "model": "city",
        "name": "city",
        "id":  "kyc-city",
        "label": i18n.lbl_city(),
        "field": "text",
        "label": "City",
        "required": true,
        "validate": "required"
      }
    ],
    [
      {
        "model": "street",
        "name": "street",
        "id":  "kyc-street",
        "required": true,
        "label": "Street name",
        "field": "text",
        "validate": "required|max:45"
      }
    ],
    [
      {
        "model": "postalCode",
        "name": "postal-code",
        "id":  "kyc-postal-code",
        "label": i18n.lbl_postal_code(),
        "field": "text",
        "required": true,
        "validate": "required|max:20"
      }
    ]
  ]
}
