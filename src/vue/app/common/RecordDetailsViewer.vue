<template>
  <table class="record-viewer app__table-details">
    <tr
      class="record-viewer__row-wrp"
      v-for="(value, key) in tx.detailsView"
      :key="key"
    >
      <!-- {{ snakeCase(key) }} -->
      <td class="record-viewer__td" v-if="value">
        {{ getLabel(key) | translate }}
      </td>
      <td class="record-viewer__td" v-if="value">
        {{ tx | processor({value, key}) }}
      </td>
    </tr>
  </table>
</template>

<script>
import { formatAmount } from '@/vue/common/filters/formatAmount'
import { translate } from '@/vue/common/filters/translate'
import { humanizePastDate, getDateByDMY } from '@/js/utils/dates.util'
import cloneDeep from 'lodash/cloneDeep'
import snakeCase from 'lodash/snakeCase'

export default {
  filters: {
    processor (tx, { value, key }) {
      // TODO: handle locale change
      let result = ''
      switch (value.type) {
        case 'formatAmount':
          result = formatAmount(tx[key]) + ' ' + value.asset
          break

        case 'translate':
          result = translate(tx[key])
          break

        case 'formatDate':
          result = getDateByDMY(tx[key])
          break

        case 'formatDateTime':
          result = humanizePastDate(tx[key])
          break

        case 'boolean':
          result = value.value
          break

        default:
          result = result = cloneDeep(tx[key])
          break
      }
      return result
    }
  },
  props: {
    tx: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    snakeCase,
    getLabel (key) {
      return 'tx_' + snakeCase(key)
    }
  }
}
</script>

<style scoped>
  .record-viewer__td {
    border: none;
  }
</style>
