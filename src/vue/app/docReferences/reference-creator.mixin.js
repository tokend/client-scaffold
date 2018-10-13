import { base } from '@tokend/js-sdk'
import { Sdk } from '../../../sdk'

export default {
  methods: {
    /**
     * file_name
     * document_type
     * creator
     * counterparty
     * @param reference
     * @param meta
     */
    async createReference (reference, meta) {
      const operation = base
        .CreateReferenceBuilder
        .createReference({
          reference,
          meta
        })
      await Sdk
        .horizon
        .transactions
        .submitOperations(operation)
    }
  }
}
