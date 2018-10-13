<template>
  <div :class="classObj">
    <div class="state-viewer__inner">
      <div class="state-viewer__icon">
        <template v-if="isVerified">
          <md-icon class="md-size-4x">verified_user</md-icon>
        </template>
        <tempate v-else>
          <md-icon class="md-size-4x">error</md-icon>
        </tempate>
      </div>
      <div class="state-viewer__text">
        <template v-if="isVerified">
          <h3 class="state-viewer__heading">{{ i18n.doc_verified() }}</h3>
          <p class="state-viewer__msg">{{ i18n.doc_verified_exp() }}</p>
        </template>
        <template v-else>
          <h3 class="state-viewer__heading">{{ i18n.doc_hash_mismatch() }}</h3>
          <p class="state-viewer__msg">{{ i18n.doc_hash_mismatch_exp() }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '../../../js/i18n'
export default {
  props: {
    isVerified: {
      type: Boolean,
      default: false
    },
    isPending: {
      type: Boolean,
      default: false
    }
  },
  data: _ => ({
    i18n
  }),
  computed: {
    classObj () {
      return {
        'state-viewer': true,
        'state-viewer--verified': this.isVerified,
        'state-viewer--not-verified': !this.isVerified
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";

  .state-viewer {
    padding: 1 * $point 0;

    @mixin state-viewer ($color) {
      border-top: 1px solid $color;
      border-bottom: 1px solid $color;
      color: $color;
      background: rgba($color, .15);

      .state-viewer__icon i {
        color: $color!important;
      }
    }

    &--verified {
      @include state-viewer($col-success)
    }

    &--not-verified {
      @include state-viewer($col-accent)
    }
  }

  .state-viewer__heading {
    margin-bottom: 1*$point;
  }

  .state-viewer__inner {
    display: flex;
  }

  .state-viewer__icon {
    margin-right: 2 * $point;
  }
</style>
