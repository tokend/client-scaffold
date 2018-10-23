<template>
  <div class="doc-viewer app__page-content-wrp">
    <template v-if="isPending">
      <loader :message="i18n.docs_loading()" />
    </template>

    <template v-else-if="reference && !isFailed">
      <div class="doc-viewer__hash-wrp">
        <h2>Document hash: <clipboard-field :value="reference.reference" /></h2>
      </div>

      <div class="doc-viewer__header">
        <div class="doc-viewer__icon-wrp">
          <doc-icon :mime-type="reference.mimeType" :size="'4x'" />
        </div>
        <div class="doc-viewer__main-details-wrp">
          <p class="doc-viewer__main-detail">{{ reference.fileName }}</p>
          <p class="doc-viewer__main-detail">{{ reference.documentType }}</p>
          <p class="doc-viewer__main-detail">{{ reference.createdAt }}</p>

          <template v-if="isReferenceVerified">
            <p class="doc-viewer__download-link-wrp">
              <a
                :href="`${config.FILE_STORAGE}/${reference.fileKey}`"
                :download="reference.fileName"
              >
                Download file
              </a>
            </p>
          </template>
        </div>
      </div>
      <div class="doc-viewer__content">
        <div class="doc-viewer__description-wrp">
          <div class="doc-viewer__details">
            <h3 class="doc-viewer__details-heading">
              {{ i18n.docs_creator() }}
            </h3>

            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Public Key:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.creator }}
              </span>
            </p>

            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">First name:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.firstName }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Last name:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.lastName }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Date of Birth:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.dateOfBirth }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Passport:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.serialNumber }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Tax ID:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.taxId }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Mobile phone:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.mobilePhone }}
              </span>
            </p>

            <h3 class="doc-viewer__details-heading">
              {{ i18n.docs_file_details() }}
            </h3>

            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">File name:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.fileName }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Mime type:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.mimeType }}
              </span>
            </p>

            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Document Type:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.documentType }}
              </span>
            </p>

            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Counterparty:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.counterparty }}
              </span>
            </p>
          </div>
        </div>

        <div class="doc-viewer__state-viewer-wrp">
          <state-viewer
            :is-reference-verified="isReferenceVerified"
            :is-reference-broken="isReferenceBroken"
            :is-file-missing="isFileMissing"
            :is-meta-modified="isMetaModified"
          />
        </div>
      </div>
    </template>

    <template v-else>
      Failed to load reference
    </template>
  </div>
</template>

<script>
import ReferenceLoader from './reference-loader'
import ReferenceVerifier from './reference-verifier'
import ClipboardField from '@/vue/common/fields/ClipboardField'

import DocIcon from './DocReferences.Icon'
import StateViewer from './DocReferences.StateViewer'
import Loader from '@/vue/app/common/Loader'

import { i18n } from '../../../js/i18n'

import config from '../../../config'

export default {
  components: {
    DocIcon,
    StateViewer,
    ClipboardField,
    Loader
  },
  mixins: [
    ReferenceLoader,
    ReferenceVerifier
  ],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data: _ => ({
    i18n,
    config,
    isPending: false,
    isFailed: false
  }),
  async created () {
    this.isPending = true
    try {
      await this.loadReference(this.id)
      await this.verifyReference(this.reference)
    } catch (e) {
      console.error(e)
      this.isFailed = true
    }
    this.isPending = false
  }
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";
  @import "~@scss/mixins";

  .doc-viewer__hash-wrp {
    margin-bottom: 3 * $point;

    h2 {
      color: $col-primary;
    }
  }

  .doc-viewer__header {
    align-items: center;
    display: flex;
    margin-bottom: 3 * $point;
  }

  .doc-viewer__icon-wrp {
    margin-right: 2 * $point;
  }

  .doc-viewer__detail-key,
  .doc-viewer__detail-value {
    display: inline-block;
  }

  .doc-viewer__detail {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .doc-viewer__details-heading {
    color: $col-primary;
    margin-top: 1.5 * $point;
    margin-bottom: .75 * $point;
  }

  .doc-viewer__detail-key {
    min-width: 15 * $point;
  }

  .doc-viewer__detail-value {
    color: $col-primary;
  }

  .doc-viewer__description-wrp {
    margin-bottom: 3.5 * $point;
  }

  .doc-viewer__download-link-wrp {
    text-decoration: underline;
  }
</style>
