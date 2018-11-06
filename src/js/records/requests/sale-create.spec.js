import { MockWrapper } from '../../../test/index'
import { SaleRequestRecord } from './sale-create.record'

import saleCreateJSON from '../../../test/mocks/sale-create'

describe('SaleRequestRecord', () => {
  let rawRecord, responseRecord, parsedRecord

  const parse = () => {
    responseRecord = MockWrapper.makeHorizonData(rawRecord)
    parsedRecord = new SaleRequestRecord(responseRecord)
  }

  const setQuoteAssets = (assets) => {
    rawRecord.details.sale.quote_assets = assets
    parse()
  }

  const setReturnOfInvestment = ({ from, to }) => {
    rawRecord.details.sale.details.return_of_investment.from = from
    rawRecord.details.sale.details.return_of_investment.to = to
    parse()
  }

  const setSaleType = (type) => {
    rawRecord.details.sale.sale_type = type
    parse()
  }

  const setLogoKey = (key) => {
    rawRecord.details.sale.details.logo = {}
    rawRecord.details.sale.details.logo.key = key
    parse()
  }

  const setStartTime = (time) => {
    rawRecord.details.sale.start_time = time
    parse()
  }

  const setEndTime = (time) => {
    rawRecord.details.sale.end_time = time
    parse()
  }

  beforeEach(() => {
    rawRecord = saleCreateJSON
    parse()
  })

  it('constructor should properly set all the basic fields', () => {
    expect(parsedRecord.baseAsset)
      .to
      .equal(rawRecord.details.sale.base_asset)
    expect(parsedRecord.name)
      .to
      .equal(rawRecord.details.sale.details.name)
    expect(parsedRecord.defaultQuoteAsset)
      .to
      .equal(rawRecord.details.sale.default_quote_asset)
    expect(parsedRecord.startTime)
      .to
      .equal(rawRecord.details.sale.start_time)
    expect(parsedRecord.endTime)
      .to
      .equal(rawRecord.details.sale.end_time)
    expect(parsedRecord.softCap)
      .to
      .equal(rawRecord.details.sale.soft_cap)
    expect(parsedRecord.hardCap)
      .to
      .equal(rawRecord.details.sale.hard_cap)
    expect(parsedRecord.baseAssetForHardCap)
      .to
      .equal(rawRecord.details.sale.base_asset_for_hard_cap)
  })

  it('constructor should properly set sale state fields', () => {
    expect(parsedRecord.saleState)
      .to
      .equal(rawRecord.details.sale.state.value)
    expect(parsedRecord.saleStateStr)
      .to
      .equal(rawRecord.details.sale.state.name)
  })

  it('constructor should properly set sale type fields', () => {
    expect(parsedRecord.saleTypeStr)
      .to
      .equal(rawRecord.details.sale.sale_type.name)
    expect(parsedRecord.saleType)
      .to
      .equal(rawRecord.details.sale.sale_type.value)
  })

  it('constructor should properly set all the details fields', () => {
    expect(parsedRecord.description)
      .to
      .equal(rawRecord.details.sale.details.description)
    expect(parsedRecord.shortDescription)
      .to
      .equal(rawRecord.details.sale.details.short_description)
    expect(parsedRecord.youtubeVideoId)
      .to
      .equal(rawRecord.details.sale.details.youtube_video_id)
    expect(parsedRecord.returnOfInvestmentFrom)
      .to
      .equal(rawRecord.details.sale.details.return_of_investment.from)
    expect(parsedRecord.returnOfInvestmentTo)
      .to
      .equal(rawRecord.details.sale.details.return_of_investment.to)
  })

  it('constructor should properly set all the quote assets', () => {
    const quoteAssets = [
      { quote_asset: 'ETH', price: '1.000000' },
      { quote_asset: 'BTC', price: '1.000000' },
      { quote_asset: 'DASH', price: '1.000000' }
    ]
    const expectedResult = ['ETH', 'BTC', 'DASH']

    setQuoteAssets(quoteAssets)

    expect(parsedRecord.quoteAssets).to.deep.equal(expectedResult)
  })

  it('constructor should properly logo details', () => {
    expect(parsedRecord.logoKey)
      .to
      .equal(rawRecord.details.sale.details.logo.key)
    expect(parsedRecord.logoName)
      .to
      .equal(rawRecord.details.sale.details.logo.name)
    expect(parsedRecord.logoType)
      .to
      .equal(rawRecord.details.sale.details.logo.type)
  })

  it('logoUrl getter returns proper value', () => {
    const storageUrl = 'https://storage.com'

    const key = 'fooEq112ewq134qweq41weqweqwe'

    setLogoKey(key)

    expect(parsedRecord.logoUrl(storageUrl)).to.equal(`${storageUrl}/${key}`)
  })

  describe('opts() method should return proper data', () => {
    let opts

    beforeEach(() => {
      opts = parsedRecord.opts()
    })

    it('requestID', () => {
      expect(opts.requestID).to.equal(rawRecord.id)
    })

    it('baseAsset', () => {
      expect(opts.baseAsset).to.equal(rawRecord.details.sale.base_asset)
    })
    it('defaultQuoteAsset', () => {
      expect(opts.defaultQuoteAsset)
        .to
        .equal(rawRecord.details.sale.default_quote_asset)
    })
    it('startTime', () => {
      const time = '2018-06-19T21:00:00Z'
      const expectedResult = '1529442000'

      setStartTime(time)

      opts = parsedRecord.opts()

      expect(opts.startTime)
        .to
        .equal(expectedResult)
    })
    it('endTime', () => {
      const time = '2018-06-29T21:00:00Z'
      const expectedResult = '1530306000'

      setEndTime(time)

      opts = parsedRecord.opts()

      expect(opts.endTime).to.equal(expectedResult)
    })
    it('softCap', () => {
      expect(opts.softCap).to.equal(rawRecord.details.sale.soft_cap)
    })
    it('hardCap', () => {
      expect(opts.hardCap).to.equal(rawRecord.details.sale.hard_cap)
    })
    it('baseAssetForHardCap', () => {
      expect(opts.baseAssetForHardCap)
        .to
        .equal(rawRecord.details.sale.base_asset_for_hard_cap)
    })
    it('saleStaten', () => {
      expect(opts.saleState).to.equal(rawRecord.details.sale.state.value)
    })
    it('details.name', () => {
      expect(opts.details.name).to.equal(rawRecord.details.sale.details.name)
    })
    it('details.short_description', () => {
      expect(opts.details.short_description)
        .to
        .equal(rawRecord.details.sale.details.short_description)
    })
    it('details.description', () => {
      expect(opts.details.description)
        .to
        .equal(rawRecord.details.sale.details.description)
    })

    it('quoteAssets', () => {
      const quoteAssets = [
        { quote_asset: 'ETH', price: '1.000000' },
        { quote_asset: 'DAI', price: '1.000000' }
      ]

      const expectedResult = [
        { asset: 'ETH', price: '1' },
        { asset: 'DAI', price: '1' }
      ]

      setQuoteAssets(quoteAssets)

      opts = parsedRecord.opts()

      expect(opts.quoteAssets).to.deep.equal(expectedResult)
    })

    it('returnOfInvestment', () => {
      const from = '30'
      const to = '91'

      setReturnOfInvestment({ from, to })

      opts = parsedRecord.opts()

      expect(opts.details.return_of_investment.from).to.be.equal(from)
      expect(opts.details.return_of_investment.to).to.be.equal(to)
    })

    it('saleType', () => {
      const value = { name: 'fixed_price', value: 3 }
      const expectedResult = 3

      setSaleType(value)

      opts = parsedRecord.opts()

      expect(opts.saleType).to.equal(expectedResult)
    })

    it('logo', () => {
      expect(opts.details.logo.key)
        .to
        .equal(rawRecord.details.sale.details.logo.key)
      expect(opts.details.logo.type)
        .to
        .equal(rawRecord.details.sale.details.logo.type)
      expect(opts.details.logo.name)
        .to
        .equal(rawRecord.details.sale.details.logo.name)
    })
  })
})
