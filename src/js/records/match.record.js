import get from 'lodash/get'
import { TxRecord } from './tx.record'
import store from '../../vuex'

import { PricesHelper } from '../../vuex/helpers/prices.helper'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from './help/records.const'

export class MatchRecord extends TxRecord {
  constructor (record, asset) {
    super(record, record.type_i === 16 ? RECORDS_VERBOSE.match : RECORDS_VERBOSE.investment)
    this.asset = asset
    console.log(record)
    console.log(record.type_i)
    this.participants = record.participants
    this.participant = this._getParticipant()
    this.effects = this._getEffects()
    this.transactions = this._getTransactions()
  }

  _getParticipant () {
    const balance = get(store.getters.accountBalances, `[${this.asset}].balance_id`)
    return this.participants
      .filter(participant => participant.account_id === store.getters.accountId)
      .filter(participant => participant.balance_id === balance)[0]
  }

  _getEffects () {
    return this.participant.effects
  }

  _getTransactions () {
    return this.effects.map(effect => new MatchTransaction(effect, {
      asset: this.asset,
      date: this.date,
      name: this.name,
      feeAsset: this.feeAsset,
      state: this.state
    }))
  }
}

export class MatchTransaction {
  constructor (effect, opts) {
    this._effect = effect
    this.asset = opts.asset
    this.name = opts.name
    this.date = opts.date
    this.feeAsset = opts.feeAsset
    this.state = opts.state

    this.baseAsset = this._getTxBaseAsset()
    this.quoteAsset = this._getTxQuoteAsset()
    this.counterparty = this._getCounterparty()
    this.isBuy = this._getTxIsBuy()
    this.matches = this._getTxMatches()
    this.quoteAmount = this._getTxQuoteAmount()
    this.baseAmount = this._getTxBaseAmount()
    this.price = this._getTxPrice()
    this.feePaid = this._getTxFeePaid()
    this.amount = this._getTxAmount()
    this.direction = this._getTxDirection()
    this.amountSUN = this._getTxAmountSUN()
  }

  _getTxBaseAsset () {
    return this._effect.base_asset
  }

  _getTxQuoteAsset () {
    return this._effect.quote_asset
  }

  _getTxIsBuy () {
    return this._effect.is_buy
  }

  _getTxMatches () {
    return this._effect.matches
  }

  _getTxQuoteAmount () {
    return this._effect.matches.reduce((sum, match) => match.quote_amount + sum, 0)
  }

  _getTxBaseAmount () {
    return this._effect.matches.reduce((sum, match) => match.base_amount + sum, 0)
  }

  _getCounterparty () {
    return `${this.baseAsset} token fund`
  }

  _getTxAmount () {
    if (this.asset === this.quoteAsset) {
      return this.quoteAmount
    }
    return this.baseAmount
  }

  _getTxAmountSUN () {
    return PricesHelper.baseToQuote(this.amount, this.asset, 'SUN')
  }

  _getTxPrice () {
    return this.matches[0].price
  }

  _getTxFeePaid () {
    return this.matches.reduce((sum, match) => match.fee_paid + sum, 0)
  }

  _getTxDirection () {
    if (this.asset === this.quoteAsset) {
      return this.isBuy ? DIRECTION_VERBOSE.out : DIRECTION_VERBOSE.in
    }
    return this.isBuy ? DIRECTION_VERBOSE.in : DIRECTION_VERBOSE.out
  }
}
