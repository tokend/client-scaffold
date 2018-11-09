import { MockWrapper } from '../../../test/index'
import { SaleRequestRecord } from './sale-create.record'

import saleCreateJSON from '../../../test/mocks/sale-create'

describe('SaleRequestRecord', () => {
  const getRecord = (rawJSON = saleCreateJSON) => {
    const sdkResponse = MockWrapper.makeHorizonData(rawJSON)
    return new SaleRequestRecord(sdkResponse)
  }

  const setQuoteAssets = (rawJSON, assets) => {
    rawJSON.details.sale.quote_assets = assets

    return rawJSON
  }

  const setReturnOfInvestment = (rawJSON, { from, to }) => {
    rawJSON.details.sale.details.return_of_investment.from = from
    rawJSON.details.sale.details.return_of_investment.to = to

    return rawJSON
  }

  const setSaleType = (rawJSON, type) => {
    rawJSON.details.sale.sale_type = type

    return rawJSON
  }

  const setLogoKey = (rawJSON, key) => {
    rawJSON.details.sale.details.logo = {}
    rawJSON.details.sale.details.logo.key = key

    return rawJSON
  }

  const setStartTime = (rawJSON, time) => {
    rawJSON.details.sale.start_time = time

    return rawJSON
  }

  const setEndTime = (rawJSON, time) => {
    rawJSON.details.sale.end_time = time

    return rawJSON
  }

  it('constructor should properly set all the basic fields', () => {
    const record = getRecord()

    expect(record.baseAsset)
      .to
      .equal(
        saleCreateJSON.details.sale.base_asset
      )

    expect(record.name)
      .to
      .equal(
        saleCreateJSON.details.sale.details.name
      )

    expect(record.defaultQuoteAsset)
      .to
      .equal(
        saleCreateJSON.details.sale.default_quote_asset
      )

    expect(record.startTime)
      .to
      .equal(
        saleCreateJSON.details.sale.start_time
      )

    expect(record.endTime)
      .to
      .equal(
        saleCreateJSON.details.sale.end_time
      )

    expect(record.softCap)
      .to
      .equal(
        saleCreateJSON.details.sale.soft_cap
      )

    expect(record.hardCap)
      .to
      .equal(
        saleCreateJSON.details.sale.hard_cap
      )

    expect(record.baseAssetForHardCap)
      .to
      .equal(
        saleCreateJSON.details.sale.base_asset_for_hard_cap
      )
  })

  it('constructor should properly set sale state fields', () => {
    const record = getRecord()

    expect(record.saleState)
      .to
      .equal(
        saleCreateJSON.details.sale.state.value
      )

    expect(record.saleStateStr)
      .to
      .equal(
        saleCreateJSON.details.sale.state.name
      )
  })

  it('constructor should properly set sale type fields', () => {
    const record = getRecord()

    expect(record.saleTypeStr)
      .to
      .equal(
        saleCreateJSON.details.sale.sale_type.name
      )

    expect(record.saleType)
      .to
      .equal(
        saleCreateJSON.details.sale.sale_type.value
      )
  })

  it('constructor should properly set all the details fields', () => {
    const record = getRecord()

    expect(record.description)
      .to
      .equal(
        saleCreateJSON.details.sale.details.description
      )

    expect(record.shortDescription)
      .to
      .equal(
        saleCreateJSON.details.sale.details.short_description
      )

    expect(record.youtubeVideoId)
      .to
      .equal(
        saleCreateJSON.details.sale.details.youtube_video_id
      )

    expect(record.returnOfInvestmentFrom)
      .to
      .equal(
        saleCreateJSON.details.sale.details.return_of_investment.from
      )

    expect(record.returnOfInvestmentTo)
      .to
      .equal(
        saleCreateJSON.details.sale.details.return_of_investment.to
      )
  })

  it('constructor should properly set all the quote assets', () => {
    const quoteAssets = [
      { quote_asset: 'ETH', price: '1.000000' },
      { quote_asset: 'BTC', price: '1.000000' },
      { quote_asset: 'DASH', price: '1.000000' }
    ]
    const expectedResult = ['ETH', 'BTC', 'DASH']
    const rawJSON = setQuoteAssets(saleCreateJSON, quoteAssets)
    const record = getRecord(rawJSON)

    expect(record.quoteAssets).to.deep.equal(expectedResult)
  })

  it('constructor should properly logo details', () => {
    const record = getRecord()

    expect(record.logoKey)
      .to
      .equal(
        saleCreateJSON.details.sale.details.logo.key
      )

    expect(record.logoName)
      .to
      .equal(
        saleCreateJSON.details.sale.details.logo.name
      )

    expect(record.logoType)
      .to
      .equal(
        saleCreateJSON.details.sale.details.logo.type
      )
  })

  it('logoUrl getter returns proper value', () => {
    const storageUrl = 'https://storage.com'
    const key = 'fooEq112ewq134qweq41weqweqwe'
    const rawJSON = setLogoKey(saleCreateJSON, key)
    const record = getRecord(rawJSON)

    expect(record.logoUrl(storageUrl)).to.equal(`${storageUrl}/${key}`)
  })

  describe('opts() method should return proper data', () => {
    let opts

    beforeEach(() => {
      opts = getRecord().opts()
    })

    it('requestID', () => {
      expect(opts.requestID)
        .to
        .equal(saleCreateJSON.id)
    })

    it('baseAsset', () => {
      expect(opts.baseAsset)
        .to
        .equal(saleCreateJSON.details.sale.base_asset)
    })

    it('defaultQuoteAsset', () => {
      expect(opts.defaultQuoteAsset)
        .to
        .equal(saleCreateJSON.details.sale.default_quote_asset)
    })

    it('startTime', () => {
      const time = '2018-06-19T21:00:00Z'
      const expectedResult = '1529442000'
      const rawJSON = setStartTime(saleCreateJSON, time)
      const record = getRecord(rawJSON)

      opts = record.opts()

      expect(opts.startTime).to.equal(expectedResult)
    })

    it('endTime', () => {
      const time = '2018-06-29T21:00:00Z'
      const expectedResult = '1530306000'

      const rawJSON = setEndTime(saleCreateJSON, time)
      const record = getRecord(rawJSON)

      opts = record.opts()

      expect(opts.endTime).to.equal(expectedResult)
    })

    it('softCap', () => {
      expect(opts.softCap)
        .to
        .equal(saleCreateJSON.details.sale.soft_cap)
    })

    it('hardCap', () => {
      expect(opts.hardCap)
        .to
        .equal(saleCreateJSON.details.sale.hard_cap)
    })

    it('baseAssetForHardCap', () => {
      expect(opts.baseAssetForHardCap)
        .to
        .equal(saleCreateJSON.details.sale.base_asset_for_hard_cap)
    })

    it('saleStaten', () => {
      expect(opts.saleState)
        .to
        .equal(saleCreateJSON.details.sale.state.value)
    })

    it('details.name', () => {
      expect(opts.details.name)
        .to
        .equal(saleCreateJSON.details.sale.details.name)
    })

    it('details.short_description', () => {
      expect(opts.details.short_description)
        .to
        .equal(saleCreateJSON.details.sale.details.short_description)
    })

    it('details.description', () => {
      expect(opts.details.description)
        .to
        .equal(saleCreateJSON.details.sale.details.description)
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

      const rawJSON = setQuoteAssets(saleCreateJSON, quoteAssets)
      const record = getRecord(rawJSON)

      const opts = record.opts()

      expect(opts.quoteAssets)
        .to
        .deep
        .equal(expectedResult)
    })

    it('returnOfInvestment', () => {
      const from = '30'
      const to = '91'

      const rawJSON = setReturnOfInvestment(saleCreateJSON, { from, to })
      const record = getRecord(rawJSON)
      const opts = record.opts()

      expect(opts.details.return_of_investment.from).to.be.equal(from)
      expect(opts.details.return_of_investment.to).to.be.equal(to)
    })

    it('saleType', () => {
      const value = { name: 'fixed_price', value: 3 }
      const expectedResult = 3

      const rawJSON = setSaleType(saleCreateJSON, value)
      const record = getRecord(rawJSON)
      const opts = record.opts()

      expect(opts.saleType).to.equal(expectedResult)
    })

    it('logo', () => {
      expect(opts.details.logo.key)
        .to
        .equal(saleCreateJSON.details.sale.details.logo.key)

      expect(opts.details.logo.type)
        .to
        .equal(saleCreateJSON.details.sale.details.logo.type)

      expect(opts.details.logo.name)
        .to
        .equal(saleCreateJSON.details.sale.details.logo.name)
    })
  })
})
