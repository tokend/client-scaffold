import { TokenCreationRequest } from './modules/token_creation_request'
import { SaleCreationRequest } from './modules/sale_creation_request'

export class ReviewableRequestFactory {
  static createTokenCreationRequest () {
    return new TokenCreationRequest(...arguments)
  }

  static createSaleCreationRequest () {
    return new SaleCreationRequest(...arguments)
  }
}
