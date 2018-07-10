import step1Schema from './syndicate-specs/step-1.general.schema'
import step2Schema from './syndicate-specs/step-2.address.schema'
import step3Schema from './syndicate-specs/step-3.documents.schema'
import step4Schema from './syndicate-specs/step-4.directors.schema'
import step5Schema from './syndicate-specs/step-5.residence.schema'
import step6Schema from './syndicate-specs/step-6.address-proof.schema'
import step7Schema from './syndicate-specs/step-7.documents.schema'

import FinalStep from './steps/Step.Submit'
import DefaultStep from './steps/Step.Default'
import { i18n } from '../../../../js/i18n'

export default [
  { name: 'step-1', done: false, component: DefaultStep, schema: step1Schema, label: i18n.kyc_general_company_information() },
  { name: 'step-2', done: false, component: DefaultStep, schema: step2Schema, label: i18n.kyc_company_legal_address() },
  { name: 'step-3', done: false, component: DefaultStep, schema: step3Schema, label: i18n.kyc_company_documents() },
  { name: 'step-4', done: false, component: DefaultStep, schema: step4Schema, label: i18n.kyc_company_directors() },
  { name: 'step-5', done: false, component: DefaultStep, schema: step5Schema, label: i18n.kyc_residence_address() },
  { name: 'step-6', done: false, component: DefaultStep, schema: step6Schema, label: i18n.kyc_address_proof() },
  { name: 'step-7', done: false, component: DefaultStep, schema: step7Schema, label: i18n.kyc_documents() },
  { name: 'step-8', done: true, component: FinalStep, label: i18n.kyc_business_model() }
]
