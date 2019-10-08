<template>
  <create-push-template-form :is-edit="true" />
</template>

<script>
import CreatePushTemplateForm from './components/CreatePushTemplateForm'

export default {
  name: 'EditPushTemplate',
  components: { CreatePushTemplateForm }
}
</script>

