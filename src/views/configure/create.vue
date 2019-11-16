<template>
  <create-user-form :is-edit="false" />
</template>

<script>
import CreateUserForm from './components/CreateUserForm'

export default {
  name: 'CreateForm',
  components: { CreateUserForm }
}
</script>

