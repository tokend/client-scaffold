<template >
  <div class="app__no-data-message">
    <md-icon v-if="iconName" class="md-size-4x">{{ iconName }}</md-icon>
    <h2>{{ msgTitle }}</h2>
    <p>{{ msgMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'no-data-message',
  props: {
    iconName: { type: String, default: '' },
    msgTitle: { type: String, required: true },
    msgMessage: { type: String, required: true }
  }
}
</script>
