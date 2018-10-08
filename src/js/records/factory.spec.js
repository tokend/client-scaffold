import { RecordFactory } from './factory'
import { RecordTypes } from './types'
import { recordResponses } from './test/records.mocks'

describe('record factory', () => {
  it('createTokenRecord() should create valid instance', () => {
    expect(RecordFactory.createTokenRecord(recordResponses.token))
      .to.be.instanceof(RecordTypes.TokenRecord)
  })

  it('createIssuanceRecord() should create valid instance', () => {
    expect(RecordFactory.createIssuanceRecord(recordResponses.issuance))
      .to.be.instanceof(RecordTypes.IssuanceRecord)
  })

  it('createWithdrawRecord() should create valid instance', () => {
    expect(RecordFactory.createWithdrawRecord(recordResponses.withdraw))
      .to.be.instanceof(RecordTypes.WithdrawalRecord)
  })

  it('createSaleRecord() should create valid instance', () => {
    expect(RecordFactory.createSaleRecord(recordResponses.sale))
      .to.be.instanceof(RecordTypes.SaleRecord)
  })

  it('createOfferRecord() should create valid instance', () => {
    expect(RecordFactory.createOfferRecord(recordResponses.offer))
      .to.be.instanceof(RecordTypes.OfferRecord)
  })

  it('createAssetPairRecord() should create valid instance', () => {
    expect(RecordFactory.createAssetPairRecord(recordResponses.assetPair))
      .to.be.instanceof(RecordTypes.AssetPairRecord)
  })

  it('createTradeRecord() should create valid instance', () => {
    expect(RecordFactory.createTradeRecord(recordResponses.trade))
      .to.be.instanceof(RecordTypes.TradeRecord)
  })
})
