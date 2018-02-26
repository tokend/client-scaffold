const assets = new Map([
  ['bitcoin', 'BTC'],
  ['ethereum', 'ETH']
])

export class ExternalAccountEntity {
  constructor (data) {
    this._rawData = data
    this.asset = this._deriveAsset()
    this.address = this._rawData.data
  }

  _deriveAsset () {
    const name = this._rawData.type.name
    return assets.has(name) ? assets.get(name) : name
  }
}
