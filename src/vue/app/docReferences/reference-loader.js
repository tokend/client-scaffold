import ReferenceGetter from './reference-getter'

export default {
  mixins: [
    ReferenceGetter
  ],
  data: _ => ({
    references: []
  }),
  methods: {
    async loadReferenceList () {
      this.references = await this.getReferenceList()
    }
  }
}
