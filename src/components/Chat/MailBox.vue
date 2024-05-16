<script setup lang="ts">
import MailList from '@/components/Chat/MailList.vue'
import MailDetail from '@/components/Chat/MailDetail.vue'
</script>

<template>
  <div class="w-[55%] bg-base-300 flex flex-col items-start px-4">
    <slot/>

    <MailList/>
<!--      <MailDetail/>-->
  </div>
</template>

<style scoped>

</style>