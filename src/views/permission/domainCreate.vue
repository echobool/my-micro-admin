<template>
  <create-domain-form :is-edit="false" />
</template>

<script>
import CreateDomainForm from './components/CreateDomainForm'

export default {
  name: 'DomainForm',
  components: { CreateDomainForm }
}
</script>

