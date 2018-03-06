import { ASSET_PAIR_POLICIES } from '../const/xdr.const'

export class AssetPairRecord {
  constructor (record) {
    this._record = record
    this.base = record.base
    this.quote = record.quote
    this.currentPrice = record.current_price
    this.physicalPrice = record.physical_price
    this.physicalPriceCorrection = record.physical_price_correction
    this.maxPriceStep = record.max_price_step
    this.policy = record.policy
    this.policies = record.policies

    // TODO: left for backwards compatibility, find usages and replace:
    this.current_price = record.current_price
    this.physical_price_correction = record.physical_price_correction
    this.physical_price = record.physical_price
    this.max_price_step = record.max_price_step
  }

  get isTradable () {
    if (!this.policies) return false
    return this.policies.filter(policy => policy.value === ASSET_PAIR_POLICIES.tradeableSecondaryMarket).length
  }
}
