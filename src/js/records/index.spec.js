import { MockWrapper } from '../../test/index'
import { RecordWrapper } from './index'

import { AssetCreateRequestRecord } from './requests/asset-create.record'
import { AssetUpdateRequestRecord } from './requests/asset-update.record'
import { SaleRequestRecord } from './requests/sale-create.record'
import {
  UpdateSaleDetailsRequestRecord
} from './requests/update-sale-details.record'
import { UpdateKycRequestRecord } from './requests/update-kyc.record'

import assetUpdateJSON from '../../test/mocks/asset-update'
import assetCreateJSON from '../../test/mocks/asset-create'
import saleCreateJSON from '../../test/mocks/sale-create'
import updateSaleDetailsJSON from '../../test/mocks/update-sale-details'
import updateKycJSON from '../../test/mocks/update-kyc'

describe('Record factory', () => {
  const test = (request, constructor) => {
    const response = MockWrapper.makeHorizonData(request)
    const parsed = RecordWrapper.request(response)
    expect(parsed).to.be.instanceOf(constructor)
  }

  it('should properly define asset_create request', () => {
    test(assetCreateJSON, AssetCreateRequestRecord)
  })

  it('should properly define asset_update request', () => {
    test(assetUpdateJSON, AssetUpdateRequestRecord)
  })

  it('should properly define sale request', () => {
    test(saleCreateJSON, SaleRequestRecord)
  })

  it('should properly define update_sale_details request', () => {
    test(updateSaleDetailsJSON, UpdateSaleDetailsRequestRecord)
  })

  it('should properly define update_kyc request', () => {
    test(updateKycJSON, UpdateKycRequestRecord)
  })
})
