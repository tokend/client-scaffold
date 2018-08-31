<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="markdown" />
</template>

<script>
export default {
  name: 'markdown-parser',
  props: {
    markdown: { type: String, required: true }
  }
}
</script>
