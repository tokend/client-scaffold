import ReferenceGetter from './reference-getter'

export default {
  mixins: [ReferenceGetter],
  data: _ => ({
    reference: null
  }),
  methods: {
    async loadReference (reference) {
      this.reference = await this.getReference(reference)
    }
  }
}
