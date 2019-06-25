<template>
  <create-menu-form :is-edit="true" />
</template>

<script>
import CreateMenuForm from './components/CreateMenuForm'

export default {
  name: 'MenuEditForm',
  components: { CreateMenuForm }
}
</script>

