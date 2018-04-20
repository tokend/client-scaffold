export class KycTemplateParser {
  static fromTemplate (template) {
    return {
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

  static toTemplate (form) {
    return {
      first_name: form.first_name,
      last_name: form.last_name,
      date_of_birth: form.date_of_birth,
      id_expiration_date: form.id_expiration_date,
      address: {
        line_1: form.line_1,
        line_2: form.line_2,
        city: form.city,
        country: form.country,
        state: form.state,
        postal_code: form.postal_code
      }
    }
  }

  static getSaveableDocuments (documents) {
    const result = {}
    console.log(Object.entries(documents))
    for (const [type, { front, back }] of Object.entries(documents)) {
      result[type] = {}
      if (front) {
        result[type].front = front.getDetailsForSave()
      }
      if (back) {
        result[type].back = back.getDetailsForSave()
      }
    }
    return result
  }
}