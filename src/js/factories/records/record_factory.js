import { TransferRecord } from './modules/tx/transfer.record'
import { TokenRecord } from './modules/token.record'
import { ExternalAccountEntity } from './help/external_account_entity'
import { IssuanceRecord } from './modules/tx/issuance.record'
import { WithdrawalRecord } from './modules/tx/withdraw.record'
import { SaleRecord } from './modules/sale.record'
import { OfferRecord } from './modules/offer.record'
import { MatchRecord } from './modules/tx/match.record'
import { AssetPairRecord } from './modules/asset_pair.record'
import { TradeRecord } from './modules/trade.record'

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
