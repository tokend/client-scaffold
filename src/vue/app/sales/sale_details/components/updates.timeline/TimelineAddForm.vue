<template>
  <div class="add-update-form app__specified-form">
    <div class="add-update-form__header">
      <h2 class="add-update-form__heading">{{i18n.sale_upd_tab_add_update()}}</h2>
      <md-button class="add-update-form__cancel-btn" @click="$emit(events.closeEvent)">{{i18n.lbl_cancel()}}</md-button>
    </div>


    <input-field
      v-model="form.title"
      class="input-field"
      title="Title"
    />

    <textarea-field v-model="form.message"
                    v-validate="'required'"
                    class="step__input-field"
                    :maxlength="symbols"
    />
    <md-card-actions>
      <md-button class="btn" :disabled="!isAllowedToSubmit" @click="createUpdate">{{i18n.lbl_submit()}}</md-button>
    </md-card-actions>
  </div>
</template>

<script>
  import InputField from '../../../../../common/fields/InputField'
  import FormMixin from '../../../../../common/mixins/form.mixin'
  import SubmitterMixin from '../../../../../common/mixins/submitter.mixin'
  import { i18n } from '../../../../../../js/i18n'
  import moment from 'moment'
  import { commonEvents } from '../../../../../../js/events/common_events'
  import { confirmAction } from '../../../../../../js/modals/confirmation_message'
  import { blobTypes, blobFilters } from '../../../../../../js/const/const'
  import { usersService } from '../../../../../../js/services/users.service'
  export default {
    name: 'add-update-form',

    components: {
      InputField
    },

    mixins: [SubmitterMixin, FormMixin],
    props: ['sale'],

    data () {
      return {
        form: {
          title: '',
          message: ''
        },
        events: {
          closeEvent: commonEvents.closeEvent
        },
        i18n
      }
    },

    computed: {
      symbols () {
        return 220
      },
      isAllowedToSubmit () {
        return this.form.title &&
               this.form.message &&
               this.form.message.length <= this.symbols &&
              !this.isPending
      }
    },

    methods: {
      async createUpdate () {
        const confirmed = await confirmAction({ message: 'You won\'t be able to edit or delete update later' })
        if (!confirmed) return
        this.disable()
        try {
          const date = moment() // .format('MMMM Do')
          await usersService.blobsOf(this.sale.owner).create(
            blobTypes.fundUpdate.str,
            {
              ...this.form,
              date
            },
            { [blobFilters.fundID]: this.sale.id }
          )
          this.$emit(commonEvents.timelineAddFinished)
          this.$emit(commonEvents.closeEvent)
        } catch (error) {
          console.error(error)
          error.showBanner(i18n.unexpected_error)
        }
        this.enable()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/variables";

  .add-update-form__heading {
    display: inline-block;
    margin-right: 15px;
  }

  .add-update-form__cancel-btn {
    color: $col-active;
    cursor: pointer;
    font-size: $fs-tip;
    text-decoration: underline;
  }

  .add-update-form__header {
    display: flex;
    align-items: center;
  }
</style>
