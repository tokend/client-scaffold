<template>
  <!-- <div class="sale-details" v-if="this.sale">
    <textarea name="" id="" cols="30" rows="10">{{sale}}</textarea>
    <div class="sale-details__header">
      <p class="sale-details__main">
        <span class="sale-details__io-name">{{ sale.details.name }}</span>
        <span class="sale-details__io-token">{{ sale.base_asset }}</span>
      </p>

      <p  class="sale-details__io-description">{{ sale.shortDescription }}</p>
    </div>
  </div> -->
  <div class="sale-details">
    <i class="material-icons">error_outline</i>
    <h2>Unfortunately, this feature is not implemented yet</h2>
  </div>
</template>

<script>
  // import { mapGetters, mapActions } from 'vuex'
  import { salesService } from '../../../js/services/sales.service'
  export default {
    name: 'sale-details',
    props: ['id'],
    components: {},

    data: _ => ({
      sale: ''
    }),

    async created () {
      if (this.id) {
        this.sale = await salesService.loadSaleById(this.id)
      }
    },

    computed: {
    },

    methods: {
    },

    watch: {
    }
  }
</script>

<style lang="scss">
  @import '../../../scss/variables';
  @import '../../../scss/mixins';

 .sale-details {
   padding: 12px;
   text-align: center;
   background: $col-content-block;
   border-radius: 2px;
   box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.08);
   i {
     font-size: $material-icon-xx-super-big;
     margin-bottom: 20px;
   }
 }
</style>
