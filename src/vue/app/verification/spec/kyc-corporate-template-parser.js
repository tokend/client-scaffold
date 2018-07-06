export class KycCorporateTemplateParser {
  static fromTemplate (template) {
    return {
      website: template.website,
      company_name: template.companyName,
      industry: template.industry,
      phone_number: template.phoneNumber,
      country: template.country,
      city: template.city,
      street: template.street,
      postal_code: template.postalCode,
      first_name: template.firstName,
      last_name: template.lastName,
      id_document_type: template.idDocumentType,
      id_document_number: template.idDocumentNumber,
      residence_country: template.residenceCountry,
      residence_city: template.residenceCity,
      residence_address: template.residenceAddress,
      residence_postal_code: template.residencePostalCode
    }
  }

  static toTemplate (form) {
    return {
      website: form.website,
      companyName: form.company_name,
      industry: form.industry,
      phoneNumber: form.phone_number,
      country: form.country,
      city: form.city,
      street: form.street,
      postalCode: form.postal_code,
      firstName: form.first_name,
      lastName: form.last_name,
      idDocumentType: form.id_document_type,
      idDocumentNumber: form.id_document_number,
      residenceCountry: form.residence_country,
      residenceCity: form.residence_city,
      residenceAddress: form.residence_address,
      residencePostalCode: form.residence_postal_code
    }
  }

  static getSaveableDocuments (documents) {
    const result = {}
    console.log(Object.entries(documents))
    for (const [type, doc] of Object.entries(documents)) {
      // result[type] = {}
      result[type] = doc.getDetailsForSave()
      // if (front) {
      //   result[type].front = front.getDetailsForSave()
      // }
      // if (back) {
      //   result[type].back = back.getDetailsForSave()
      // }
    }
    return result
  }
}
