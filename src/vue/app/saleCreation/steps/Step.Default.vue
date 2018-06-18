<template>
  <form class="step"
        novalidate
        @submit.prevent="submit">
    <template v-for="row in schema.rows">
      <div class="step__row">
        <template v-for="item in row">
          <h3 v-if="item.heading">{{ item.heading }}</h3>

          <input-field v-if="item.field === 'text'"

                       v-model="form[item.model]"
                       v-validate="item.validate"
                       class="step__input-field"
                       :name="item.name"
                       :id="item.id"
                       :required="item.required"
                       :label="item.label"
                       :type="item.type"
                       :key='item.id'
                       :errorMessage="errorMessage(item.name)"
          />
          <textarea-field v-if="item.field === 'textarea'"
                          v-model="form[item.model]"
                          v-validate="item.validate"
                          class="step__input-field"
                          :name="item.name"
                          :id="item.id"
                          :required="item.required"
                          :label="item.label"
                          :type="item.type"
                          :key='item.id'
                          :maxlength="item.maxlength"
                          :errorMessage="errorMessage(item.name)"
          />
          <file-field v-if="item.field === 'file'"
                      v-model="documents[item.type]"
                      class="step__file-field"
                      :fileType="item.fileType"
                      :private="item.private"
                      :label="item.label"
                      :type="item.type"
                      :id="item.id"
                      :key='item.id'
          />

          <select-field v-if="item.field === 'select'"
                      :name="item.name"
                      :id="item.id"
                      :label="item.label"
                      v-model="form[item.model]"
                      :key='item.id'/>

          <date-field v-if="item.field === 'date'"
                         v-model="form[item.model]"
                         v-validate="'required'"
                         :name="item.name"
                         :id="item.id"
                         :required="item.required"
                         :label="item.label"
                         :disableBefore="item.disableBefore"
                         :key='item.id'
                         :errorMessage="errorMessage(item.name)"
          />

        </template>
      </div>
    </template>

    <div class="step__action">
      <md-button type="submit" class="md-primary md-flat submit__btn" :disabled="isPending">
        {{ i18n.sale_next_step() }}
      </md-button>
    </div>
  </form>
</template>

<script>
  import StepMixin from './step.mixin'

  export default {
    name: 'Step-default',
    mixins: [ StepMixin ]
  }
</script>

<style scoped>
  @import './step.scss';
</style>
