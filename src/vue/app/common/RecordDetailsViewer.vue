<template>
  <table class="record-viewer app__table-details">
    <tr
      class="record-viewer__row-wrp"
      v-for="(value, key) in tx.detailsView"
      :key="key"
    >
      <td class="record-viewer__td" v-if="value">
        {{ getLabel(key) | translate }}
      </td>
      <td class="record-viewer__td" v-if="value">
        {{ tx | processor({name: value, arg: key}) }}
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
    processor (tx, { name, arg }) {
      // TODO: handle locale change
      let result = ''
      switch (name.processor) {
        case 'formatAmount':
          result = formatAmount(tx[arg]) + ' ' + name.processorArg.asset
          break

        case 'translate':
          result = translate(tx[arg])
          break

        case 'formatDate':
          result = getDateByDMY(tx[arg])
          break

        case 'formatDateTime':
          result = humanizePastDate(tx[arg])
          break

        case 'processedValue':
          result = name.processorArg.value
          break

        default:
          result = result = cloneDeep(tx[arg])
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
