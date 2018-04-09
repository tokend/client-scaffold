export class KycTemplateParser {
  static fromTemplate (template) {
    return {
      idDocumentType: template.id_document_type || idDocumentTypes.passport,
      documents: template.documents,
      form: {
        first_name: template.first_name,
        last_name: template.last_name,
        line_1: template.address.line_1,
        line_2: template.address.line_2,
        city: template.address.city,
        country: template.address.country,
        state: template.address.state,
        postal_code: template.address.postal_code,
        id_expiration_date: template.id_expiration_date,
        date_of_birth: template.date_of_birth
      }
    }
  }

  static toTemplate () {

  }
}
