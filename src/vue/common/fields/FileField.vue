<template>
  <div class="file-field__outer">
    <div class="file-field">
      <div class="file-field__label">
        {{ label }}
      </div>
      <label :for="id" class="file-field__uploader">
        <md-icon class="file-field__icon md-icon-size-075x">insert_drive_file</md-icon>{{ i18n.fi_upload_file({ size: i18n.n(max) })}}
      </label>
      <input type="file"
             class="file-field__input"
             :id="id"
             :name="name"
             :required="required"
             :disabled="disabled"
             :placeholder="placeholder"
             accept="image/png, image/jpeg, application/pdf"
             @change="onChange"
      />
    </div>
    <p class="file-field__file-name">
      <button v-if="value && value.file" class="link-btn" type="button" @click="viewNew">
        <span>{{ value.name }}</span>
        <md-icon class="file-field__link-icon md-icon-size-065x">open_in_new</md-icon>
      </button>

      <a :href="fileUrl" target="_blank" v-else-if="value">
        <span>{{ value.name }}</span>
        <md-icon class="file-field__link-icon md-icon-size-065x">open_in_new</md-icon>
      </a>

      <span v-else>{{ i18n.fi_no_file_chosen() }}</span>
    </p>
  </div>
</template>

<script>
  import FieldMixin from './field.mixin'
  import { DocumentContainer } from '../../../js/helpers/DocumentContainer'
  import { MAX_FILE_MEGABYTES } from '../../../js/const/documents.const'
  import { EventDispatcher } from '../../../js/events/event_dispatcher'
  import { dispatchAppEvent } from '../../../js/events/helpers'
  import { commonEvents } from '../../../js/events/common_events'
  import { i18n } from '../../../js/i18n'
  import config from '../../../config'

  export default {
    name: 'file-field',
    mixins: [FieldMixin],
    props: {
      max: { type: Number, default: MAX_FILE_MEGABYTES },
      type: { type: String, default: 'default' },
      private: { type: Boolean, default: false },
      minFileSize: { type: Number, default: null },
      maxFileSize: { type: Number, default: null },
      minWidth: { type: Number, default: null },
      minHeight: { type: Number, default: null }
    },
    data: _ => ({
      fileName: '',
      privateUrl: '',
      i18n,
      fileStorage: config.FILE_STORAGE
    }),
    computed: {
      maxB () {
        return this.max * 1024 * 1024
      },
      fileUrl () {
        if (!this.value) return ''
        if (this.value.file) {
          return this.value.dataUrl
        }
        if (!this.private) {
          return this.value.publicUrl
        }
        return this.value.privateUrl
      }
    },
    async created () {
      if (this.private && this.value) {
        await this.handlePrivate()
      }
    },
    methods: {
      async onChange (event) {
        const fileList = event.target.files || event.dataTransfer.files
        const file = fileList[0]
        if (file.size > this.maxB) {
          EventDispatcher.dispatchShowErrorEvent(i18n.max_file_size_exceeded({ size: this.max }))
          this.clear()
          return
        }
        this.$emit(commonEvents.inputEvent, new DocumentContainer({
          mimeType: file.type,
          type: this.type,
          name: file.name,
          file: file
        }))
      },
      async handlePrivate () {
        if (this.value.derivePrivateUrl) {
          await this.value.derivePrivateUrl()
        }
      },
      clear () {
        this.$el
          .querySelectorAll('input')
          .forEach(input => { input.value = '' })
      },
      viewNew () {
        if (!this.fileUrl) return
        dispatchAppEvent(commonEvents.openFileViewEvent, this.fileUrl)
      }
    },
    watch: {
      async value (value) {
        if (!value.key) {
          await this.value.deriveDataUrl()
          return
        }
        if (this.private) {
          await this.handlePrivate()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';
  @import '../../../scss/mixins';

  .file-field__outer {
    display: flex;
    align-items: center;
    margin-bottom: .8rem;
  }

  .file-field {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .file-field__label {
    font-size: $fs-tip;
    color: $col-unfocused;
  }

  .file-field__uploader {
    background: $col-md-primary;
    border-radius: 3px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    color: $col-md-primary-txt;
    display: block;
    cursor: pointer;
    margin-right: .5rem;
    padding: .75rem 1rem;
    width: 12.5rem;
    transition: .4s cubic-bezier(.4,0,.2,1);

    &:hover {
      background: lighten($col-md-primary, 3.5%);
    }
  }

  .file-field__icon {
    color: $col-md-primary-txt!important;
    margin-right: .5rem;
    position: relative;
    bottom: .05rem;
  }

  .file-field__input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .file-field__file-name {
    position: relative;
    top: .55rem;
  }

  .link-btn {
    border: none;
    background: none;
    cursor: pointer;
    color: $col-md-primary;

    &:hover {
      text-decoration: underline;
    }

    &:focus {
      outline: none;
    }
  }
</style>
