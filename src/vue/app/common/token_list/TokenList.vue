<template>
  <md-list class="md-triple-line">
    <md-list-item v-for="(token, key) in tokens" :key="key">

      <md-avatar>
        <img :src="token.logoURL" v-if="token.logoURL">
        <span v-else>{{ token.code.charAt(0) }}</span>
      </md-avatar>

      <div class="md-list-item-text">
        <span>{{ token.code }}</span>
        <span>{{ token.attachedDetails.balance }}</span>
        <span>{{ token.attachedDetails.convertedBalance }}</span>
      </div>

    </md-list-item>
  </md-list>
</template>

<script>
  export default {
    name: 'token-list',
    props: { tokens: { type: Array, required: true } }
  }
</script>

<style scoped>

</style>
