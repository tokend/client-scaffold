<template>
  <div class="updates-tab">

    <transition name="fade">
      <add-update-form v-if="isAddFormOpened && updatesLoaded"
                       class="updates-tab__add-form"
                       :sale="sale"
                       @close="closeForm"
                       @timeline-add-finished="getUpdates"
      />
    </transition>

    <transition name="fade">
      <timeline v-if="!isAddFormOpened && updates.length > 0 && updatesLoaded"
                @timeline-add-click="openForm"
                class="updates-tab__timeline"
                :items="updates"
                :sale="sale"
      />
    </transition>

    <empty-timeline-message
              class="updates-tab__no-updates-msg"
              @timeline-add-click="openForm"
              :sale="sale"
              v-if="updates.length === 0 && !isAddFormOpened && updatesLoaded"/>

  </div>
</template>

<script>
  import Timeline from '../components/updates.timeline/Timeline'
  import EmptyTimelineMessage from '../components/updates.timeline/TimelineEmpty'
  import AddUpdateForm from '../components/updates.timeline/TimelineAddForm'

  import { blobTypes, blobFilters } from '../../../../../js/const/const'
  import { usersService } from '../../../../../js/services/users.service'

  export default {
    name: 'updates-tab',

    components: {
      Timeline,
      EmptyTimelineMessage,
      AddUpdateForm
    },
    props: ['sale'],
    data: _ => ({
      isAddFormOpened: false,
      updates: [],
      updatesLoaded: false
    }),

    methods: {
      async getUpdates () {
        if (!this.sale || !this.sale.id) return
        this.updates = await usersService
          .blobsOf(this.sale.owner)
          .getAll({
            [blobFilters.fundID]: this.sale.id,
            [blobFilters.type]: blobTypes.fundUpdate.num
          })
        this.updatesLoaded = true
      },
      openForm () {
        this.isAddFormOpened = true
      },
      closeForm () {
        this.isAddFormOpened = false
      }
    },
    watch: {
      sale: {
        handler: 'getUpdates',
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>

  .updates-tab {
    min-height: 300px;
  }

  .updates-tab__no-updates-msg,
  .updates-tab__add-form {
    max-width: 440px;
    margin: auto;
    padding-bottom: 30px;
  }

</style>
