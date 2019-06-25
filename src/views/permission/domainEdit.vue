<template>
  <create-domain-form :is-edit="true" />
</template>

<script>
import CreateDomainForm from './components/CreateDomainForm'

export default {
  name: 'DomainEditForm',
  components: { CreateDomainForm }
}
</script>

