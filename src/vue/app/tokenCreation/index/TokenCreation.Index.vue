<template>
  <token-creation-manager :id = "id"/>
</template>

<script>
import TokenCreationManager from './TokenCreation.Manager'

export default {
  components: { TokenCreationManager },
  props: ['id'],
  data: _ => ({
  })
}
</script>

<style lang="scss" scoped>

</style>
