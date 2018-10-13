import ReferenceListGetter from './reference-list-getter'

export default {
  mixins: [
    ReferenceListGetter
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
