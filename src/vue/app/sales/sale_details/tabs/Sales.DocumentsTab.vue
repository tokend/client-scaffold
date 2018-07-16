<template>
  <div class="documents-tab">
    <p class="documents-tab__explain" v-if="sale.isMy">Valid legal documents allow investors to build trust in your syndicate</p>
    <!-- <no-data-message v-else-if="documents.length === 0 && !sale.isMy"
       heading="Uploaded documents will be listed here"
       message=""
    /> -->
    <p class="documents-tab__explain" v-else>
      Valid legal documents allow investors to build trust in the asset manager
    </p>

    <div class="documents-tab__file-input" v-if="sale.isMy">
      <file-field v-model="upload"
              label="Select File(s)"
              id="documents-tab__file-field"/>
    </div>

    <div class="documents-tab__docs-list" v-if="documents.length > 0">
      <template v-for="document in documents">
        <div class="documents-tab__file-download-wrp">
          <template v-if="sale.isMy">
            <button class="documents-tab__remove-btn icon-btn"
                    @click="removeDocument(document)"
                    :disabled="isPending"
            >
              <i class="mdi mdi-close-circle-outline"></i>
            </button>
          </template>

          <!-- <file-download
            class="documents-tab__file-download"
            :file="document"
            :isNamed="true"
          /> -->
        </div>
      </template>
    </div>

    <div class="btn-outer btn-outer--small" v-if="upload.file">
      <button class="btn" @click="submit" :disabled="isPending">
        Submit
      </button>
    </div>

  </div>
</template>

<script>
  import SubmitterMixin from '../../../../common/mixins/submitter.mixin'

  import FileField from '../../../../common/fields/FileField'
  // import FileDownload from '../../../../common/fields/FileDownload'
  // import NoDataMessage from '../../../../common/messages/NoDataMessage'

  import { i18n } from '../../../../../js/i18n'

  import { ErrorHandler } from '../../../../../js/errors/error_handler'
  import { EventDispatcher } from '../../../../../js/events/event_dispatcher'
  import { confirmAction } from '../../../../../js/modals/confirmation_message'
  import { blobTypes, blobFilters } from '../../../../../js/const/const'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../vuex/types'
  import { fileService } from '../../../../../js/services/file.service'
  import { usersService } from '../../../../../js/services/users.service'
  import _get from 'lodash/get'

  export default {
    name: 'documents-tab',

    components: {
      FileField
      // FileInput,
      // FileDownload,
      // NoDataMessage
    },
    props: ['sale'],

    mixins: [SubmitterMixin],

    data: _ => ({
      documents: [],
      upload: {
        mimeType: '',
        file: '',
        name: ''
      }
    }),

    computed: {
      ...mapGetters([
        vuexTypes.accountId
      ])
    },

    methods: {
      async submit () {
        if (!await confirmAction({
          title: i18n.confirm_upload_ttl,
          message: i18n.confirm_upload
        })) return
        const tokenCode = this.sale.baseAsset
        this.disable()
        try {
          const fileKey = await fileService.uploadFile({ type: 'fund_document', ...this.upload })
          await usersService.blobsOf(this.accountId).create(
            blobTypes.fundDocument.str,
            {
              type: this.upload.mimeType,
              name: this.upload.name,
              key: fileKey
            },
            { [blobFilters.tokenCode]: tokenCode }
          )
          await this.getDocuments()
          this.reset()
        } catch (error) {
          console.error(error)
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      },
      async getDocuments () {
        if (!_get(this.sale, 'baseAsset')) return
        this.documents = await usersService
          .blobsOf(this.sale.owner)
          .getAll({
            [blobFilters.tokenCode]: this.sale.baseAsset,
            [blobFilters.type]: blobTypes.fundDocument.num
          })
      },
      async removeDocument (document) {
        if (!await confirmAction({})) return
        this.disable()
        try {
          await usersService.blobs.delete(document.blobId)
          await this.getDocuments()
          EventDispatcher.dispatchShowSuccessEvent('Document deleted')
        } catch (e) {
          ErrorHandler.processUnexpected(e)
        }
        this.enable()
      },
      reset () {
        this.upload.file = ''
        this.upload.mimeType = ''
      }
    },
    watch: {
      sale: {
        handler: 'getDocuments',
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';
  .documents-tab {
    padding: 60px 30px 20px;
  }

  .documents-tab__no-docs-message {
    text-align: center;
    i {
      font-size: $material-icon-xx-super-big;
    }
  }

  .documents-tab__file-input {
    margin-top: 30px;
    text-align: center;
  }

  .documents-tab__explain {
    color: $col-info;
    font-size: $fs-tip;
    text-align: center;
  }

  .documents-tab__docs-list {
    margin: 40px auto;
    max-width: 460px;
    width: 100%;
    z-index: 1;
  }

  .documents-tab__file-download-wrp {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .documents-tab__remove-btn {
    i { color: $col-danger }
  }
</style>
