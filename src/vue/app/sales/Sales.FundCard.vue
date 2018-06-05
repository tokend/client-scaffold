<template>
  <div class="card">
    <div class="card__image-wrp">
      <img :src="imgUrl || getUrl" alt="">
    </div>

    <div class="card__content">
      <div class="card__header">
        <h3 class="card__name">{{ sale.name }}</h3>
      </div>
      <p class="card__description">{{ sale.shortDescription }}</p>
      <div class="card__progress-wrp">
        <invest-progress-bar :sale="sale" :barHeight="'1.2rem'"/>
      </div>
    </div>

    <div class="card__state-tip"
        :class="`card__state-tip--${stateTip}`">
      {{ stateTip }}
    </div>

  </div>
</template>

<script>
  import { humanizeFutureDate } from '../../../js/utils/dates.util'
  import config from '../../../config'
  import _get from 'lodash/get'
  import InvestProgressBar from './Sales.ProgressBar'

  export default {
    name: 'fund-card',
    components: { InvestProgressBar },
    props: ['sale', 'hasEditRedirect', 'imgUrl'],
    data: _ => ({
    }),
    computed: {
      stateTip () {
        if (this.sale.isCanceled) return 'cancelled'
        if (this.sale.isUpcoming) return 'upcoming'
        if (this.sale.isClosed) return 'finished'
        return ''
      },
      getUrl () {
        const key = _get(this.sale, '_record.details.logo.key')
        if (!key) return ''
        return `${config.FILE_STORAGE}/${key}`
      }
    },
    methods: {
      humanizeFutureDate
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables';
  @import '../../../scss/mixins';

  $padding-side: 20px;

  $ratio_16: 335px;
  $ratio_9: $ratio_16 * (9/16);

  .card {
    $height: 26rem;
    font-weight: 200;
    overflow: hidden;
    position: relative;
    height: $height;
    max-height: $height;
    min-height: $height;
    width: $ratio_16;

    &:before {
      bottom: 0;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
  }


  .card__image-wrp {
    position: relative;
    height: $ratio_9;
    width: $ratio_16;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .card__content {
    padding: 1.2rem 1rem;
    position: relative;
    height: 15rem;

    &:before {
      background-size: 120%;
      background-position: 31% 83%;
      background-repeat: no-repeat;
      bottom: 0;
      content: '';
      left: 0;
      right: 0;
      position: absolute;
      opacity: 0.03;
      top: 0;
    }
  }

  .card__name {
    font-weight: 200;
  }

  .card__header {
    margin-bottom: 1rem;
    position: relative;
  }

  .card__syndicate {
    color: $col-active;
    font-style: italic;
  }


  .card__syndicate,
  .card__description {
    font-size: $fs-tip;
  }

  .card__description {
    margin-bottom: 3rem;

    $line-height: 1.15rem;
    $max-lines: 4;
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: $max-lines;
    -webkit-box-orient: vertical;
    line-height: $line-height;
    max-height: 4.6rem;
    min-height: 4.6rem;
  }

  .card__progress-wrp {
    @include center-horizontally;

    bottom: 2rem;
    position: absolute;
    width: 88%;
  }

  .card__state-tip {
    position: absolute;
    top: 0;
    right: 0;
    padding: .5rem 3rem;
    transform: translate(32%,33%) rotate(45deg);
    color: $col-msg-text;

    &--upcoming { background: $col-pending }
    &--finished { background: $col-success }
    &--cancelled { background: $col-danger }
  }

</style>
