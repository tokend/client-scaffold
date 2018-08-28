import { i18n } from '../../js/i18n'

const FEE_TYPE = {
  0: i18n.fees_payment_fee(),
  1: i18n.fees_offer_fee(),
  2: i18n.fees_withdrawal_fee(),
  3: i18n.fees_issuance_fee(),
  4: i18n.fees_invest_fee()
}

const SUBTYPE_TYPE = {
  0: i18n.fees_incoming_outgoing(),
  1: i18n.fees_outgoing(),
  2: i18n.fees_incoming()
}

export function localizeFeeType (type) {
  return FEE_TYPE[type + '']
}

export function localizeSubtype (type) {
  return SUBTYPE_TYPE[type + '']
}
