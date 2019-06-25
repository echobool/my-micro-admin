<template>
  <create-menu-form :is-edit="false" />
</template>

<script>
import CreateMenuForm from './components/CreateMenuForm'

export default {
  name: 'MenuForm',
  components: { CreateMenuForm }
}
</script>

