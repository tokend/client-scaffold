import DocumentManager from './document-manager'

export default {
  mixins: [DocumentManager],
  data: _ => ({
    isReferenceVerified: false
  }),
  methods: {
    async verifyReference (fileKey, fileHash) {
      const blob = await this.getFileBlob(fileKey)
      const hash = await this.getFileHash(blob)

      this.isReferenceVerified = (fileHash === hash)
    }
  }
}
