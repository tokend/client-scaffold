import { localizeNum } from '../utils/number-formatter'

export function localizeBase (value) {
  return localizeNum(value)
}

export function localizeQuote (value) {
  return localizeNum(value, 2)
}

export function localize (value) {
  return localizeNum(value)
}
