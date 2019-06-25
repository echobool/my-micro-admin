<template>
  <create-role-form :is-edit="false" />
</template>

<script>
import CreateRoleForm from './components/CreateRoleForm'

export default {
  name: 'RoleForm',
  components: { CreateRoleForm }
}
</script>

