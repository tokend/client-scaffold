import { SaleRequestBuilder, ManageAssetBuilder } from 'swarm-js-sdk'
import { Service } from './service'
import config from '../../config'

export class SalesService extends Service {
  /**
   * Creates operation to create sale creation request
   * @param {object} opts
   * @param {string} opts.requestID - ID of the request. 0 - to create new;
   * @param {string} opts.baseAsset - asset for which sale will be performed
   * @param {string} opts.defaultQuoteAsset - asset in which hardcap/soft cap will be calculated
   * @param {string} opts.startTime - start time of the sale
   * @param {string} opts.endTime - close time of the sale
   * @param {string} opts.softCap - minimum amount of quote asset to be received at which sale will be considered a successful
   * @param {string} opts.hardCap - max amount of quote asset to be received
   * @param {object} opts.details - sale specific details
   * @param {object} opts.details.name - name of the sale
   * @param {object} opts.details.short_description - short description of the sale
   * @param {object} opts.details.desciption - sale specific details
   * @param {object} opts.details.logo - details of the logo
   * @param {string} opts.baseAssetForHardCap - specifies the amount of base asset required for hard cap
   * @param {array} opts.quoteAssets - accepted assets
   * @param {object} opts.quoteAssets.price - price for 1 baseAsset in terms of quote asset
   * @param {object} opts.quoteAssets.asset - asset code of the quote asset
   * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
   * @returns {TransactionResponseBuilder}
   */
  createSaleCreationRequest (opts) {
    const saleOperation = SaleRequestBuilder.createSaleCreationRequest(opts)

    return this._operationBuilder
      .operation()
      .add(saleOperation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Creates sale creation request additionally updating token creation request. In swarm, we need this to change tokens max issuance
   * property depending on sale's hard cap. If no need to update token request, use {@link createSaleCreationRequest}
   *
   * @borrows {createSaleCreationRequest}
   * @borrows {createTokenCreationRequest}
   * @param saleOpts
   * @param tokenOpts
   *
   * @returns {TransactionResponseBuilder}
   */
  createSaleCreationRequestWithTokenRequestUpdate (saleOpts, tokenOpts) {
    const saleOperation = SaleRequestBuilder.createSaleCreationRequest(saleOpts)
    const tokenOperation = ManageAssetBuilder.assetCreationRequest(tokenOpts)
    return this._operationBuilder
      .operation()
      .add(tokenOperation)
      .add(saleOperation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Loads created sales with specified filters
   * @param filters
   * @param {string} filters.baseAsset - base token code (match case only)
   * @param {boolean} filters.openOnly - if true, loads all sales with open state (includes upcoming)
   * @param {boolean} filters.upcoming - if true, loads only upcoming sales
   * @param {number} filters.sortBy - sort type {@link saleSortTypes}
   * @param {string} filters.name - name of the sale (works with substring)
   * @param {string} filters.order - default asc/desc
   *
   * @returns {Promise<object>} - Promise object representing sales
   */
  loadSales (filters = { openOnly: true }) {
    return this._horizonRequestBuilder
      .sales()
      .forName(filters.name)
      .forBaseAsset(filters.baseAsset)
      .openOnly(filters.openOnly)
      .sortBy(filters.sortBy)
      .currentSoftCapsRatio(getSoftCapRatio(filters.nearlyFunded, filters.reachedSoftCap))
      .upcoming(filters.upcoming)
      .order(filters.order)
      .limit(config.TRANSACTIONS_PER_PAGE)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads sale by token code. By default loads an array of sales, but because Swarm sale/tokens are 1-1 we can derive
   * 1st element here
   *
   * @param {string} tokenCode - token code
   *
   * @returns {Promise<object>} - Promise object representing sale
   */
  loadSaleByTokenCode (tokenCode) {
    return this._horizonRequestBuilder.sales()
      .forBaseAsset(tokenCode)
      .callWithSignature(this._keypair)
      .then(response => Promise.resolve(response.records[0]))
  }

  /**
   * Loads sale by it's id
   *
   * @param {string|number} id - sale id
   *
   * @returns {Promise<object>} - Promise object representing sale
   */
  loadSaleById (id) {
    return this._horizonRequestBuilder.sales()
      .sale(id)
      .callWithSignature(this._keypair)
  }
}

export const salesService = new SalesService()

function getSoftCapRatio (isNearlyFunded, isReachedSoftCap) {
  if (isReachedSoftCap) return 100
  if (isNearlyFunded) return 80
  return ''
}
