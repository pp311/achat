<script setup lang="ts">
import MailList from '@/components/Chat/MailList.vue'
import MailDetail from '@/components/Chat/MailDetail.vue'
import MailCompose from '@/components/Chat/MailCompose.vue'
import { ref } from 'vue'

const currentComponent = ref(MailList)

const changeComponent = (component: any) => {
  currentComponent.value = component
}
</script>

<template>
  <div class="w-[58%] bg-base-300 flex flex-col items-start">
    <slot/>

<!--    <MailList/>-->
<!--      <MailDetail/>-->
    <KeepAlive>
      <component
        :is="currentComponent"
        :changeComponent="changeComponent"
      />
    </KeepAlive>
  </div>
</template>

<style scoped>

</style>