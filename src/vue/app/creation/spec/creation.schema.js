import { i18n } from '../../../../js/i18n'
import { documentTypes } from '../../../../js/const/documents.const'

export const kycIndividualSchema = {
  "rows": [
    [
      {
        "model": "token-name",
        "name": "token-name",
        "id":  "token-name",
        "label": i18n.lbl_token_name(),
        "field": "text",
        "required": true,
        "validate": "required|max:30"
      },
      {
        "model": "token-code",
        "name": "token-code",
        "id":  "token-code",
        "label": i18n.lbl_token_code(),
        "field": "text",
        "required": true,
        "validate": "required|max:50"
      }
    ]
  ],
  "docs": [
    {
      "id": "token-icon",
      "type": documentTypes.tokenIcon,
      "side": "front",
      "private": false,
      "label": i18n.lbl_token_icon(),
      "validate": "required"
    }
  ]
}
