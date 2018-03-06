<template>

  <div class="field-outer">

    <div class="field">
      <i class="mdi mdi-calendar date-field__calendar-input"></i>

      <flat-pickr id="date"
                  class="date-input"
                  :config="config"
                  :value="value"
                  @input.native="onInput"
                  placeholder=" ">
      </flat-pickr>

      <label> {{ title }}</label>
    </div>

    <div class="error" :class="{ 'error--hidden': !error }">
      {{ error || 'no-err' }}
    </div>

  </div>

</template>

<script>
  import FlatPickr from 'vue-flatpickr-component'
  import moment from 'moment'
  import input from './input.mixin'

  export default {
    name: 'input-date-field',

    components: {
      FlatPickr
    },

    mixins: [input],

    props: {
      enableTime: {
        type: Boolean,
        default: true
      },
      disableBefore: {
        type: String,
        default: ''
      },
      disableAfter: {
        type: String,
        default: ''
      }
    },

    data () {
      return {
        date: '',
        config: {
          altInput: true,
          altFormat: this.enableTime ? 'F j, Y at H:i' : 'F j, Y',
          disableMobile: true,
          disable: [
            // (date) => {
            //   const now = moment(new Date())
            //   return moment(date).isBefore(now)
            // },
            (date) => {
              if (!this.disableBefore) return false
              const stamp = moment(this.disableBefore)
              return moment(date).isBefore(stamp)
            },
            (date) => {
              if (!this.disableAfter) return false
              const stamp = moment(this.disableAfter)
              return moment(date).isAfter(stamp)
            }
          ],
          enableTime: this.enableTime,
          time_24hr: true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .date-field__calendar-input {
    position: absolute;
    right: 5px;
    pointer-events: none;
  }
</style>
