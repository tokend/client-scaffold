<template>
  <div class="timeout-ticker">
    Time left: {{ timeLeftFormatted }}
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'timeout-ticker',
  props: {
    timeout: {
      type: Number, // ms
      required: true
    }
  },
  data: _ => ({
    timeLeft: null,
    intervalId: null,
    moment
  }),
  computed: {
    timeLeftFormatted () {
      return moment
        .utc(moment.duration(this.timeLeft, 'seconds').asMilliseconds())
        .format('HH:mm:ss')
    }
  },
  created () {
    this.timeLeft = this.timeout
    this.startTicker()
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  methods: {
    startTicker () {
      this.intervalId = setInterval(() => {
        this.timeLeft--
      }, 1000)
    }
  }
}
</script>
