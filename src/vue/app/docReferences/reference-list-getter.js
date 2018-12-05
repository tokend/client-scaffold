import { ReferenceRecord } from '../../../js/records/reference.record'
import { Sdk } from '../../../sdk'
import moment from 'moment'

export default {
  methods: {
    async getReferenceList () {
      const response = await Sdk.horizon.references.getAll()
      return response.data
        .map(r => new ReferenceRecord(r))
        .sort((referenceA, referenceB) => {
          return moment(referenceA.createdAt).isAfter(
            moment(referenceB.createdAt)
          ) ? 1
            : -1
        })
    }
  }
}
