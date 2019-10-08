<template>
  <create-push-template-form :is-edit="false" />
</template>

<script>
import CreatePushTemplateForm from './components/CreatePushTemplateForm'

export default {
  name: 'CreatePushTemplate',
  components: { CreatePushTemplateForm }
}
</script>

