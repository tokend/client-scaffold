<template>
  <section v-show="isActive"
          :aria-hidden="! isActive"
          class="app-tabs__panel"
          :id="hash"
          :disabled="disabled"
          role="tabpanel"
  >
    <slot />
  </section>
</template>

<script>
  export default {
    props: {
      disabled: { type: Boolean, default: false },
      id: { default: null },
      name: { required: true },
      prefix: { default: '' },
      suffix: { default: '' },
      isDisabled: { default: false }
    },

    data: () => ({
      isActive: false,
      isVisible: true
    }),

    computed: {
      header () {
        return this.prefix + this.name + this.suffix
      },

      hash () {
        if (this.isDisabled) return '#'

        return this.id
               ? '#' + this.id
               : '#' + this.name.toLowerCase().replace(/ /g, '-')
      }
    }
  }
</script>
