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
                    :maxlength="250"
    />
    <md-card-actions>
      <md-button class="btn" :disabled="isPending" @click="createUpdate">{{i18n.lbl_submit()}}</md-button>
    </md-card-actions>
  </div>
</template>

<script>
  import InputField from '../../../../common/fields/InputField'
  import FormMixin from '../../../../common/mixins/form.mixin'
  import { i18n } from '../../../../../js/i18n'
  import moment from 'moment'
  import { commonEvents } from '../../../../../js/events/common_events'
  import { confirmAction } from '../../../../../js/modals/confirmation_message'
  import { blobTypes, blobFilters } from '../../../../../js/const/const'
  import { usersService } from '../../../../../js/services/users.service'
  export default {
    name: 'add-update-form',

    components: {
      InputField
    },

    mixins: [FormMixin],
    props: ['sale'],

    data: _ => ({
      form: {
        title: '',
        message: ''
      },
      events: {
        closeEvent: commonEvents.closeEvent
      },
      i18n
    }),

    methods: {
      async createUpdate () {
        if (!await this.isValid()) return
        const confirmed = await confirmAction({ message: i18n.sale_upd_tab_warning() })
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
  @import "../../../../../scss/variables";

  .add-update-form__heading {
    display: inline-block;
    margin-right: 15px;
  }

  .add-update-form__cancel-btn {
    color: $col-text-accented;
    cursor: pointer;
    font-size: .8rem;
    text-decoration: underline;
  }

  .add-update-form__header {
    display: flex;
    align-items: center;
  }
</style>
