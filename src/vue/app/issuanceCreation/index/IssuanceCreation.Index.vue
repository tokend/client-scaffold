<template>
  <issuance-creation-manual />
</template>

<script>
import IssuanceCreationManual from './IssuanceCreation.Manual'
import { i18n } from '../../../../js/i18n'

export default {
  components: { IssuanceCreationManual },
  props: ['id'],
  data: _ => ({
    i18n
  })
}
</script>

<style lang="scss" scoped>

</style>
