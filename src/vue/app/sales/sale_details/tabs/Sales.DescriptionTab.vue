<template>
  <div class="overview">
    <template v-if="isLoaded">
      <markdown-formatter class="description__markdown-formatter"
                          :source="description"/>
    </template>

    <template v-else-if="isFailed">
      <p class="text danger">
        An error occurred. Please try again later.
      </p>
    </template>
    <template v-else>
      <p class="text">
        Loading...
      </p>
    </template>
  </div>
</template>

<script>
  import MarkdownFormatter from '../components/MarkDownFormatter'
  import { usersService } from '../../../../../js/services/users.service'
  export default {
    name: 'description-tab',

    components: {
      MarkdownFormatter
    },

    props: ['sale'],
    data () {
      return {
        description: '',
        isLoaded: false,
        isFailed: false
      }
    },

    created () {
      this.getDescription(this.sale)
    },

    computed: {
    },
    methods: {
      async getDescription ({ owner: userId, descriptionID: blobId }) {
        try {
          this.description = await usersService.blobsOf(userId).get(blobId)
          this.isLoaded = true
        } catch (error) {
          this.isFailed = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables';
  @import '../../../../../scss/mixins';

  .description__markdown-formatter {
    text-align: justify;
  }
</style>
