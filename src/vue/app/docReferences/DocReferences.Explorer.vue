<template>
  <div class="explorer">
    <div class="explorer__filters">
      <input-field-unchained
        v-model="filters.lastName"
        :label="i18n.doc_lbl_last_name()"
        class="explorer__filter"
      />
      <input-field-unchained
        v-model="filters.taxId"
        :label="i18n.doc_lbl_tax_id()"
        class="explorer__filter"
      />
      <input-field-unchained
        v-model="filters.mobilePhone"
        :label="i18n.doc_lbl_mobile_phone()"
        class="explorer__filter"
      />
      <input-field-unchained
        v-model="filters.serialNumber"
        :label="i18n.doc_lbl_serial_number()"
        class="explorer__filter"
      />
    </div>

    <div class="explorer__list-wrp">
      <doc-list :list="filteredList" />
    </div>
  </div>
</template>

<script>
import DocList from './DocReferences.List'
import ReferenceListLoader from './reference-list-loader'
import InputFieldUnchained from '@/vue/common/fields/InputFieldUnchained'

import { i18n } from '../../../js/i18n'

export default {
  components: {
    DocList,
    InputFieldUnchained
  },
  mixins: [ReferenceListLoader],
  data: _ => ({
    i18n,
    filters: {
      lastName: '',
      mobilePhone: '',
      serialNumber: '',
      taxId: ''
    }
  }),
  computed: {
    filteredList () {
      return this.references
        .filter(i => !this.filters.lastName ||
                     i.lastName.includes(this.filters.lastName))
        .filter(i => !this.filters.mobilePhone ||
                     i.mobilePhone.includes(this.filters.mobilePhone))
        .filter(i => !this.filters.serialNumber ||
                     i.serialNumber.includes(this.filters.serialNumber))
        .filter(i => !this.filters.taxId ||
                     i.taxId.includes(this.filters.taxId))
    }
  },
  created () {
    this.loadReferenceList()
  }
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";

  .explorer__filters {
    display: flex;
    margin-bottom: 3 * $point;
  }

  .explorer__filter {
    &:not(:last-child) {
      margin-right: 1 * $point;
    }
  }

  .explorer__list-wrp {
    display: flex;
    justify-content: center;
    margin: auto;
  }

</style>
