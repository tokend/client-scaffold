import { humanizePastDate } from '../utils/dates.util'
import { feeAsset } from '../const/const'

export class TxRecord {
  constructor (record, name) {
    this._record = record
    this.name = name

    this.date = this._parseDate()
    this.state = this._record.state // TODO: resolve the state from xdr
    this.feeAsset = feeAsset
  }

  _parseDate () {
    return humanizePastDate(this._record.ledger_close_time)
  }
}
