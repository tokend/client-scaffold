import { number } from '../plugins/number'

export function localizeBase (value) {
  return number.localize(value)
}

export function localizeQuote (value) {
  return number.localize(value, 2)
}

export function localize (value) {
  return number.localize(value)
}
