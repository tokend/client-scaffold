import { Service } from './service'

export class PricesService extends Service {
  /**
   * Loads all asset pairs existing in the system
   *
   *  @return {array} Asset pairs
   */
  loadAssetPairs () {
    return this._horizonRequestBuilder.assetPairs()
      .callWithSignature(this._keypair)
  }

  /**
   * Asynchronously converts amount from one token to another
   *
   * @param amount - amount to be converted
   * @param sourceToken - token from which we're converting
   * @param destToken - token to which we're converting
   *
   * @return {string} Converted amount
   */
  loadConvertedAmount (amount, sourceToken, destToken) {
    return this._horizonRequestBuilder.assetPairs()
      .convert(amount, sourceToken, destToken)
      .callWithSignature(this._keypair)
      .then(response => response.amount)
  }
}

export const pricesService = new PricesService()
