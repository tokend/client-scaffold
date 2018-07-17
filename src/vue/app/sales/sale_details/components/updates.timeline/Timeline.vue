<template>
  <div class="timeline">

    <div class="divider"></div>
    <button class="timeline__add-btn"
            @click="handleAddClick"
            v-if="sale.isMy"
    >
      <i class="mdi mdi-plus"></i>
    </button>

    <div class="timeline__timeline__inner">
      <timeline-item
        class="timeline__timeline-item"
        v-for="(item, i) in items"
        :key="i"
        :title="item.title"
        :date="i18n.d(item.date)"
        :message="linkify(item.message)"
      />
    </div>


  </div>

</template>

<script>
  import TimelineItem from './TimelineItem'
  import { commonEvents } from '../../../../../../js/events/common_events'
  import { i18n } from '../../../../../../js/i18n'
  export default {
    name: 'timeline',

    components: {
      TimelineItem
    },
    props: ['sale', 'items'],
    data: _ => ({
      i18n
    }),
    methods: {
      handleAddClick () {
        this.$emit(commonEvents.timelineAddClick)
      },
      linkify (text) {
        /*eslint-disable*/
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
        /*eslint-enable*/
        return text.replace(urlRegex, (url) => '<a href="' + url + '" target="_blank">' + url + '</a>')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/mixins";
  @import "../../../../../../scss/variables";

  .timeline {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .timeline__timeline__inner {
    padding: 60px 0;
  }

  .divider {
    @include center-horizontally;

    background: lighten($col-unfocused, 30%);
    height: 100%;
    position: absolute;
    width: 1px;

    @media (max-width: 767px) {
      display: none;
    }
  }

  .timeline__timeline-item {
    max-width: 300px;
    width: 300px;
    position: relative;

    &:after {
      background: lighten($col-unfocused, 30%);
      content: '';
      display: block;
      height: 1px;
      position: absolute;
      top: 10px;
      width: 39px;

      @media (max-width: 767px) {
        display: none;
      }
    }

    &:nth-child(2n-1) {
      transform: translateX(200px);

      &:after {
        left: 0;
        transform: translateX(-127%);
      }

      @media (max-width: 767px) {
        transform: none;
        margin-bottom: 60px;
      }
    }

    &:nth-child(2n) {
      text-align: right;
      transform: translateX(-200px);

      &:after {
        right: 0;
        transform: translateX(127%);
      }


      @media (max-width: 767px) {
        transform: none;
        margin-bottom: 60px;
      }
    }
  }

  .timeline__add-btn {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    background: $col-btn-text;
    z-index: 2;
    &:hover {
      background: $lightGray;
      cursor: pointer;
    }
  }
</style>
