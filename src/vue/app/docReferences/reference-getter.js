import { ReferenceRecord } from '../../../js/records/reference.record'
import { Sdk } from '../../../sdk'

export default {
  methods: {
    async getReference (reference) {
      const { data } = await Sdk.horizon.references.get(reference)
      return new ReferenceRecord(data)
    }
  }
}
