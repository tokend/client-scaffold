import { TransferRecord } from './transfer.record'
import { TokenRecord } from './token.record'
import { ExternalAccountEntity } from './help/external_account_entity'
import { IssuanceRecord } from './issuance.record'
import { WithdrawalRecord } from './withdraw.record'
import { SaleRecord } from './sale.record'
import { OfferRecord } from './offer.record'
import { MatchRecord, MatchTransaction } from './match.record'
import { TxRecord } from './tx.record'

export const RecordTypes = {
  TransferRecord,
  TokenRecord,
  ExternalAccountEntity,
  IssuanceRecord,
  WithdrawRecord: WithdrawalRecord,
  SaleRecord,
  OfferRecord,
  MatchRecord,
  TxRecord,
  MatchTransaction
}
