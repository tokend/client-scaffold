export const object = {

  /***
   *
   * @param {object} value
   * @returns {boolean}
   */
  isObject (value) {
    return typeof value === 'object'
  },

  /***
   *
   * @param {object} value
   * @returns {boolean}
   */
  isEmpty (value) {
    if (!this.isObject(value)) {
      throw new Error(`Invalid param: ${value} must be an object, not ${typeof value}`)
    }

    try {
      for (const prop in value) {
        if (value.hasOwnProperty(prop)) {
          return false
        }
      }

      return JSON.stringify(value) === JSON.stringify({})
    } catch (e) {
      console.warn('Warning: passing recursive structures as argument may lead to unexpected results')
    }
  },

  /***
   *
   * @param {object} objectA
   * @param {object} objectB
   * @returns {Boolean}
   */
  isEqual (objectA, objectB) {
    if (!this.isObject(objectA) || !this.isObject(objectB)) {
      throw new Error(`Invalid params: params must be objects, not ${typeof objectA}, ${typeof objectB}`)
    }

    return JSON.stringify(objectA) === JSON.stringify(objectB)
  },

  /***
   *
   * @param {object} value
   * returns object
   */
  clone (value) {
    if (!this.isObject(value)) {
      throw new Error(`Invalid param: ${value} must be an object, not ${typeof value}`)
    }

    return { ...value }
  }
}

export default {
  install (Vue, options) {
    Vue.prototype.$object = object
  }
}
