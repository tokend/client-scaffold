import { documentTypes } from '../../../../js/const/documents.const'
import { i18n } from '../../../../js/i18n'

export default {
  form: {
    youtubeId: '',
    description: ''
  },
  rows: [
    [
      {
        "heading": i18n.sale_tell_about_fund()
      }
    ],
    [
      {
        "field": "text",
        "model": "youtubeId",
        "name": "video-description",
        "id":  "video-description",
        "validate": "required",
        "required": true,
        "label": i18n.sale_description_label()
      }
    ],
    [
      {
        "field": "textarea",
        "model": "description",
        "name": "project-information",
        "id":  "project-information",
        "validate": "required",
        "required": true,
        "label": i18n.sale_project_information()
      }
    ]
  ]
}
