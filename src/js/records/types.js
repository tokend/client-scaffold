import { TransferRecord } from './transfer.record'
import { TokenRecord } from './token.record'
import { ExternalAccountEntity } from './help/external_account_entity'
import { IssuanceRecord } from './issuance.record'
import { WithdrawalRecord } from './withdrawal.record'
import { SaleRecord } from './sale.record'
import { OfferRecord } from './offer.record'
import { MatchRecord, MatchTransaction } from './match.record'
import { TxRecord } from './tx.record'
import { AssetPairRecord } from './asset_pair.record'
import { TradeRecord } from './trade.record'

export const RecordTypes = {
  AssetPairRecord,
  TransferRecord,
  TokenRecord,
  ExternalAccountEntity,
  IssuanceRecord,
  WithdrawalRecord,
  SaleRecord,
  OfferRecord,
  MatchRecord,
  TradeRecord,
  TxRecord,
  MatchTransaction
}
