<template>
  <div class="updates-tab">

    <add-update-form v-if="isAddFormOpened && updatesLoaded"
                      class="updates-tab__add-form"
                      :sale="sale"
                      @close="closeForm"
                      @timeline-add-finished="getUpdates"
    />

    <timeline v-if="!isAddFormOpened && updates.length > 0 && updatesLoaded"
              @timeline-add-click="openForm"
              class="updates-tab__timeline"
              :items="updates"
              :sale="sale"
    />

    <template v-if="updates.length === 0 && !isAddFormOpened && updatesLoaded">
      <div class="empty-timeline-message">
        <i class="empty-timeline-message__icon material-icons">search</i>
        <p v-if="isMy">{{i18n.sale_upd_tab_share_updates()}}</p>
        <p v-else>{{i18n.sale_upd_tab_important_updated()}}</p>

        <md-button class="md-primary md-raised"
                v-if="isMy"
                @click="openForm">{{i18n.sale_upd_tab_add_timeline()}}</md-button>
      </div>
    </template>
  </div>
</template>

<script>
  import Timeline from '../components/UpdatesTab.Timeline'
  import AddUpdateForm from '../components/UpdatesTab.Timeline.AddForm'

  import { blobTypes, blobFilters } from '../../../../../js/const/const'
  import { usersService } from '../../../../../js/services/users.service'
  import { i18n } from '../../../../../js/i18n'
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '../../../../../vuex/types'

  export default {
    name: 'updates-tab',

    components: {
      Timeline,
      AddUpdateForm
    },
    props: ['sale'],
    data: _ => ({
      isAddFormOpened: false,
      updates: [],
      updatesLoaded: false,
      i18n
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountId
      ]),
      isMy () {
        return this.sale.owner === this.accountId
      }
    },
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
  @import "../../../../../scss/variables";
  .updates-tab {
    min-height: 300px;
  }

  .updates-tab__no-updates-msg,
  .updates-tab__add-form {
    max-width: 440px;
    margin: auto;
    padding-bottom: 30px;
  }

  .empty-timeline-message {
    text-align: center;
  }

  .empty-timeline-message__icon {
    font-size: $material-icon-xx-super-big;
  }

</style>
