import { TransferRecord } from './modules/tx/transfer.record'
import { TokenRecord } from './modules/token.record'
import { ExternalAccountEntity } from './help/external_account_entity'
import { IssuanceRecord } from './modules/tx/issuance.record'
import { WithdrawalRecord } from './modules/tx/withdraw.record'
import { SaleRecord } from './modules/sale.record'
import { OfferRecord } from './modules/offer.record'
import { MatchRecord, MatchTransaction } from './modules/tx/match.record'
import { TxRecord } from './modules/tx/tx.record'

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
