<template>
  <token-creation-manager :id = "id" 
                          :rejectedId = "rejectedId"/>
</template>

<script>
import TokenCreationManager from './TokenCreation.Manager'

export default {
  components: { TokenCreationManager },
  props: ['id', 'rejectedId'],
  data: _ => ({
  })
}
</script>

<style lang="scss" scoped>

</style>
