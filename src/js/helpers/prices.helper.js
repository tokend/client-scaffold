import store from '../../vuex'
import { multiply, divide } from '../utils/math.util'

const MEDIUM_ASSET = 'SUN'

export function convertAmount (amount, fromBase, toQuote) {
  if (fromBase === toQuote) return amount
  if (!isValidParams(...arguments)) return 0
  const price = findPriceForAssetPair(fromBase, toQuote)
  if (price) {
    return multiply(amount, price)
  }
  const mediumAssetprice = findPriceForAssetPair(fromBase, MEDIUM_ASSET)
  const mediumAssetAmount = multiply(amount, mediumAssetprice)
  const endConversionPrice = findPriceForAssetPair(MEDIUM_ASSET, toQuote)
  const result = multiply(mediumAssetAmount, endConversionPrice)
  if (!result) {
    return 0
  }
  return result
}

export function quoteToBase (amount, fromQuote, toBase) {
  if (!isValidParams(...arguments)) return 0
  if (fromQuote === toBase) return amount
  const price = findPriceForAssetPair(toBase, fromQuote)
  if (price) {
    return divide(amount, price)
  }
  console.warn(`Cannot convert amount from quote to base. Asset pair ${fromQuote}-${toBase} does not exist`)
}

function findPriceForAssetPair (base, quote) {
  const assetPairs = store.getters.assetPairs
  const presentAssetPair = assetPairs.find(pair => pair.quote === quote && pair.base === base)
  if (presentAssetPair) return presentAssetPair.current_price
  return null
}

function isValidParams (amount, fromBase, toQuote) {
  if (amount === undefined || !fromBase || !toQuote) {
    return false
  }
  return true
}
