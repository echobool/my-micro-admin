<template>
  <create-role-form :is-edit="true" />
</template>

<script>
import CreateRoleForm from './components/CreateRoleForm'

export default {
  name: 'RoleEditForm',
  components: { CreateRoleForm }
}
</script>

