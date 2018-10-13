import { ReferenceRecord } from '../../../js/records/reference.record'
import { Sdk } from '../../../sdk'

export default {
  methods: {
    async getReferenceList () {
      const response = await Sdk.horizon.references.getAll()
      return response.data.map(r => new ReferenceRecord(r))
    }
  }
}
