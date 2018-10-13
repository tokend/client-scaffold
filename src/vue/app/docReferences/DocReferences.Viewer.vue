<template>
  <div class="doc-viewer app__page-content-wrp">
    <template v-if="reference">
      <div class="doc-viewer__header">
        <div class="doc-viewer__icon-wrp">
          <doc-icon :mime-type="reference.mimeType" :size="'4x'" />
        </div>
        <div class="doc-viewer__main-details-wrp">
          <p class="doc-viewer__main-detail">{{ reference.fileName }}</p>
          <p class="doc-viewer__main-detail">{{ reference.documentType }}</p>
          <p class="doc-viewer__main-detail">{{ reference.createdAt }}</p>
        </div>
      </div>
      <div class="doc-viewer__content">
        <div class="doc-viewer__description-wrp">
          <div class="doc-viewer__details">
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Counterparty:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.counterparty }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Creator:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.creator }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Date of Birth:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.dateOfBirth }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Document Type:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.documentType }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">File name:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.fileName }}
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
              <span class="doc-viewer__detail-key">Mime type:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.mimeType }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Mobile phone:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.mobilePhone }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Reference:</span>
              <span class="doc-viewer__detail-value">
                {{ reference.reference }}
              </span>
            </p>
            <p class="doc-viewer__detail">
              <span class="doc-viewer__detail-key">Serial number:</span>
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
          </div>
        </div>

        <div class="doc-viewer__state-viewer-wrp">
          <state-viewer
            :is-verified="isReferenceVerified"
            :is-pending="isPending"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ReferenceLoader from './reference-loader'
import ReferenceVerifier from './reference-verifier'

import DocIcon from './DocReferences.Icon'
import StateViewer from './DocReferences.StateViewer'

export default {
  components: {
    DocIcon,
    StateViewer
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
    isPending: false
  }),
  async created () {
    await this.loadReference(this.id)
    await this.verifyReference(this.reference.fileKey, this.reference.reference)
  }
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";
  @import "~@scss/mixins";

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

  .doc-viewer__detail-key {
    min-width: 15 * $point;
  }

  .doc-viewer__detail-value {
    color: $col-primary;
  }

  .doc-viewer__description-wrp {
    margin-bottom: 3.5 * $point;
  }
</style>
