import DocumentManager from './document-manager'

export default {
  mixins: [DocumentManager],
  data: _ => ({
    isReferenceVerified: false,
    isReferenceBroken: false,
    isMetaModified: false,
    isFileMissing: false
  }),
  methods: {
    async verifyReference (reference) {
      if (reference.isBroken) {
        this.isReferenceBroken = true
        return
      }
      if (reference.isModified) {
        this.isMetaModified = true
        return
      }
      const fileKey = reference.fileKey
      const fileHash = reference.reference
      try {
        const blob = await this.getFileBlob(fileKey)
        const hash = await this.getFileHash(blob)
        this.isReferenceVerified = (fileHash === hash)
      } catch (e) {
        console.error(e)
        this.isFileMissing = true
        this.isReferenceVerified = false
      }
    }
  }
}
