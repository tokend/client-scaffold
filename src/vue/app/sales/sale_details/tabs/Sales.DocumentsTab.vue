<template>
  <div class="documents-tab">
    <p class="documents-tab__explain" v-if="sale.isMy">{{i18n.sale_doc_tab_title_is_my()}}</p>

    <div class="no-data-msg__wrapper" v-else-if="documents.length === 0 && !sale.isMy">

      <i class="no-data-msg__icon material-icons">search</i>
      <h2>{{i18n.sale_doc_tab_docs_is_my()}}</h2>

    </div>
    <p class="documents-tab__explain" v-else>
      {{i18n.sale_doc_tab_docs_desc()}}
    </p>
    <div class="documents-tab__docs-list" v-if="documents.length > 0">
      <template v-for="document in documents">
        <div class="documents-tab__file-download-wrp">
          <div class="file-download">

            <a :href="getUrl(document)" class="file-download__link" download>
              <i class="mdi mdi-download"></i>
              <span class="file-download__file-name" :title="document.name">{{ document.name }}</span>
            </a>

            <a :href="getUrl(document)" class="view-btn" target="_blank" rel="noopener">
              <span>View  <i class="material-icons">open_in_new</i></span>
            </a>
          </div>
        </div>
      </template>
    </div>
    <div class="documents-tab__file-input" v-if="sale.isMy">
      <file-field v-model="upload"
              label="Select File(s)"
              id="documents-tab__file-field"/>
    </div>
      <md-button class="documents-tab__file-submit" 
                v-if="upload.file"
                @click="submit" 
                :disabled="isPending">
        {{i18n.lbl_submit()}}
      </md-button>
  </div>
</template>

<script>
  import SubmitterMixin from '../../../../common/mixins/submitter.mixin'
  import FileField from '../../../../common/fields/FileField'
  import { i18n } from '../../../../../js/i18n'

  import { ErrorHandler } from '../../../../../js/errors/error_handler'
  import { EventDispatcher } from '../../../../../js/events/event_dispatcher'
  import { confirmAction } from '../../../../../js/modals/confirmation_message'
  import { blobTypes, blobFilters } from '../../../../../js/const/const'
  import { fileService } from '../../../../../js/services/file.service'
  import { usersService } from '../../../../../js/services/users.service'
  import _get from 'lodash/get'
  import config from '../../../../../config'

  export default {
    name: 'documents-tab',

    components: {
      FileField
    },
    props: ['sale'],

    mixins: [SubmitterMixin],

    data: _ => ({
      i18n,
      documents: [],
      upload: {
        mimeType: '',
        file: '',
        name: ''
      }
    }),

    methods: {
      async submit () {
        if (!await confirmAction({
          title: i18n.sale_confirm_upload_ttl(),
          message: i18n.sale_confirm_upload()
        })) return
        const tokenCode = this.sale.baseAsset
        this.disable()
        try {
          const fileKey = await fileService.uploadFile({ ...this.upload, type: 'fund_document' })
          await usersService.blobsOf(this.sale.owner).create(
            blobTypes.fundDocument.str,
            {
              type: this.upload.mimeType,
              name: this.upload.name,
              key: fileKey
            },
            { [blobFilters.tokenCode]: tokenCode }
          )
          EventDispatcher.dispatchShowSuccessEvent(i18n.sale_upload_success())
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
      reset () {
        this.upload.file = ''
        this.upload.mimeType = ''
      },
      getUrl (file) {
        if (file.key) return `${config.FILE_STORAGE}/${file.key}`
        if (file.url) return file.url
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
    padding-top: 1rem;
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
    max-width: 460px;
    margin: 40px auto;
    width: 100%;
  }

  .documents-tab__file-download-wrp {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .documents-tab__remove-btn {
    font-size: 1rem;
    margin-right: 1rem;
    i { color: $col-danger }
  }

    .file-download {
    display: flex;
  }

  .file-download__link {
    color: $col-text;
    text-decoration: none;
    display: flex;
    align-items: center;
    i {
      font-size: $material-icon-big;
      margin-right: 10px;
    }
  }

  .view-btn {
    color: $col-active;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: $fs-tip;
    margin-left: 15px;
    text-decoration: underline;


    i {
      font-size: $fs-tip;
      color: $col-active;
      margin-left: 5px;
    }
  }

  .file-download__file-name {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .no-data-msg__wrapper {
    display: flex;
    flex-direction: column;
    text-align: center;
    color: $col-text-secondary;
  }

  .no-data-msg__icon {
    font-size: $material-icon-xx-super-big;
    color: $col-background;
  }
</style>
