import { FEE_TYPES } from '../../const/xdr.const'
import { mockFeeAmount, mockFeeAsset } from './fees.mocks'
import { mockDocumentId } from './files.mocks'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '../../const/offers.const'
import { mockBaseTokenCode, mockOrderBookId, mockQuoteTokenCode } from './offers.mocks'
import config from '../../../config'
import {mockConvertAmount} from './prices.mocks'
import {mockReviewableRequestId, mockReviewableRequestTokenCode} from './reviewable_requests.mocks'
import { mockTxTokenCode } from './transactions.mocks'

export const mockAccountId = 'GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ'
export const mockBalanceId = 'BBU5CSWOEKKMCPXMSV6X3PMJ2FHVHPQF56T4CLTMQP7O36DBFNOUC2CW'
export const mockEmail = 'joe@mail.com'
export const mockTokenCodes = ['QTK', 'BTC']
export const mockWalletId = 'e8355d4442ad7ebb36e24c88db376d86a7049470a876c52b5eff781b64d90fa6'

export const accountResponses = {
  [`accounts/${mockAccountId}`]: 'account request succesfully built!',
  [`accounts/${mockAccountId}/balances`]: 'balances request succesfully built!',
  [`accounts/${mockAccountId}/balances/details`]: 'balance details request succesfully built!',
  [`balances/${mockBalanceId}/account`]: 'request for load accountId by balance id succesfully built!',
  [`user_id?email=${mockEmail}`]: 'request for load account id by email successfully sent',
  [`details`]: { users: {
       [mockAccountId]: { email: mockEmail }
      }
  },
  [``]: ''
}

export const chartResponses = {
  [`charts/${mockTokenCodes[0]}`]: 'load chart for single token succeeded',
  [`charts/${mockTokenCodes[0]}-${mockTokenCodes[1]}`]: 'load chart for token pair succeeded'
}

export const walletResponses = {
  [`wallets/${mockWalletId}/verification`]: 'request to wallets/verification built!',
  [`wallets/${mockWalletId}/factors`]: 'request to wallets/factors built!'
}

export const feesResponses = {
  [`fees/${FEE_TYPES.paymentFee}?asset=${mockFeeAsset}&account=${mockAccountId}&amount=${mockFeeAmount}&subtype=0`]: { fixed: '0.000000', percent: '0.000000' },
  [`fees/${FEE_TYPES.withdrawalFee}?asset=${mockFeeAsset}&account=${mockAccountId}&amount=${mockFeeAmount}&subtype=0`]: { fixed: '1.000000', percent: '1.000000' },
  [`fees/${FEE_TYPES.offerFee}?asset=${mockFeeAsset}&account=${mockAccountId}&amount=${mockFeeAmount}&subtype=0`]: { fixed: '2.000000', percent: '3.000000' }
}

export const fileResponses = {
  [`users/${mockAccountId}/documents/${mockDocumentId}`]: 'request for specified document sent!',
  [`users/${mockAccountId}/documents`]: 'request for documents sent!'
}

export const offerPrefixes = {
  smOffers:`accounts/${mockAccountId}/offers?is_buy=&order_book_id=${+SECONDARY_MARKET_ORDER_BOOK_ID}&limit=${config.TRANSACTIONS_PER_PAGE}`,
  saleOffers: `accounts/${mockAccountId}/offers?is_buy=true&order_book_id=${+mockOrderBookId}`,
  currentOffers: `order_book?order_book_id=${+SECONDARY_MARKET_ORDER_BOOK_ID}&base_asset=${mockBaseTokenCode}&quote_asset=${mockQuoteTokenCode}&is_buy=true`,
  trades: `trades?base_asset=${mockBaseTokenCode}&quote_asset=${mockQuoteTokenCode}&order_book_id=${+SECONDARY_MARKET_ORDER_BOOK_ID}&limit=${config.TRANSACTIONS_PER_PAGE}`
}

export const offerResponses = {
  [offerPrefixes.smOffers]: 'request for sm offers built!',
  [offerPrefixes.saleOffers]: 'request for sale offers built!',
  [offerPrefixes.currentOffers]: 'request for current offers built!',
  [offerPrefixes.trades]: 'request for trades built!'
}

export const pricesResponses = {
  [`asset_pairs`]: 'request for asset pairs built!',
  [ `asset_pairs/convert?amount=${mockConvertAmount}&source_asset=${mockBaseTokenCode}&dest_asset=${mockQuoteTokenCode}`]: 'request for convert asset built!'
}

export const reviewableRequestResponses = {
  [`request/assets?requestor=${mockAccountId}&order=desc&limit=${config.TRANSACTIONS_PER_PAGE}`]: 'request for assets built!',
  [`request/withdrawals?requestor=${mockAccountId}&order=desc&limit=${config.TRANSACTIONS_PER_PAGE}`]: 'request for withdrawals built!',
  [`requests/${mockReviewableRequestId}`]: 'request by rr id built!',
  [`request/sales?base_asset=${mockReviewableRequestTokenCode}&requestor=${mockAccountId}`]: { _embedded: { records:['some record!'] } },
}

export const transactionResponses = {
  [`accounts/${mockAccountId}/payments?asset=${mockTxTokenCode}&order=desc&limit=${config.TRANSACTIONS_PER_PAGE}`]: 'request for payments made'
}

export const mockResponses = {
  ...accountResponses,
  ...chartResponses,
  ...walletResponses,
  ...feesResponses,
  ...fileResponses,
  ...offerResponses,
  ...pricesResponses,
  ...reviewableRequestResponses,
  ...transactionResponses
}
