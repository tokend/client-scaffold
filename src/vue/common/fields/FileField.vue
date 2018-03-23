<template>
  <md-field>
    <label :for="id">{{ label }} ({{ i18n.max_size({ size: i18n.n(max) })}})</label>
    <md-file
      :id="id"
      :name="name"
      :value="value"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      @md-change="onChange"
    />
  </md-field>
</template>

<script>
  import FieldMixin from './field.mixin'
  import { MAX_FILE_MEGABYTES } from '../../../js/const/documents.const'
  import { EventDispatcher } from '../../../js/events/event_dispatcher'
  import { i18n } from '../../../js/i18n'
  import { commonEvents } from '../../../js/events/common_events'
  import { FileHelper } from '../../../js/helpers/file.helper'

  export default {
    name: 'file-field',
    mixins: [FieldMixin],
    props: {
      max: { type: Number, default: MAX_FILE_MEGABYTES }
    },
    data: _ => ({
      i18n
    }),
    computed: {
      maxB () {
        return this.max * 1024 * 1024
      }
    },
    methods: {
      async onChange (fileList) {
        const file = fileList[0]
        if (file.size > this.maxB) {
          EventDispatcher.dispatchShowErrorEvent(i18n.max_file_size_exceeded({ size: this.max }))
          this.clear()
          return
        }
        const extracted = await FileHelper.readFileAsArrayBuffer(file)
        const mimeType = file.type
        const name = file.name
        this.$emit(commonEvents.inputEvent, { file: extracted, mimeType, name })
      },
      clear () {
        this.$el
          .querySelectorAll('input')
          .forEach(input => setTimeout(() => { input.value = '' }, 20))
      }
    }
  }
</script>

<style scoped>

</style>
