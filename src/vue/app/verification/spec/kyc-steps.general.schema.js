import step1Schema from './general-specs/step-1.general.schema'
import step2Schema from './general-specs/step-2.address.schema'

import FinalStep from './steps/Step.General-submit'
import DefaultStep from './steps/Step.Default'
import { i18n } from '../../../../js/i18n'

export default [
  { name: 'step-1', done: false, component: DefaultStep, schema: step1Schema, label: i18n.kyc_personal_details() },
  { name: 'step-2', done: false, component: DefaultStep, schema: step2Schema, label: i18n.kyc_address_details() },
  { name: 'step-3', done: true, component: FinalStep, label: i18n.kyc_photo_verification() }
]
