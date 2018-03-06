import { TransferRecord } from './transfer.record'
import { TokenRecord } from './token.record'
import { ExternalAccountEntity } from './help/external_account_entity'
import { IssuanceRecord } from './issuance.record'
import { WithdrawalRecord } from './withdrawal.record'
import { SaleRecord } from './sale.record'
import { OfferRecord } from './offer.record'
import { MatchRecord } from './match.record'
import { AssetPairRecord } from './asset_pair.record'
import { TradeRecord } from './trade.record'

export class RecordFactory {
  static createTransferRecord () {
    return new TransferRecord(...arguments)
  }

  static createTokenRecord () {
    return new TokenRecord(...arguments)
  }

  static createExternalAccountRecord () {
    return new ExternalAccountEntity(...arguments)
  }

  static createIssuanceRecord () {
    return new IssuanceRecord(...arguments)
  }

  static createWithdrawRecord () {
    return new WithdrawalRecord(...arguments)
  }

  static createSaleRecord () {
    return new SaleRecord(...arguments)
  }

  static createOfferRecord () {
    return new OfferRecord(...arguments)
  }

  static createMatchRecord () {
    return new MatchRecord(...arguments)
  }

  static createAssetPairRecord () {
    return new AssetPairRecord(...arguments)
  }

  static createTradeRecord () {
    return new TradeRecord(...arguments)
  }
}
