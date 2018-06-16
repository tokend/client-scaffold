import numberFormatter from 'accounting'
import { DEFAULT_PRECISION, DEFAULT_CONVERSION_PRESICION } from '../const/configs.const'

const locales = {
  en: {
    currency: {
      symbol: '',   // default currency symbol is '$'
      format: '%s%v', // controls output: %s = symbol, %v = value/number (can be object: see below)
      decimal: '.',  // decimal point separator
      thousand: ',',  // thousands separator
      precision: DEFAULT_PRECISION   // decimal places
    },
    number: {
      precision: 0,
      thousand: ',',
      decimal: '.'
    },
    symbol: '$'
  }
}

export function formatCurrency (locale = 'en') {
  numberFormatter.settings = locales[locale]
  return (n) => {
    return removeZeros(numberFormatter.formatMoney(n))
  }
}

export function formatConvertedCurrency (locale = 'en') {
  numberFormatter.settings = locales[locale]
  return (n) => `${locales[locale].symbol}${numberFormatter.toFixed(numberFormatter.formatMoney(n), DEFAULT_CONVERSION_PRESICION)}`
}

export function formatNumber (locale = 'en') {
  numberFormatter.settings = locales[locale]
  return numberFormatter.formatNumber
}

function removeZeros (numString) {
  const splittedString = numString.split('.')
  const floatValue = numString.substring(numString.indexOf('.') - 1)
  const noZeros = parseFloat(floatValue)
  if (noZeros === '0') {
    return splittedString[0]
  } else {
    return splittedString[0] + noZeros.toString().substring(1)
  }
}
