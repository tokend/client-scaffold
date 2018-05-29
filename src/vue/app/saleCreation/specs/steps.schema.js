import step1Schema from './step-1.general.schema'
import step2Schema from './step-2.blurb.schema'

import DefaultStep from '../steps/Step.Default'
import GeneralStep from '../steps/Step.General'
import DescriptionStep from '../steps/Step.Description'
import { i18n } from '../../../../js/i18n'

export default [
  { name: 'step-1', done: false, component: GeneralStep, label: i18n.sale_provide_information() },
  { name: 'step-2', done: false, component: DefaultStep, schema: step2Schema, label: i18n.sale_short_blurb_step() },
  { name: 'step-3', done: true, component: DescriptionStep, label: i18n.sale_full_description() }
]
