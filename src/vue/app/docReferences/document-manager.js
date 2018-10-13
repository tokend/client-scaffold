import config from '../../../config'
import { CryptoUtil } from './crypto.util'
import { FileHelper } from '../../../js/helpers/file.helper'
import { fileService } from '../../../js/services/file.service'

export default {
  methods: {
    async getFileHash (file) {
      const msg = await FileHelper.readFileAsText(file)
      return CryptoUtil.sha256(msg)
    },

    async uploadDocuments (...documents) {
      await Promise.all(documents.map(document =>
        uploadSingleDocument.apply(this, [document]))
      )

      async function uploadSingleDocument (document) {
        if (document.isUploaded) return
        await fileService.uploadSingleDocument(document)
      }
    },

    async getFileBlob (key) {
      return fileService.loadFileByURL(`${config.FILE_STORAGE}/${key}`)
    }
  }
}
