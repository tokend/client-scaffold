<template>
  <md-card>
    <md-card-content>
      <div class="app__no-data-msg">
        <md-icon class="md-size-4x">{{ icon }}</md-icon>
        <h2>{{ title }}</h2>
        <p>{{ descr }}</p>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
  export default {
    name: 'not-available',
    props: {
      icon: { type: String, required: true },
      title: { type: String, required: true },
      descr: { type: String, required: true }
    }
  }
</script>
