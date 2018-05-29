<template>
  <form class="step" @submit.prevent="submit">
    <h3>{{ i18n.sale_tell_about_fund() }}</h3>
    <div class="step-row">
        <div class="video-container">
            <a @click="uploadVideo = true">Upload video from YouTube</a>
            <md-dialog-prompt
                :md-active.sync="uploadVideo"
                v-model="form.youtubeId"
                md-title="You can find YouTube video ID in it's URL"
                md-input-maxlength="30"
                md-input-placeholder="Type your YouTube video ID..."
                md-confirm-text="Done" />

            <iframe :src="`https://www.youtube.com/embed/${form.youtubeId}`"
                    width="320px" height="180px"
                    v-if="form.youtubeId"></iframe>
        </div>
    </div>
    <div class="step-row">
      <description-editor class="description-step__editor" v-model="form.description"/>
    </div>  
    <div class="step__action">
      <md-button type="submit" class="md-primary md-flat">
        {{ i18n.sale_create_sale() }}
      </md-button>
    </div>
  </form>
</template>

<script>
  import StepMixin from './step.mixin'
  import DescriptionEditor from '../components/DescriptionEditor'
  import { ASSET_POLICIES, documentTypes } from '../../../../js/const/const'
  import { i18n } from '../../../../js/i18n'

  import { commonEvents } from '../../../../js/events/common_events'
  import { ErrorHandler } from '../../../../js/errors/error_handler'
  // import { fileService } from '../../../../js/services/file.service'

  import _cloneDeep from 'lodash/cloneDeep'
  export default {
    name: 'StepCreateSale',
    mixins: [StepMixin],
    components: {
      DescriptionEditor
    },
    data: _ => ({
      form: {
        sale: '',
        description: '',
        youtubeId: ''
      },
      i18n,
      documentTypes,
      ASSET_POLICIES,
      uploadVideo: false
    }),

    created () {
      this.form.sale = _cloneDeep(this.sale)
    },

    methods: {
      async submit () {
        if (!await this.isValid()) return
        this.disable()
        try {
          this.enable()
          this.$emit(commonEvents.saleUpdateEvent, {
            form: this.form,
            documents: this.documents
          })
          this.$emit(commonEvents.saleEditEndEvent)
        } catch (error) {
          this.enable()
          ErrorHandler.processUnexpected(error)
        }
      }
    }
  }
</script>

<style scoped>
  @import './step.scss';

  .step-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .video-container {
    display: flex;
    flex-direction: column;
  }
</style>
