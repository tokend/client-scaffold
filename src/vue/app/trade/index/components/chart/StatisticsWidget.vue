<template>
  <div class="statistics-widget">

    <div class="statistics-widget__statistics-detail">

      <div class="statistics-detail__value">

        <span class="number">
          {{ $number.localize(value, 0) }}
        </span>

        <span :class="`asset asset--${asset}`">
          {{ asset }}
        </span>
      </div>

      <div class="statistics-widget__explain statistics-widget__explain--action">
        {{ action }}
      </div>

    </div>

    <div class="statistics-widget__statistics-detail statistics-widget__statistics-detail--tablet-hidden ">

      <div class="statistics-detail__value">

        <span class="number">
          {{ difference }}
        </span>

        <span :class="`asset asset--${asset}`">
          {{ asset }}
        </span>

      </div>


      <div class="statistics-detail__explain">
        since last {{ scale }}
      </div>

    </div>


    <div class="statistics-widget__statistics-detail statistics-widget__statistics-detail--tablet-hidden " v-if="data[0] && data[0] > 0">

      <div class="statistics-detail__value">

        <span class="number">
          {{ percentDifference }}
        </span>

        <span class="asset">
          %
        </span>

      </div>

      <div class="statistics-widget__explain">
        since last {{ scale }}
      </div>


    </div>

  </div>
</template>

<script>
  export default {
    name: 'statistics-widget',

    components: {
      // components
    },

    props: ['data', 'asset', 'scale', 'isPending', 'action', 'currentCap'],

    computed: {
      cap () {
        return this.currentCap
      },
      value () {
        let value
        if (this.data && this.data.length) value = this.data[this.data.length - 1]
        else value = this.currentCap
        return this.$number.roundUp(value || 0, 3)
      },
      difference () {
        const firstValue = this.data[0] || 0
        const value = this.value || 0
        const difference = value - firstValue
        const roundPoints = difference > 999 ? 0 : difference > 99 ? 1 : 2
        const rounded = this.$number.localize(difference, roundPoints)
        return difference >= 0 ? `+${rounded}` : `${rounded}`
      },
      percentDifference () {
        const firstValue = this.data[0]
        const difference = this.value - firstValue
        if (difference === 0) return 0
        console.log(difference / firstValue)
        console.log(difference)
        console.log(firstValue)
        const percentDifference = this.$number.localize((difference / firstValue) * 100, 0, false)
        return difference >= 0 ? `+${percentDifference}` : `${percentDifference}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/variables";

  .statistics-widget {
    display: flex;
    padding: 0 100px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 50px;

    @media (max-width: 1396px) {
      padding: 0 ;
    }
  }

  .statistics-widget__statistics-detail {
    display: flex;
    flex-direction: column;
    align-items: center;

    &--tablet-hidden {
      @media (max-width: 875px) {
        display: none;
      }
    }
  }

  .statistics-detail__value {
    font-family: 'Raleway', sans-serif;
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;

    .number {
      font-size: 64px;
      line-height: 80%;
      margin-right: 10px;
    }

    .asset {
      font-size: 24px;
    }

    .asset--SUN {
      color: $col-active;
    }
  }

  .statistics-widget__explain {
    &--action {
      align-self: flex-start;
    }
  }

</style>
