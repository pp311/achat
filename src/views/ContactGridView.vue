<script setup lang="ts">
import ContactTable from '@/components/ContactGrid/ContactTable.vue'
import ContactGridActionLine from '@/components/ContactGrid/ContactGridActionLine.vue'
</script>

<template>
  <div class="w-[90%] mx-auto flex flex-col h-[calc(100vh-49px)] pt-8">
    <ContactGridActionLine/>
    <ContactTable/>
  </div>
</template>

<style scoped>

</style>