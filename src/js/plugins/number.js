export const number = {

  getRandom (min, max, digits) {
    const multiplier = Math.pow(10, digits)
    if (!digits) return Math.round(Math.random() * (max - min) + min)
    return Math.round((Math.random() * (max - min) + min) * multiplier) / multiplier
  },

  roundUp (value, digits = 0) {
    const multiplier = Math.pow(10, digits)
    return Math.ceil(value * multiplier) / multiplier
  },

  localize (value, digits = 6, collapse = true) {
    if (!value) value = 0
    const parts = parseFloat(this.roundDown(Number(value), digits)).toFixed(digits).split('.')
    const localized = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '')
    if (!collapse) {
      return localized
    } else {
      if (+value < 100000) return localized
      return convertBigNumber(value)
    }
  },

  roundDown (value, digits = 0) {
    const multiplier = Math.pow(10, digits)
    return Math.floor(value * multiplier) / multiplier
  },

  testNumber (event) {
    const theEvent = event || window.event
    let key = theEvent.keyCode || theEvent.which

    if (key === 37 ||
        key === 38 ||
        key === 39 ||
        key === 40 ||
        key === 8 ||
        key === 46
    ) return

    key = String.fromCharCode(key)

    const regex = /[0-9]|\./
    if (!regex.test(key)) {
      theEvent.returnValue = false
      if (theEvent.preventDefault) theEvent.preventDefault()
    }
    if (key === '.') {
      if (theEvent.target.value === '' || theEvent.target.value.indexOf('.') !== -1) {
        if (theEvent.preventDefault) theEvent.preventDefault()
      }
    }
  }
}

function convertBigNumber (number, digits = 0) {
  const num = parseFloat(number)
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
    }
  }
  return num.toFixed(digits).replace(rx, '$1')
}

export default {
  install (Vue, options) {
    Vue.prototype.$number = number
  }
}
