import config from '../../config'
import { fileService } from '../services/file.service'
import { FileHelper } from './file.helper'

/**
 * Wrapper to simplify work with documents
 */
export class DocumentContainer {
  /**
   * @param {object} [opts]
   * @param {File} [opts.file] - file representing a document
   * @param {string} [opts.key] - key to access file in storage
   * @param {string} opts.name - file name
   * @param {string} opts.mimeType - file MIME type
   * @param {string} opts.type - document type {@link documentTypes} of the document (!! nothing common with MIME-type)
   */
  constructor (opts) {
    if (!opts.file && !opts.key) {
      throw new Error('Document initialized without raw file or file key')
    }
    this.mimeType = opts.mimeType
    this.file = opts.file
    this.name = opts.name
    this.type = opts.type
    this.key = opts.key

    this._arrayBuffer = []
    this._privateUrl = ''
    this._dataUrl = ''
  }

  getDetailsForSave () {
    return {
      mimeType: this.mimeType,
      name: this.name,
      type: this.type,
      key: this.key
    }
  }

  /**
   * URL from where the public file can be downloaded. (!! works only with public files, private urls should be derived by {@link derivePrivateUrl}
   * @returns {string} publicUrl
   */
  get publicUrl () {
    if (!this.key) return ''
    return `${config.FILE_STORAGE}/${this.key}`
  }

  /**
   * URL from where the private file can be downloaded. Call {@link derivePrivateUrl} before using this getter
   * @returns {string} privateURL
   */
  get privateUrl () {
    return this._privateUrl
  }

  /**
   * Data URL of the new file to allow browser open it before uploaded. Call {@link deriveDataUrl} before using this getter
   * @returns {string} dataUrl
   */
  get dataUrl () {
    return this._dataUrl
  }

  /**
   * File converted to AB format. You should upload files in this format. Call {@link deriveArrayBuffer} before using this getter
   * @returns {ArrayBuffer} arrayBuffer
   */
  get arrayBuffer () {
    return this._arrayBuffer
  }

  async derivePrivateUrl () {
    if (!this.key) {
      throw new Error('To derive private url file must be already uploaded and contain the key')
    }
    const details = await fileService.loadDocumentDetailsById(this.key)
    this._privateUrl = details.data('url')
  }

  async deriveDataUrl () {
    if (!this.file) {
      throw new Error('Data url can be derived only if raw file is present')
    }
    this._dataUrl = await FileHelper.readFileAsDataURL(this.file)
  }

  async deriveArrayBuffer () {
    if (!this.file) {
      throw new Error('Array buffer can be derived only if file is present')
    }
    this._arrayBuffer = await FileHelper.readFileAsArrayBuffer(this.file)
  }
}
