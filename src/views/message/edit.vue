<template>
  <create-template-form :is-edit="true" />
</template>

<script>
import CreateTemplateForm from './components/CreateTemplateForm'

export default {
  name: 'CreateForm',
  components: { CreateTemplateForm }
}
</script>

