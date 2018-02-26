import { xdrEnumToConstant } from '../utils/xdr_enum_to_constant'

export const REQUEST_TYPES = Object.freeze(
  xdrEnumToConstant('ReviewableRequestType')
)

export const FEE_TYPES = Object.freeze(
  xdrEnumToConstant('FeeType')
)

export const ASSET_POLICIES = Object.freeze(
  xdrEnumToConstant('AssetPolicy')
)

export const ASSET_PAIR_POLICIES = Object.freeze(
  xdrEnumToConstant('AssetPairPolicy')
)

export const ACCOUNT_TYPES = Object.freeze(
  xdrEnumToConstant('AccountType')
)
