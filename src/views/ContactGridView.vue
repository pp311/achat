<script setup lang="ts">

import ContactTable from '@/components/ContactGrid/ContactTable.vue'
import ContactGridActionLine from '@/components/ContactGrid/ContactGridActionLine.vue'
import Pagination from '@/components/Pagination.vue'
</script>

<template>
  <div class="w-[90%] mx-auto flex flex-col h-[calc(100vh-72px)] pt-8">
    <ContactGridActionLine/>
    <ContactTable/>
    <div class="flex-grow place-content-end mb-4">
      <Pagination/>
    </div>
  </div>
</template>

<style scoped>

</style>