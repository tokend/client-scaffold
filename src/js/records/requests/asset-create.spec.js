import { AssetCreateRequestRecord } from './asset-create.record'
import { ASSET_POLICIES } from '@tokend/js-sdk'
import { MockWrapper } from '../../../test/index'

import assetCreateRecordJSON from '../../../test/mocks/asset-create'

describe('AssetCreateRequestRecord', () => {
  let rawRecord, responseRecord, parsedRecord

  const parse = () => {
    responseRecord = MockWrapper.makeHorizonData(rawRecord)
    parsedRecord = new AssetCreateRequestRecord(responseRecord)
  }

  const setPolicies = (...policies) => {
    rawRecord.details.asset_create.policies = policies
      .map(p => ({ value: p, name: 'SomePolicyNameWeDoNotInterestedIn' }))
    parse()
  }

  beforeEach(() => {
    rawRecord = assetCreateRecordJSON
    parse()
  })

  it('constructor should properly set all the basic fields', () => {
    expect(parsedRecord.assetName)
      .to
      .equal(rawRecord.details.asset_create.details.name)
    expect(parsedRecord.assetCode)
      .to
      .equal(rawRecord.details.asset_create.code)
    expect(parsedRecord.preissuedAssetSigner)
      .to
      .equal(rawRecord.details.asset_create.pre_issued_asset_signer)
    expect(parsedRecord.maxIssuanceAmount)
      .to
      .equal(rawRecord.details.asset_create.max_issuance_amount)
    expect(parsedRecord.initialPreissuedAmount)
      .to
      .equal(rawRecord.details.asset_create.initial_preissued_amount)
    expect(parsedRecord.externalSystemType)
      .to
      .deep
      .equal(rawRecord.details.asset_create.details.external_system_type)
  })

  it('constructor should properly set policies fields', () => {
    setPolicies(2, 4, 8)

    const expectedResult = [2, 4, 8]
    const expectedPolicyValue = 14

    expect(parsedRecord.policies).to.deep.equal(expectedResult)
    expect(parsedRecord.policy).to.equal(expectedPolicyValue)
  })

  it('constructor should properly logo details', () => {
    expect(parsedRecord.logo)
      .to
      .deep
      .equal(rawRecord.details.asset_create.details.logo)
    expect(parsedRecord.logoKey)
      .to
      .equal(rawRecord.details.asset_create.details.logo.key)
    expect(parsedRecord.logoName)
      .to
      .equal(rawRecord.details.asset_create.details.logo.name)
    expect(parsedRecord.logoType)
      .to
      .equal(rawRecord.details.asset_create.details.logo.type)
  })

  it('constructor should properly terms details', () => {
    expect(parsedRecord.terms)
      .to
      .deep
      .equal(rawRecord.details.asset_create.details.terms)
    expect(parsedRecord.termsKey)
      .to
      .equal(rawRecord.details.asset_create.details.terms.key)
    expect(parsedRecord.termsName)
      .to
      .equal(rawRecord.details.asset_create.details.terms.name)
    expect(parsedRecord.termsType)
      .to
      .equal(rawRecord.details.asset_create.details.terms.type)
  })

  describe('getters should return proper values', () => {
    const setExternalSystemType = (type) => {
      rawRecord.details.asset_create.external_system_type = type
      parse()
    }

    it('isBaseAsset', () => {
      setPolicies(ASSET_POLICIES.baseAsset)
      expect(parsedRecord.isBaseAsset).to.equal(true)
      setPolicies([])
      expect(parsedRecord.isBaseAsset).to.equal(false)
    })

    it('isIssuanceManualReviewRequired', () => {
      setPolicies(ASSET_POLICIES.issuanceManualReviewRequired)
      expect(parsedRecord.isIssuanceManualReviewRequired).to.equal(true)
      setPolicies()
      expect(parsedRecord.isIssuanceManualReviewRequired).to.equal(false)
    })

    it('isRequiresKYC', () => {
      setPolicies(ASSET_POLICIES.requiresKyc)
      expect(parsedRecord.isRequiresKYC).to.equal(true)
      setPolicies()
      expect(parsedRecord.isRequiresKYC).to.equal(false)
    })

    it('isStatsQuoteAsset', () => {
      setPolicies(ASSET_POLICIES.statsQuoteAsset)
      expect(parsedRecord.isStatsQuoteAsset).to.equal(true)
      setPolicies()
      expect(parsedRecord.isStatsQuoteAsset).to.equal(false)
    })

    it('isTwoStepWithdrawal', () => {
      setPolicies(ASSET_POLICIES.twoStepWithdrawal)
      expect(parsedRecord.isTwoStepWithdrawal).to.equal(true)
      setPolicies()
      expect(parsedRecord.isTwoStepWithdrawal).to.equal(false)
    })

    it('isTransferable', () => {
      setPolicies(ASSET_POLICIES.transferable)
      expect(parsedRecord.isTransferable).to.equal(true)
      setPolicies()
      expect(parsedRecord.isTransferable).to.equal(false)
    })

    it('isWithdrawable', () => {
      setPolicies(ASSET_POLICIES.withdrawable)
      expect(parsedRecord.isWithdrawable).to.equal(true)
      setPolicies()
      expect(parsedRecord.isWithdrawable).to.equal(false)
    })

    it('isDepositable', () => {
      setExternalSystemType('4')
      expect(parsedRecord.isDepositable).to.equal(true)
      setExternalSystemType(undefined)
      expect(parsedRecord.isDepositable).to.equal(true)
    })
  })

  describe('URL getters should return proper values', () => {
    const setLogoKey = (key) => {
      rawRecord.details.asset_create.details.logo = {}
      rawRecord.details.asset_create.details.logo.key = key
      parse()
    }

    const setTermsKey = (key) => {
      rawRecord.details.asset_create.details.terms = {}
      rawRecord.details.asset_create.details.terms.key = key
      parse()
    }

    const storageUrl = 'https://storage.com'

    it('logoUrl', () => {
      const key = 'fooEq112ewq134qweq41weqweqwe'
      setLogoKey(key)
      expect(parsedRecord.logoUrl(storageUrl)).to.equal(`${storageUrl}/${key}`)
    })

    it('termsUrl', () => {
      const key = 'barEq112ewq134qweq41weqweqwe'
      setTermsKey(key)
      expect(parsedRecord.termsUrl(storageUrl)).to.equal(`${storageUrl}/${key}`)
    })
  })

  describe('opts() method should return proper data', () => {
    let opts

    beforeEach(() => {
      opts = parsedRecord.opts()
    })

    it('requestID', () => {
      expect(opts.requestID).to.equal(rawRecord.id)
    })

    it('code', () => {
      expect(opts.code).to.equal(rawRecord.details.asset_create.code)
    })

    it('initialPreissuedAmount', () => {
      expect(opts.initialPreissuedAmount)
        .to
        .equal(rawRecord.details.asset_create.initial_preissued_amount)
    })

    it('preissuedAssetSigner', () => {
      expect(opts.preissuedAssetSigner)
        .to
        .equal(rawRecord.details.asset_create.pre_issued_asset_signer)
    })

    it('maxIssuanceAmount', () => {
      expect(opts.maxIssuanceAmount)
        .to
        .equal(rawRecord.details.asset_create.max_issuance_amount)
    })

    it('name', () => {
      expect(opts.details.name)
        .to
        .equal(rawRecord.details.asset_create.details.name)
    })

    it('policies', () => {
      const expectedPolicy = 7

      setPolicies(1, 2, 4)

      opts = parsedRecord.opts()
      expect(opts.policies).to.equal(expectedPolicy)
    })

    it('logo', () => {
      expect(opts.details.logo.key)
        .to
        .equal(rawRecord.details.asset_create.details.logo.key)
      expect(opts.details.logo.type)
        .to
        .equal(rawRecord.details.asset_create.details.logo.type)
      expect(opts.details.logo.name)
        .to
        .equal(rawRecord.details.asset_create.details.logo.name)
    })

    it('terms', () => {
      expect(opts.details.terms.key)
        .to
        .equal(rawRecord.details.asset_create.details.terms.key)
      expect(opts.details.terms.type)
        .to
        .equal(rawRecord.details.asset_create.details.terms.type)
      expect(opts.details.terms.name)
        .to
        .equal(rawRecord.details.asset_create.details.terms.name)
    })
  })
})
